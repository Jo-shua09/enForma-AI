import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = "https://enforma-ai.vercel.app";

  // Add more static or dynamic routes here
  const staticRoutes = ["/", "/features", "/pricing", "/about", "/faq", "/contact"].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date().toISOString(),
  }));

  return [...staticRoutes];
}
