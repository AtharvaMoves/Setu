import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { cn } from "../ui/utils";
import { REPO_API_URL, REPO_URL } from "../../consts/site";
import { GitHubMark } from "./GitHubMark";

type GitHubStarsProps = {
  className?: string;
  label?: string;
  compact?: boolean;
};

function formatStars(value: number) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`;
  }

  return String(value);
}

export function GitHubStars({
  className,
  label = "GitHub",
  compact = false,
}: GitHubStarsProps) {
  const [stars, setStars] = useState("...");

  useEffect(() => {
    let active = true;

    async function loadStars() {
      try {
        const response = await fetch(REPO_API_URL, {
          headers: {
            Accept: "application/vnd.github+json",
          },
        });

        if (!response.ok) return;

        const data = await response.json();
        if (active && typeof data?.stargazers_count === "number") {
          setStars(formatStars(data.stargazers_count));
        }
      } catch {
        // Ignore network failures and keep fallback text.
      }
    }

    loadStars();

    return () => {
      active = false;
    };
  }, []);

  return (
    <a
      href={REPO_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] text-foreground/84 backdrop-blur-xl transition-all hover:border-white/16 hover:bg-white/[0.07] hover:text-foreground",
        compact
          ? "h-9 px-3.5 text-xs font-semibold"
          : "h-10 px-4 text-sm font-medium",
        className,
      )}
      aria-label={`${label} on GitHub`}
    >
      <GitHubMark className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
      <span>{label}</span>
      <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.06] px-2 py-0.5 text-[0.72rem] font-semibold text-foreground/78">
        <Star className="h-3 w-3" />
        {stars}
      </span>
    </a>
  );
}
