import { Bot, FileText, Search, SlidersHorizontal } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Markdown-first",
    description:
      "Write documentation in familiar Markdown or MDX with typed frontmatter.",
  },
  {
    icon: Search,
    title: "Search and navigation",
    description:
      "Ship organized sidebars, responsive navigation, and full-text search.",
  },
  {
    icon: Bot,
    title: "AI-readable output",
    description:
      "Expose every page as clean plain text and publish a discoverable JSON index.",
  },
  {
    icon: SlidersHorizontal,
    title: "Easy to customize",
    description:
      "Replace the brand, navigation, styles, and starter pages without rebuilding the foundation.",
  },
];

export function FeatureGrid() {
  return (
    <section className="border-y border-foreground/5 px-6 py-24">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/40">
            Included foundation
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            The useful parts are already connected.
          </h2>
        </div>
        <div className="grid gap-px overflow-hidden rounded-xl border border-foreground/10 bg-foreground/10 md:grid-cols-2">
          {features.map(({ icon: Icon, title, description }) => (
            <article key={title} className="bg-background p-8">
              <Icon className="mb-8 h-5 w-5 text-foreground/55" />
              <h3 className="mb-3 text-lg font-semibold text-foreground">
                {title}
              </h3>
              <p className="leading-relaxed text-foreground/50">
                {description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
