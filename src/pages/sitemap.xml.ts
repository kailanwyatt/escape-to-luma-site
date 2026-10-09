import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { site } from "../config";

const staticRoutes = [
  "/",
  "/arcade",
  "/story",
  "/origin",
  "/news",
  "/support",
  "/advertising",
  "/privacy",
  "/terms",
  "/data",
];

function escapeXml(value: string): string {
  return value.replace(/[<>&'\"]/g, (character) => {
    const entities: Record<string, string> = {
      "<": "&lt;",
      ">": "&gt;",
      "&": "&amp;",
      "'": "&apos;",
      '\"': "&quot;",
    };
    return entities[character];
  });
}

function sitemapEntry(path: string, lastModified?: Date): string {
  const url = new URL(path, site.url).toString();
  const lastmod = lastModified
    ? `\n    <lastmod>${lastModified.toISOString().slice(0, 10)}</lastmod>`
    : "";

  return `  <url>\n    <loc>${escapeXml(url)}</loc>${lastmod}\n  </url>`;
}

export const GET: APIRoute = async () => {
  const posts = await getCollection("news");
  const entries = [
    ...staticRoutes.map((path) => sitemapEntry(path)),
    ...posts.map((post) => sitemapEntry(`/news/${post.id}`, post.data.date)),
  ];

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>\n`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } },
  );
};
