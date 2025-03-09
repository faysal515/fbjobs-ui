import Head from "next/head";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogType?: "website" | "article";
  ogUrl?: string;
  twitterCard?: "summary" | "summary_large_image";
  canonicalUrl?: string;
}

export default function SEO({
  title = "BD Dev jobs | Find Your Next Career Opportunity",
  description = "Discover the latest job opportunities in tech, marketing, design and more. Updated daily with new positions from top companies.",
  keywords = "jobs, career, hiring, tech jobs, remote work, job board, employment opportunities",
  ogType = "website",
  ogUrl = "https://fbjobs.com",
  twitterCard = "summary_large_image",
  canonicalUrl = "https://fbjobs.com",
}: SEOProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={ogUrl} />

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
    </Head>
  );
}
