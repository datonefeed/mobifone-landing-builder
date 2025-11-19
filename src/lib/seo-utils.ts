import { Metadata } from "next";
import { SEOConfig } from "@/types/landing";

/**
 * Convert SEOConfig to Next.js Metadata
 */
export function seoConfigToMetadata(seo: SEOConfig): Metadata {
  const metadata: Metadata = {
    title: seo.metaTitle,
    description: seo.metaDescription,
    keywords: seo.keywords,
  };

  // Application metadata
  if (seo.applicationName) {
    metadata.applicationName = seo.applicationName;
  }

  if (seo.authors && seo.authors.length > 0) {
    metadata.authors = seo.authors;
  }

  if (seo.generator) {
    metadata.generator = seo.generator;
  }

  if (seo.referrer && seo.referrer !== "unsafe-url") {
    metadata.referrer = seo.referrer as Exclude<NonNullable<Metadata["referrer"]>, "unsafe-url">;
  }

  // Theme and appearance
  if (seo.themeColor) {
    metadata.themeColor = seo.themeColor;
  }

  if (seo.colorScheme) {
    metadata.colorScheme = seo.colorScheme;
  }

  if (seo.viewport) {
    metadata.viewport = seo.viewport;
  }

  // Open Graph
  if (seo.openGraph) {
    const openGraph: NonNullable<Metadata["openGraph"]> = {
      title: seo.openGraph.title || seo.metaTitle,
      description: seo.openGraph.description || seo.metaDescription,
      url: seo.openGraph.url,
      siteName: seo.openGraph.siteName,
      locale: seo.openGraph.locale,
      type: seo.openGraph.type || "website",
    };

    // Images
    if (seo.openGraph.images && seo.openGraph.images.length > 0) {
      openGraph.images = seo.openGraph.images;
    } else if (seo.ogImage) {
      // Legacy support
      openGraph.images = [{ url: seo.ogImage }];
    }

    // Article specific
    if (seo.openGraph.type === "article") {
      (openGraph as any).publishedTime = seo.openGraph.publishedTime;
      (openGraph as any).modifiedTime = seo.openGraph.modifiedTime;
      (openGraph as any).expirationTime = seo.openGraph.expirationTime;
      (openGraph as any).authors = seo.openGraph.authors;
      (openGraph as any).section = seo.openGraph.section;
      (openGraph as any).tags = seo.openGraph.tags;
    }

    // Videos
    if (seo.openGraph.videos && seo.openGraph.videos.length > 0) {
      (openGraph as any).videos = seo.openGraph.videos;
    }

    // Audio
    if (seo.openGraph.audio && seo.openGraph.audio.length > 0) {
      (openGraph as any).audio = seo.openGraph.audio;
    }

    metadata.openGraph = openGraph;
  }

  // Twitter
  if (seo.twitter) {
    const twitter: NonNullable<Metadata["twitter"]> = {
      card: seo.twitter.card || "summary_large_image",
      site: seo.twitter.site,
      siteId: seo.twitter.siteId,
      creator: seo.twitter.creator,
      creatorId: seo.twitter.creatorId,
      title: seo.twitter.title || seo.metaTitle,
      description: seo.twitter.description || seo.metaDescription,
    };

    if (seo.twitter.images && seo.twitter.images.length > 0) {
      twitter.images = seo.twitter.images;
    } else if (seo.openGraph?.images && seo.openGraph.images.length > 0) {
      // Fallback to Open Graph images
      twitter.images = seo.openGraph.images.map((img) => ({
        url: img.url,
        alt: img.alt,
      }));
    } else if (seo.ogImage) {
      // Legacy support
      twitter.images = [{ url: seo.ogImage }];
    }

    metadata.twitter = twitter;
  }

  // Robots
  if (seo.robots) {
    const robots: NonNullable<Metadata["robots"]> = {
      index: seo.robots.index,
      follow: seo.robots.follow,
      noarchive: seo.robots.noarchive,
      nosnippet: seo.robots.nosnippet,
      noimageindex: seo.robots.noimageindex,
      nocache: seo.robots.nocache,
      notranslate: seo.robots.notranslate,
      "max-image-preview": seo.robots.maxImagePreview,
      "max-snippet": seo.robots.maxSnippet,
      "max-video-preview": seo.robots.maxVideoPreview,
    };

    metadata.robots = robots;
  }

  // Alternates
  if (seo.alternates) {
    metadata.alternates = {};

    if (seo.alternates.canonical || seo.canonical) {
      metadata.alternates.canonical = seo.alternates.canonical || seo.canonical;
    }

    if (seo.alternates.languages) {
      metadata.alternates.languages = seo.alternates.languages;
    }

    if (seo.alternates.media) {
      metadata.alternates.media = seo.alternates.media;
    }

    if (seo.alternates.types) {
      metadata.alternates.types = seo.alternates.types;
    }
  } else if (seo.canonical) {
    // Legacy support
    metadata.alternates = { canonical: seo.canonical };
  }

  // Verification
  if (seo.verification) {
    metadata.verification = {
      google: seo.verification.google,
      yandex: seo.verification.yandex,
      yahoo: seo.verification.yahoo,
      other: seo.verification.other,
    };

    // Bing verification uses a different format in Next.js
    if (seo.verification.bing) {
      metadata.verification.other = {
        ...metadata.verification.other,
        "msvalidate.01": seo.verification.bing,
      };
    }
  }

  // Icons
  if (seo.icons) {
    metadata.icons = seo.icons;
  }

  // Manifest
  if (seo.manifest) {
    metadata.manifest = seo.manifest;
  }

  // Apple Web App
  if (seo.appleWebApp) {
    metadata.appleWebApp = seo.appleWebApp;
  }

  // Format Detection
  if (seo.formatDetection) {
    metadata.formatDetection = seo.formatDetection;
  }

  // iTunes
  if (seo.itunes?.appId) {
    metadata.itunes = {
      appId: seo.itunes.appId,
      appArgument: seo.itunes.appArgument,
    };
  }

  // Abstract and classification
  if (seo.abstract) {
    metadata.abstract = seo.abstract;
  }

  if (seo.archives) {
    metadata.archives = seo.archives;
  }

  if (seo.category) {
    metadata.category = seo.category;
  }

  if (seo.classification) {
    metadata.classification = seo.classification;
  }

  return metadata;
}

/**
 * Merge base metadata with page-specific SEO config
 */
export function mergeMetadata(base: Metadata, seo?: SEOConfig): Metadata {
  if (!seo) {
    return base;
  }

  const seoMetadata = seoConfigToMetadata(seo);

  return {
    ...base,
    ...seoMetadata,
    // Ensure proper merging of nested objects
    openGraph: {
      ...base.openGraph,
      ...seoMetadata.openGraph,
    },
    twitter: {
      ...base.twitter,
      ...seoMetadata.twitter,
    },
    alternates: {
      ...base.alternates,
      ...seoMetadata.alternates,
    },
    verification: {
      ...base.verification,
      ...seoMetadata.verification,
    },
  };
}

/**
 * Generate default SEO config
 */
export function getDefaultSEOConfig(
  title: string,
  description: string,
  keywords: string[] = []
): SEOConfig {
  return {
    metaTitle: title,
    metaDescription: description,
    keywords,
    robots: {
      index: true,
      follow: true,
      maxImagePreview: "large",
    },
    openGraph: {
      type: "website",
      locale: "vi_VN",
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}
