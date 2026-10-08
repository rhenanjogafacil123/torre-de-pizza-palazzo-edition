import { business } from "@/data/business";

export type DeliveryQuote = {
  distanceKm: number;
  fee: number | null;
};

type Coordinates = {
  lat: number;
  lon: number;
};

let lastGeocodeRequestAt = 0;
let cachedStoreCoordinates: Coordinates | null = null;

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function waitForGeocoderSlot() {
  const elapsed = Date.now() - lastGeocodeRequestAt;
  const minimumInterval = 1100;
  if (elapsed < minimumInterval) await wait(minimumInterval - elapsed);
  lastGeocodeRequestAt = Date.now();
}

async function geocodeAddress(value: string): Promise<Coordinates> {
  await waitForGeocoderSlot();

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("limit", "1");
  url.searchParams.set("countrycodes", "br");
  url.searchParams.set("q", value);

  const response = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
      "Accept-Language": "pt-BR,pt;q=0.9",
    },
  });

  if (!response.ok) throw new Error("Não foi possível consultar o endereço agora.");

  const results = (await response.json()) as Array<{ lat?: string; lon?: string }>;
  const result = results[0];
  const lat = Number(result?.lat);
  const lon = Number(result?.lon);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    throw new Error("Não encontramos esse endereço. Confira rua, número e bairro.");
  }

  return { lat, lon };
}

async function getStoreCoordinates() {
  if (cachedStoreCoordinates) return cachedStoreCoordinates;
  cachedStoreCoordinates = await geocodeAddress(`${business.address}, Brasil`);
  return cachedStoreCoordinates;
}

async function getMotorcycleDistanceKm(origin: Coordinates, destination: Coordinates) {
  const request = {
    locations: [
      { lat: origin.lat, lon: origin.lon, radius: 100 },
      { lat: destination.lat, lon: destination.lon, radius: 100 },
    ],
    costing: "motorcycle",
    units: "km",
    directions_type: "none",
    directions_options: { units: "km" },
  };

  // valhalla.openstreetmap.de é a interface web. A API pública fica no
  // subdomínio valhalla1.openstreetmap.de.
  const url = new URL("https://valhalla1.openstreetmap.de/route");
  url.searchParams.set("json", JSON.stringify(request));

  let response: Response;
  try {
    response = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
    });
  } catch {
    throw new Error("Não foi possível acessar o serviço de rota de motocicleta agora. Tente novamente em instantes.");
  }

  let data: {
    trip?: { summary?: { length?: number } };
    error?: string;
    error_code?: number;
    status_message?: string;
  } = {};

  try {
    data = (await response.json()) as typeof data;
  } catch {
    if (!response.ok) {
      throw new Error("O serviço de rota de motocicleta não respondeu corretamente. Tente novamente.");
    }
  }

  if (!response.ok) {
    const reason = data.error || data.status_message;
    throw new Error(
      reason
        ? `Não foi possível calcular a rota de motocicleta: ${reason}.`
        : "Não foi possível calcular a rota de motocicleta agora.",
    );
  }

  const distanceKm = Number(data.trip?.summary?.length);

  if (!Number.isFinite(distanceKm) || distanceKm < 0) {
    throw new Error("Não foi possível obter a distância da rota de motocicleta para esse endereço.");
  }

  return Math.round(distanceKm * 10) / 10;
}

export function calculateDeliveryFee(distanceKm: number) {
  const pricing = business.deliveryPricing;
  if (pricing.amount === null) return null;
  if (!Number.isFinite(distanceKm) || distanceKm < 0) return null;

  const everyKm = Math.max(pricing.everyKm, 0.1);
  const rawFee =
    pricing.calculation === "blocks"
      ? Math.ceil(distanceKm / everyKm) * pricing.amount
      : (distanceKm / everyKm) * pricing.amount;

  const fee = Math.max(pricing.minimumFee, rawFee);
  return Math.round(fee * 100) / 100;
}

export async function getDeliveryQuote(customerAddress: string): Promise<DeliveryQuote> {
  const cleanAddress = customerAddress.trim();
  if (!cleanAddress) throw new Error("Informe o endereço para calcular a entrega.");

  const origin = await getStoreCoordinates();
  const destination = await geocodeAddress(`${cleanAddress}, ${business.city}, Brasil`);
  const distanceKm = await getMotorcycleDistanceKm(origin, destination);

  const maximumDistance = business.deliveryPricing.maximumDistanceKm;
  if (maximumDistance !== null && distanceKm > maximumDistance) {
    throw new Error(`O endereço está fora do raio de entrega de ${maximumDistance} km.`);
  }

  return {
    distanceKm,
    fee: calculateDeliveryFee(distanceKm),
  };
}
