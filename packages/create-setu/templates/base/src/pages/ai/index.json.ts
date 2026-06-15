import { getCollection } from "astro:content";
import { SITE_DESCRIPTION, SITE_NAME } from "../../consts/site";

/**
 * GET Handler for /ai/index.json
 *
 * Generates an index of all available clean `.txt` documentation endpoints.
 */
export async function GET({ url }: { url: URL }) {
  const docs = await getCollection("docs");

  // Sort by sidebar.order (using a default high number if order is missing)
  const sortedDocs = docs.sort((a, b) => {
    const orderA = a.data.sidebar?.order ?? 999;
    const orderB = b.data.sidebar?.order ?? 999;
    return orderA - orderB;
  });

  const baseUrl = url.origin;

  const aiEndpoints = sortedDocs.map((entry) => {
    return {
      title: entry.data.title,
      order: entry.data.sidebar?.order,
      description: entry.data.description,
      contentType: entry.data.contentType,
      audience: entry.data.audience,
      version: entry.data.version,
      status: entry.data.status,
      datasetUrl: `${baseUrl}/ai/${entry.id}.txt`,
    };
  });

  const responseJson = {
    _meta: {
      platform: SITE_NAME,
      schema_version: "1.0",
      description: `${SITE_DESCRIPTION} AI-readable document index.`,
      total_records: aiEndpoints.length,
    },
    data: aiEndpoints,
  };

  return new Response(JSON.stringify(responseJson, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}
