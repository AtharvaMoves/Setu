import { defineCollection, z } from "astro:content";
import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema } from "@astrojs/starlight/schema";

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: z.object({
        contentType: z
          .enum(["concept", "guide", "reference", "tutorial"])
          .optional(),
        audience: z.array(z.string().min(1)).max(10).optional(),
        version: z.string().optional(),
        status: z
          .enum(["draft", "review", "stable", "deprecated"])
          .default("stable"),
      }),
    }),
  }),
};
