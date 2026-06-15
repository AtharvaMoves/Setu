import {
  ABOUT_URL,
  AI_INDEX_URL,
  DOCS_URL,
  MAIN_SITE_URL,
  REPO_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
} from "../../consts/site";

export function Footer() {
  const productLinks = [
    ["Documentation", DOCS_URL],
    ["About Setu", ABOUT_URL],
    ["AI index", AI_INDEX_URL],
  ];

  const ecosystemLinks = [
    ["Main Site", MAIN_SITE_URL],
    ["GitHub Repository", REPO_URL],
  ];

  return (
    <footer className="border-t border-foreground/10 bg-foreground/[0.018] px-6 pb-8 pt-16">
      <div className="container mx-auto max-w-6xl">
        <div className="grid gap-12 pb-14 md:grid-cols-[1.5fr_0.75fr_0.75fr]">
          <div className="max-w-md">
            <a
              href="/"
              className="text-lg font-semibold tracking-tight text-foreground"
            >
              {SITE_NAME}
            </a>
            <p className="mt-4 text-sm leading-7 text-foreground/50">
              {SITE_DESCRIPTION}
            </p>
            <p className="mt-5 text-xs font-medium uppercase tracking-[0.16em] text-foreground/30">
              Built for people and AI systems
            </p>
          </div>

          <FooterGroup title="Setu" links={productLinks} />
          <FooterGroup title="RookDuel" links={ecosystemLinks} external />
        </div>

        <div className="flex flex-col gap-4 border-t border-foreground/10 pt-7 text-xs text-foreground/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Copyright © 2026 Atharva Sen Barai. Released under the MIT License.
          </p>
          <p>RookDuel is the creator's personal brand.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterGroup({
  title,
  links,
  external = false,
}: {
  title: string;
  links: string[][];
  external?: boolean;
}) {
  return (
    <nav aria-label={`${title} links`}>
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-foreground/35">
        {title}
      </p>
      <ul className="space-y-3">
        {links.map(([label, href]) => (
          <li key={label}>
            <a
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className="text-sm text-foreground/55 transition-colors hover:text-foreground"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
