import { ArrowRight } from "lucide-react";
import { ABOUT_URL, AI_INDEX_URL, DOCS_URL } from "../../consts/site";

const steps = [
  [
    "01",
    "Configure",
    "Set your name, repository URL, navigation, and visual identity.",
  ],
  [
    "02",
    "Write",
    "Add Markdown pages using the included guides and reusable page template.",
  ],
  [
    "03",
    "Publish",
    "Build a fast static site with matching AI-readable documentation endpoints.",
  ],
];

export function LandingSections() {
  const actions = [
    ["Open docs", DOCS_URL],
    ["About Setu", ABOUT_URL],
    ["View AI index", AI_INDEX_URL],
  ];

  return (
    <>
      <section id="workflow" className="px-6 py-28">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/40">
                Simple workflow
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Make it yours, then write.
              </h2>
            </div>
            <div className="divide-y divide-foreground/10 border-y border-foreground/10">
              {steps.map(([number, title, description]) => (
                <div
                  key={number}
                  className="grid gap-4 py-7 sm:grid-cols-[3rem_10rem_1fr]"
                >
                  <span className="text-sm text-foreground/30">{number}</span>
                  <h3 className="font-semibold text-foreground">{title}</h3>
                  <p className="leading-relaxed text-foreground/50">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="border-t border-foreground/5 px-6 py-28">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="mb-5 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Start from a working documentation system.
          </h2>
          <p className="mx-auto mb-10 max-w-2xl leading-relaxed text-foreground/50">
            Explore the starter guides, understand the project, or inspect the
            AI-readable index.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {actions.map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="group inline-flex h-11 items-center rounded-md border border-foreground/10 px-5 text-sm font-medium text-foreground hover:bg-foreground/5"
              >
                {label}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
