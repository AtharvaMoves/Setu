import { getCollection } from "astro:content";
import { stripMdxToText } from "../../utils/ai-text-stripper";

/**
 * Generate a static path for every document in the 'docs' collection.
 * This instructs Astro to build a unique `.txt` API endpoint for all pages.
 */
export async function getStaticPaths() {
  const docs = await getCollection("docs");
  return docs.map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }));
}

/**
 * GET Handler for [slug].txt
 * This intercepts the request, grabs the raw Markdown or MDX body, strips out JSX/UI code,
 * and serves the clean result as a `text/plain` file for AI consumption.
 */
export async function GET({ props }: { props: any }) {
  const { entry } = props;

  // 1. Extract raw body from the Astro collection entry
  const rawBody = entry.body;

  // 2. Sanitize and strip the MDX UI elements
  const cleanBody = stripMdxToText(rawBody);

  // 3. Construct a beautiful, AI-friendly plain-text file
  const responseText = `Title: ${entry.data.title}
Description: ${entry.data.description || "No description provided."}
================================================================================

${cleanBody}
`;

  // 4. Return as pure text/plain
  const headers = new Headers();
  headers.set("Content-Type", "text/plain; charset=utf-8");
  headers.set("Cache-Control", "public, max-age=3600");

  return new Response(responseText, {
    status: 200,
    headers,
  });
}
