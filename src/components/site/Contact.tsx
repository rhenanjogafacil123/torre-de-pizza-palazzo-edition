import { MapPin, Navigation, Phone } from "lucide-react";
import { business } from "@/data/business";

export function Contact() {
  const openMaps = () => {
    window.open(business.mapsUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <section id="contato" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
      <div className="overflow-hidden rounded-[2rem] bg-gradient-primary p-8 shadow-lift sm:p-12">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold">Onde nos encontrar</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-primary-foreground sm:text-4xl">
              Venha, retire ou receba em casa
            </h2>
            <div className="mt-6 space-y-4 text-primary-foreground/85">
              <p className="flex items-start gap-3 text-sm leading-relaxed">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                {business.address}
              </p>
              <p className="flex items-center gap-3 text-sm">
                <Phone className="h-5 w-5 shrink-0 text-gold" />
                {business.phone}
              </p>
            </div>
          </div>

          <div className="relative z-10 flex flex-col justify-center gap-3">
            <button
              type="button"
              onClick={openMaps}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary-foreground/10 px-6 py-4 text-sm font-semibold text-primary-foreground backdrop-blur"
            >
              <Navigation className="h-4 w-4" />
              Como chegar
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
