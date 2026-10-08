import { useState, useEffect } from "react";
import {
  Bike,
  Clock,
  Code2,
  Info,
  Instagram,
  MapPin,
  MessageCircle,
  Navigation,
  ShoppingBag,
  Star,
  Store,
  X,
} from "lucide-react";
import { business } from "@/data/business";

const serviceIcons = [Bike, ShoppingBag, Store];

const developerWhatsappMessage =
  "Olá, Rhenan! Vi o site que você desenvolveu para a Torre de Pizza e gostaria de conversarmos sobre um design baseado na identidade visual da minha empresa gratuitamente, e já ter informação sobre o preço. Sem compromisso, enrolação e perda de tempo!";
const developerWhatsappUrl = `https://wa.me/5521973152056?text=${encodeURIComponent(developerWhatsappMessage)}`;

function WhatsappIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.4 11.6a8.4 8.4 0 0 1-12.5 7.35L3 20.5l1.5-4.75A8.4 8.4 0 1 1 20.4 11.6Z" />
      <path d="M8.15 8.1c.35-.42.72-.27.9-.02l1.05 1.48c.18.25.13.58-.08.8l-.62.65c-.18.2-.2.48-.04.7.7.96 1.58 1.76 2.6 2.37.23.14.51.1.69-.1l.6-.7c.2-.23.53-.3.8-.14l1.58.93c.28.17.38.52.23.8-.4.75-1.1 1.45-1.95 1.62-1.44.29-3.7-.87-5.45-2.57-1.78-1.74-2.96-4-2.72-5.45.13-.82.7-1.74 1.41-2.37Z" />
    </svg>
  );
}

function InformationModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  const whatsappMessage = encodeURIComponent(
    "Olá! Gostaria de mais informações sobre a Torre de Pizza.",
  );
  const whatsappUrl = `https://wa.me/${business.whatsapp}?text=${whatsappMessage}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label="Fechar informações"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="information-title"
        className="animate-rise relative z-10 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-[2rem] border border-[#dccdb2] bg-[#faf5ec] p-5 text-[#4e3220] shadow-2xl sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7a8450]">Contato e localização</p>
            <h2 id="information-title" className="mt-2 font-display text-2xl font-semibold text-[#2f4a32]">
              Informações
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#6f6457]">
              Fale com a Torre de Pizza, acesse o Instagram ou abra a rota direto no Google Maps.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#e8d9be] text-[#2f4a32] hover:bg-[#dccdb2] transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 space-y-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-4 rounded-2xl border border-[#dccdb2] bg-[#f1e7d5]/50 p-4 transition hover:border-[#2f4a32]/40 hover:bg-[#e8d9be]/50"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#2f4a32] text-[#faf5ec]">
              <MessageCircle className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-[#2f4a32]">WhatsApp</span>
              <span className="block truncate text-sm text-[#6f6457]">{business.phone}</span>
            </span>
            <span className="text-xs font-semibold text-[#2f4a32]">Abrir</span>
          </a>

          <a
            href={business.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-4 rounded-2xl border border-[#dccdb2] bg-[#f1e7d5]/50 p-4 transition hover:border-[#2f4a32]/40 hover:bg-[#e8d9be]/50"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#b23a26] text-[#faf5ec]">
              <Instagram className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-[#2f4a32]">Instagram</span>
              <span className="block truncate text-sm text-[#6f6457]">{business.instagram}</span>
            </span>
            <span className="text-xs font-semibold text-[#2f4a32]">Abrir</span>
          </a>

          <a
            href={business.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-4 rounded-2xl border border-[#dccdb2] bg-[#f1e7d5]/50 p-4 transition hover:border-[#2f4a32]/40 hover:bg-[#e8d9be]/50"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#7a8450] text-[#faf5ec]">
              <Navigation className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-[#2f4a32]">Como chegar</span>
              <span className="block truncate text-sm text-[#6f6457]">Campo Grande, Rio de Janeiro - RJ</span>
            </span>
            <span className="text-xs font-semibold text-[#2f4a32]">Rota</span>
          </a>
        </div>

        <div className="mt-5 border-t border-[#dccdb2] pt-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#25D366]/35 bg-[#25D366]/10 px-3.5 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#25D366] text-white">
                <WhatsappIcon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#159447]">Desenvolvedor do site</p>
                <p className="flex items-center gap-1 truncate text-sm font-semibold text-[#2f4a32]">
                  <span>Rhenan</span>
                  <Code2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                </p>
              </div>
            </div>

            <a
              href={developerWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Falar com Rhenan pelo WhatsApp no número (21) 97315-2056"
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-[#25D366] px-3.5 py-2 text-xs font-bold text-white transition hover:brightness-95 shadow-sm"
            >
              <WhatsappIcon className="h-3.5 w-3.5" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  const [informationOpen, setInformationOpen] = useState(false);
  const [isOpenNow, setIsOpenNow] = useState(true);

  useEffect(() => {
    const checkOpen = () => {
      const now = new Date();
      const h = now.getHours();
      // Aberto das 18h às 00h (e até 01h da madrugada)
      setIsOpenNow(h >= 18 || h < 1);
    };
    checkOpen();
    const timer = setInterval(checkOpen, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <section id="topo" className="relative isolate min-h-[92svh] overflow-hidden bg-[#e8d9be] pt-24 pb-16 lg:min-h-[100svh] lg:pt-32 lg:pb-24">
        {/* Background Texture & Soft Ambient Glow */}
        <div className="padrao-marca pointer-events-none absolute inset-0 opacity-[0.20]" />
        <div className="pointer-events-none absolute top-1/2 -right-[12%] hidden aspect-square w-[62%] -translate-y-1/2 rounded-full bg-[#2f4a32] lg:block shadow-2xl" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:min-h-[660px] lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-8">
          
          {/* Coluna Esquerda: Conteúdo, Badges e Botões da Torre de Pizza */}
          <div className="relative z-10 animate-surgir">
            
            {/* Top Branding & Status Tag */}
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2.5">
                <span className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-[#b23a26] bg-[#b23a26] shadow-md">
                  <img src="/logo.webp" alt={business.name} className="h-full w-full object-cover" onError={(e) => {
                    // Fallback to stylized letter if logo is unavailable
                    e.currentTarget.style.display = 'none';
                  }} />
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold leading-none text-[#2f4a32]">{business.name}</h3>
                  <span className="text-[11px] font-bold uppercase tracking-[0.20em] text-[#b23a26]">Sabor e tradição • Desde sempre</span>
                </div>
              </div>

              {/* Status Aberto/Fechado com Ponto Verde Pulsante */}
              <span className="inline-flex items-center gap-2 rounded-full bg-[#2f4a32]/10 px-3 py-1 text-xs font-semibold text-[#2f4a32] shadow-sm">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-600" />
                </span>
                {isOpenNow ? "Aberto agora · Fecha às 00:00" : "Fechado agora · Abre às 18:00"}
              </span>
            </div>

            {/* Headline com Estilo Italiano Palazzo */}
            <h1 className="font-display text-[clamp(2.6rem,6.8vw,5.4rem)] leading-[0.98] font-semibold tracking-[-0.03em] text-[#2f4a32]">
              Sabor de verdade <em className="font-bold text-[#b23a26] not-italic">em cada fatia.</em>
            </h1>

            {/* Descrição */}
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[#4e3220]/90 sm:text-lg">
              Massa artesanal, ingredientes frescos e aquele sabor que transforma qualquer noite em Campo Grande.
            </p>

            {/* Badges de Avaliação, Cidade e Horário (Preservados do Print) */}
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2.5 text-sm font-medium text-[#4e3220]">
              <span className="inline-flex items-center gap-1.5 font-bold text-[#b23a26] bg-[#faf5ec]/80 px-2.5 py-1 rounded-full shadow-sm">
                <Star className="h-4 w-4 fill-current text-[#b23a26]" />
                {business.rating.toLocaleString("pt-BR", { minimumFractionDigits: 1 })}
                <span className="font-normal text-[#6f6457]">({business.reviews} avaliações)</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-[#7a8450]" />
                {business.city}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-[#7a8450]" />
                {business.hours}
              </span>
            </div>

            {/* Service Chips (Delivery, Retirada, No local) */}
            <div className="mt-5 flex flex-wrap gap-2">
              {business.services.map((service, index) => {
                const Icon = serviceIcons[index] ?? Bike;
                return (
                  <span
                    key={service}
                    className="inline-flex items-center gap-2 rounded-full border border-[#dccdb2] bg-[#faf5ec]/90 px-3.5 py-1.5 text-xs font-semibold text-[#2f4a32] shadow-sm backdrop-blur"
                  >
                    <Icon className="h-3.5 w-3.5 text-[#b23a26]" />
                    {service}
                  </span>
                );
              })}
            </div>

            {/* BOTÕES DE AÇÃO DO PRINT (Ver Cardápio + Informações) */}
            <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center">
              <a
                href="#cardapio"
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#eab308] hover:bg-[#ca8a04] px-8 py-4 text-base font-bold text-[#2f4a32] shadow-[0_12px_28px_rgba(202,138,4,0.35)] transition-all hover:scale-[1.02] active:scale-95"
              >
                <span>Ver cardápio</span>
                <span className="grid size-7 place-items-center rounded-full bg-black/10 transition-transform group-hover:translate-x-1">
                  →
                </span>
              </a>

              <button
                type="button"
                onClick={() => setInformationOpen(true)}
                className="inline-flex items-center justify-center gap-2.5 rounded-full border-2 border-[#2f4a32]/30 bg-[#faf5ec]/80 hover:bg-[#faf5ec] hover:border-[#2f4a32] px-7 py-3.5 text-base font-bold text-[#2f4a32] transition-all shadow-sm active:scale-95"
              >
                <Info className="h-5 w-5 text-[#b23a26]" />
                <span>Informações</span>
              </button>
            </div>
          </div>

          {/* Coluna Direita: A Assinatura Visual Palazzo (Pizza 360°, Ingredientes Flutuantes e Selo SVG) */}
          <div className="relative order-first mx-auto aspect-square w-[82%] max-w-[26rem] sm:max-w-[34rem] lg:order-none lg:w-full lg:max-w-none">
            
            {/* Círculo de fundo verde manjericão em telas menores */}
            <div className="pointer-events-none absolute top-1/2 left-1/2 aspect-square w-[104%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2f4a32] lg:hidden shadow-2xl" />

            {/* Manjericão Flutuante (animate-flutuar) */}
            <img
              alt="Folhas de manjericão fresco"
              loading="lazy"
              width="220"
              height="220"
              decoding="async"
              className="absolute -top-3 left-0 z-20 w-[24%] animate-flutuar drop-shadow-xl [--giro:-20deg]"
              src="/manjericao.webp"
            />

            {/* Tomates Frescos Flutuantes (animate-flutuar com delay) */}
            <img
              alt="Tomates frescos selecionados"
              loading="lazy"
              width="240"
              height="240"
              decoding="async"
              className="absolute right-0 bottom-3 z-20 w-[27%] animate-flutuar drop-shadow-xl [--giro:15deg] [animation-delay:-3s]"
              src="/tomates.webp"
            />

            {/* Pizza Artesanal em Rotação Contínua 360° (animate-girar) */}
            <div className="absolute inset-[4%] animate-girar">
              <img
                alt="Pizza artesanal da Torre de Pizza"
                width="1024"
                height="1024"
                decoding="async"
                className="size-full object-contain drop-shadow-[0_40px_50px_rgba(23,38,25,0.55)]"
                src="/hero-calabresa-catupiry.webp"
              />
            </div>

            {/* Selo Circular Artesanal Rotativo em SVG com Nota 4,2 */}
            <div className="grid place-items-center absolute bottom-[6%] left-[2%] z-20 size-[28%] min-h-24 min-w-24 rounded-full bg-[#faf5ec] text-[#2f4a32] shadow-2xl border-2 border-[#dccdb2]">
              <svg viewBox="0 0 200 200" className="absolute inset-0 size-full animate-girar [animation-duration:30s]" aria-hidden="true">
                <defs>
                  <path id="selo-torre" d="M100 100m-76 0a76 76 0 1 1 152 0a76 76 0 1 1 -152 0" />
                </defs>
                <circle cx="100" cy="100" r="97" fill="none" stroke="currentColor" strokeWidth="1.2" />
                <circle cx="100" cy="100" r="58" fill="none" stroke="currentColor" strokeWidth="1" />
                <text fill="currentColor" fontSize="14" fontWeight="700" letterSpacing="3" className="font-sans uppercase">
                  <textPath href="#selo-torre" textLength="473.5" lengthAdjust="spacing">
                    TORRE DE PIZZA • SABOR E TRADIÇÃO • CAMPO GRANDE • 
                  </textPath>
                </text>
              </svg>

              <div className="relative grid size-[52%] place-items-center text-center">
                <span className="leading-none">
                  <span className="block font-display text-[clamp(1.1rem,2.6vw,1.8rem)] font-bold italic text-[#2f4a32]">4,2</span>
                  <span className="mt-0.5 block text-[clamp(0.5rem,1vw,0.65rem)] font-bold tracking-[0.14em] uppercase text-[#b23a26]">nota</span>
                </span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Modal de Informações Completo com WhatsApp do Rhenan */}
      <InformationModal open={informationOpen} onClose={() => setInformationOpen(false)} />
    </>
  );
}
