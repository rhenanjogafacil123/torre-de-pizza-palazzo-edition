import { business } from "@/data/business";

// Build the emoji at runtime so WhatsApp receives a clean UTF-8 encoded message.
const developerWhatsappMessage =
  "Olá, Rhenan! " +
  String.fromCodePoint(0x1f44b) +
  " Vi o site que você desenvolveu para a Torre de Pizza e gostaria de entender melhor como funciona seu serviço e os valores para criar um site para minha empresa.";
const developerWhatsapp = `https://wa.me/5521973152056?text=${encodeURIComponent(developerWhatsappMessage)}`;

function WhatsappIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-8 w-8 shrink-0"
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

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary text-lg">🍕</span>
            <div className="min-w-0">
              <p className="truncate font-display font-semibold text-foreground">{business.name}</p>
              <p className="truncate text-xs text-muted-foreground">{business.hours}</p>
            </div>
          </div>
          <p className="text-right text-xs text-muted-foreground">
            © {new Date().getFullYear()} {business.name}
          </p>
        </div>

        <div className="mt-6 pt-6 text-center">
          <p className="flex items-center justify-center gap-2 text-[15px] text-muted-foreground">
            <span className="font-mono text-lg font-black text-red-500" aria-hidden="true">&lt;/&gt;</span>
            <span>
              Desenvolvido por <strong className="font-bold text-red-500">Rhenan</strong>
            </span>
          </p>

          <a
            href={developerWhatsapp}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Falar com Rhenan pelo WhatsApp no número (21) 97315-2056"
            className="mx-auto mt-3 flex min-h-[62px] w-full max-w-[360px] items-center justify-center gap-3 rounded-2xl border border-[#25D366] px-5 py-2.5 text-left transition hover:bg-[#25D366]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
          >
            <span className="flex h-8 w-8 shrink-0 self-center items-center justify-center text-[#25D366]">
              <WhatsappIcon />
            </span>
            <span className="flex min-h-10 flex-col justify-center leading-none">
              <strong className="block text-lg font-extrabold leading-none text-foreground">(21) 97315-2056</strong>
              <small className="mt-1.5 block text-sm leading-none text-muted-foreground">Fale comigo no WhatsApp</small>
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
