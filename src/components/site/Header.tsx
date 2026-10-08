import { useEffect, useState } from "react";
import { Menu, Moon, Phone, ShoppingBag, Sun, X } from "lucide-react";
import { business } from "@/data/business";
import { useCart } from "@/hooks/useCart";
import { cn } from "@/lib/utils";
import "../../theme.css";

const links = [
  { href: "#cardapio", label: "Cardápio" },
  { href: "#sobre", label: "Sobre" },
  { href: "#contato", label: "Contato" },
  { href: "/painel", label: "Painel da Loja" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { count, setOpen } = useCart();

  useEffect(() => {
    let ticking = false;
    const update = () => {
      setScrolled(window.scrollY > 24);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    try {
      const savedTheme = window.localStorage.getItem("juca-theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const shouldUseDark = savedTheme ? savedTheme === "dark" : prefersDark;

      setDarkMode(shouldUseDark);
      document.documentElement.classList.toggle("dark", shouldUseDark);
    } catch {
      setDarkMode(false);
    }
  }, []);

  const toggleTheme = () => {
    setDarkMode((current) => {
      const next = !current;
      document.documentElement.classList.toggle("dark", next);
      try {
        window.localStorage.setItem("juca-theme", next ? "dark" : "light");
      } catch {
        // O tema continua funcionando mesmo se o navegador bloquear o localStorage.
      }
      return next;
    });
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-[#dccdb2] bg-[#faf5ec]/95 shadow-soft backdrop-blur-xl dark:bg-[#1a1412]/95 dark:border-[#382b24]"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-6 md:py-4">
        <a href="#topo" className="flex min-w-0 items-center gap-3">
          <span className="flex h-12 w-24 shrink-0 items-center justify-center md:h-14 md:w-28">
            <img
              src="/logo.webp"
              alt={business.name}
              decoding="async"
              className="h-full w-full object-contain"
            />
          </span>
          <span className="min-w-0">
            <span
              className={cn(
                "block truncate font-display text-base font-bold leading-tight md:text-lg",
                scrolled ? "text-[#2f4a32] dark:text-[#faf5ec]" : "text-[#2f4a32]",
              )}
            >
              {business.name}
            </span>
            <span
              className={cn(
                "hidden text-xs sm:block",
                scrolled ? "text-[#6f6457] dark:text-[#c4b5a2]" : "text-[#4e3220]/80",
              )}
            >
              {business.tagline}
            </span>
          </span>
        </a>

        <div className="flex items-center gap-1 sm:gap-2">
          <nav className="mr-2 hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-sm font-semibold transition",
                  scrolled
                    ? "text-[#2f4a32] hover:bg-[#2f4a32]/10 dark:text-[#faf5ec] dark:hover:bg-white/10"
                    : "text-[#2f4a32] hover:bg-[#2f4a32]/10",
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={darkMode ? "Ativar modo claro" : "Ativar modo escuro"}
            aria-pressed={darkMode}
            title={darkMode ? "Mudar para modo claro" : "Mudar para modo escuro"}
            className={cn(
              "relative h-7 w-[52px] shrink-0 rounded-full border p-[2px] shadow-sm transition-all duration-300",
              darkMode
                ? "border-slate-500/70 bg-slate-700"
                : "border-sky-200 bg-sky-100",
            )}
          >
            <Sun
              aria-hidden="true"
              className={cn(
                "absolute left-[7px] top-1/2 h-3.5 w-3.5 -translate-y-1/2 transition-opacity duration-200",
                darkMode ? "opacity-25" : "text-amber-700 opacity-100",
              )}
            />
            <Moon
              aria-hidden="true"
              className={cn(
                "absolute right-[7px] top-1/2 h-3.5 w-3.5 -translate-y-1/2 transition-opacity duration-200",
                darkMode ? "text-sky-200 opacity-100" : "opacity-30",
              )}
            />
            <span
              className={cn(
                "absolute top-[2px] grid h-[22px] w-[22px] place-items-center rounded-full shadow-sm transition-transform duration-300 ease-out",
                darkMode
                  ? "translate-x-[24px] bg-slate-100"
                  : "translate-x-0 bg-yellow-300",
              )}
            >
              {darkMode ? (
                <Moon className="h-3.5 w-3.5 text-slate-700" aria-hidden="true" />
              ) : (
                <Sun className="h-3.5 w-3.5 text-amber-700" aria-hidden="true" />
              )}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Abrir carrinho"
            className="relative grid h-10 w-10 place-items-center rounded-full bg-[#2f4a32] text-[#faf5ec] shadow-sm hover:bg-[#243a26] transition active:scale-95"
          >
            <ShoppingBag className="h-[18px] w-[18px]" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#eab308] text-[#2f4a32] px-1 text-[11px] font-bold shadow">
                {count}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            className="grid h-10 w-10 place-items-center rounded-full bg-[#2f4a32]/10 text-[#2f4a32] hover:bg-[#2f4a32]/20 dark:bg-white/10 dark:text-[#faf5ec] transition md:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="animate-rise mx-4 mb-3 rounded-3xl border border-[#dccdb2] bg-[#faf5ec] p-3 shadow-lift md:hidden dark:bg-[#1a1412] dark:border-[#382b24]">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block rounded-2xl px-4 py-3 text-sm font-bold text-[#2f4a32] hover:bg-[#e8d9be]/60 dark:text-[#faf5ec] dark:hover:bg-white/10 transition"
            >
              {link.label}
            </a>
          ))}
          <a
            href={business.phoneHref}
            className="flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-[#b23a26] hover:bg-[#b23a26]/10 transition"
          >
            <Phone className="h-4 w-4" />
            {business.phone}
          </a>
        </div>
      )}
    </header>
  );
}
