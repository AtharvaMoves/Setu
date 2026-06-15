import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { DOCS_URL, REPO_URL, SITE_NAME } from "../../consts/site";
import { GitHubMark } from "../shared/GitHubMark";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[88vh] items-center overflow-hidden px-6 pb-24 pt-32">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_-30%,rgba(120,119,198,0.15),transparent)]" />

      <div className="container relative z-10 mx-auto max-w-5xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-xs font-semibold uppercase tracking-[0.24em] text-foreground/50"
        >
          Open-source documentation foundation
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mb-8 text-5xl font-semibold tracking-tighter text-foreground sm:text-6xl lg:text-7xl"
        >
          Documentation for humans.
          <br />
          <span className="text-foreground/40">Structured for AI.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-foreground/55"
        >
          {SITE_NAME} is a clean Astro and Starlight foundation with polished
          documentation pages, built-in search, AI-readable endpoints, and
          built-in interactive tools.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24 }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <a
            href={DOCS_URL}
            className="group flex h-12 w-full items-center justify-center rounded-md bg-foreground px-6 text-sm font-medium text-background sm:w-auto"
          >
            Read the documentation
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 w-full items-center justify-center rounded-md border border-foreground/10 px-6 text-sm font-medium text-foreground hover:bg-foreground/5 sm:w-auto"
          >
            <GitHubMark className="mr-2 h-4 w-4" />
            View source
          </a>
        </motion.div>
      </div>
    </section>
  );
}
