import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = "https://enforma-ai.vercel.app";

  // Publicly accessible marketing/info pages
  const publicPages = ["/", "/features", "/pricing", "/about", "/faq", "/contact"].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly",
    priority: route === "/" ? 1.0 : 0.8,
  }));

  // Core application pages (for authenticated users)
  // It's good practice to include these so search engines are aware of your app's full structure.
  const appPages = ["/dashboard", "/workouts", "/nutrition", "/form-coach", "/progress", "/settings"].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...publicPages, ...appPages];
}
