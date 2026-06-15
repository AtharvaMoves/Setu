import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Monitor, Menu, X, Code2 } from "lucide-react";
import { cn } from "../ui/utils";
import { GitHubStars } from "../shared/GitHubStars";
import {
  ABOUT_URL,
  AI_INDEX_URL,
  DOCS_URL,
  REPO_URL,
  SITE_NAME,
} from "../../consts/site";

type Theme = "light" | "dark" | "auto";

export function Header() {
  const [theme, setTheme] = useState<Theme>("auto");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = (t: Theme) => {
      let activeTheme = t;
      if (t === "auto") {
        activeTheme = mediaQuery.matches ? "dark" : "light";
      }

      root.setAttribute("data-theme", activeTheme);

      if (activeTheme === "dark") {
        root.classList.add("dark");
        root.classList.remove("light");
      } else {
        root.classList.add("light");
        root.classList.remove("dark");
      }

      localStorage.setItem("starlight-theme", t);
    };

    applyTheme(theme);

    const listener = () => {
      if (theme === "auto") applyTheme("auto");
    };

    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, [theme]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("starlight-theme") as Theme | null;
    if (savedTheme && ["light", "dark", "auto"].includes(savedTheme)) {
      setTheme(savedTheme);
    }
  }, []);

  const cycleTheme = () => {
    if (theme === "auto") setTheme("light");
    else if (theme === "light") setTheme("dark");
    else setTheme("auto");
  };

  const navLinks = [
    { name: "Docs", href: DOCS_URL },
    { name: "About", href: ABOUT_URL },
    { name: "AI output", href: AI_INDEX_URL },
    { name: "Workflow", href: "/#workflow" },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled
            ? "bg-background/80 backdrop-blur-md border-b border-foreground/5 py-4"
            : "bg-transparent py-6",
        )}
      >
        <div className="container mx-auto flex max-w-[92rem] items-center justify-between px-6 lg:px-12 xl:px-16">
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="text-xl font-semibold tracking-tight flex items-center gap-2 group"
            >
              <Code2 className="w-5 h-5 text-foreground transition-transform group-hover:rotate-12" />
              <span className="text-foreground">{SITE_NAME}</span>
            </a>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-normal text-foreground/60 hover:text-foreground transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={cycleTheme}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-foreground/5 transition-colors text-foreground/60 hover:text-foreground relative overflow-hidden"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={theme}
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -15, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="absolute"
                >
                  {theme === "light" && <Sun className="w-4 h-4" />}
                  {theme === "dark" && <Moon className="w-4 h-4" />}
                  {theme === "auto" && <Monitor className="w-4 h-4" />}
                </motion.div>
              </AnimatePresence>
            </button>

            <GitHubStars
              className="hidden xl:inline-flex"
              label="Stars"
              compact
            />

            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center justify-center h-9 px-4 rounded-full border border-white/10 bg-white/[0.03] text-foreground/78 text-xs font-semibold hover:border-white/16 hover:bg-white/[0.06] hover:text-foreground transition-colors"
            >
              GitHub
            </a>

            <a
              href={DOCS_URL}
              className="hidden sm:inline-flex items-center justify-center h-9 px-4 rounded-full bg-foreground text-background text-xs font-semibold hover:bg-foreground/90 transition-colors"
            >
              Open Docs
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-8 h-8 flex items-center justify-center rounded-full hover:bg-foreground/5 transition-colors text-foreground"
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl pt-24 px-6 md:hidden flex justify-center border-b border-foreground/5 pb-8"
          >
            <nav className="flex flex-col gap-6 text-center w-full max-w-sm">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-lg font-medium text-foreground/80 hover:text-foreground transition-colors py-2 border-b border-foreground/5"
                >
                  {link.name}
                </a>
              ))}
              <GitHubStars label="Stars" />
              <a
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-12 px-8 rounded-full border border-foreground/10 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
              >
                View on GitHub
              </a>
              <a
                href={DOCS_URL}
                className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-foreground text-background text-sm font-medium"
              >
                Open Docs
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
