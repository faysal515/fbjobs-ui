import { GetServerSideProps } from "next";
import { fontClassName } from "../../config/fonts";
import { marked } from "marked";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import type { Job } from "../../types/job";
import SEO from "../../components/SEO";

// Format date to be more readable
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}

// Format salary range
function formatSalary(min: number, max: number, currency: string): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 0,
  });

  if (min === max) {
    return formatter.format(min);
  }
  return `${formatter.format(min)} - ${formatter.format(max)}`;
}

// Capitalize text
function capitalize(text: string): string {
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

// Create a clean description for SEO from job markdown
function createMetaDescription(markdown: string): string {
  // Remove markdown formatting and get plain text
  const plainText = markdown.replace(/[#*`_\[\]()]/g, "");

  // Truncate to ~155 characters for meta description
  return (
    plainText.substring(0, 155).trim() + (plainText.length > 155 ? "..." : "")
  );
}

interface JobDetailsProps {
  initialJob?: Job; // Make it optional since we might fetch on client
}

export const getServerSideProps: GetServerSideProps<JobDetailsProps> = async (
  context
) => {
  // Only fetch on first page load
  if (context.req.headers.referer?.includes("/jobs/")) {
    return { props: {} };
  }

  try {
    const { id } = context.params || {};
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/jobs/${id}`
    );
    const data = await res.json();

    if (!data.success) {
      return { notFound: true };
    }

    return {
      props: {
        initialJob: data.data,
      },
    };
  } catch (error) {
    console.error("Error fetching job details:", error);
    return { notFound: true };
  }
};

export default function JobDetails({ initialJob }: JobDetailsProps) {
  const router = useRouter();
  const { id } = router.query;
  const [job, setJob] = useState<Job | undefined>(initialJob);

  useEffect(() => {
    if (!initialJob && id) {
      const fetchJob = async () => {
        try {
          const res = await fetch(`/api/jobs/${id}`);
          const data = await res.json();
          if (data.success) {
            setJob(data.data);
          } else {
            router.push("/404");
          }
        } catch (error) {
          console.error("Error fetching job details:", error);
          router.push("/404");
        }
      };

      fetchJob();
    }
  }, [id, initialJob, router]);

  // During initial server-side render or if no job data
  if (!job) {
    return null;
  }

  const renderedMarkdown = marked.parse(job.job_markdown);

  // Prepare SEO data
  const jobTitle = capitalize(job.title);
  const companyName = capitalize(job.company);
  const pageTitle = `${jobTitle} at ${companyName} | BD Dev jobs`;
  const metaDescription = createMetaDescription(job.job_markdown);
  const keywords = job.skills ? job.skills.join(", ").toLowerCase() : "";
  const canonicalUrl = `https://fbjobs.com/jobs/${job._id}`;

  return (
    <div className={fontClassName}>
      <SEO
        title={pageTitle}
        description={metaDescription}
        keywords={`${keywords}, ${job.job_type}, ${job.location_type}`}
        ogType="article"
        ogUrl={canonicalUrl}
        canonicalUrl={canonicalUrl}
      />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/"
          className="inline-flex items-center text-base font-semibold text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          ← Back to jobs
        </Link>

        <div className="bg-white rounded-lg shadow-lg border border-black/[.08] overflow-hidden">
          {/* Header section */}
          <div className="p-8 border-b border-black/[.08]">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-3 text-gray-900">
                  {capitalize(job.title)}
                </h1>
                <div className="text-xl text-gray-700">
                  {capitalize(job.company)}
                </div>
              </div>
              <div className="md:text-right">
                <div className="text-sm text-gray-500 mb-2">
                  Posted on {formatDate(job.created_at)}
                </div>
                <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                  {capitalize(job.job_type)}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-1.5 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                {capitalize(job.location_type)}
              </span>
              <span className="px-4 py-1.5 rounded-full text-sm font-semibold bg-purple-100 text-purple-800">
                {formatSalary(
                  job.salary_min,
                  job.salary_max,
                  job.salary_currency
                )}
              </span>
              {job.location !== "not specified" && (
                <span className="px-4 py-1.5 rounded-full text-sm font-semibold bg-gray-100 text-gray-800">
                  📍 {capitalize(job.location)}
                </span>
              )}
            </div>
          </div>

          {/* Job images */}
          {/* {job.images && job.images.length > 0 && (
            <div className="relative h-96 border-b border-black/[.08] dark:border-white/[.145]">
              <Image
                src={job.images[0]}
                alt={`${job.title} image`}
                fill
                className="object-contain"
              />
            </div>
          )} */}

          <div className="p-8 bg-white">
            <div
              className="prose max-w-none text-black prose-headings:text-black prose-p:text-black prose-li:text-black prose-strong:text-black prose-a:text-blue-600"
              dangerouslySetInnerHTML={{ __html: renderedMarkdown }}
            />

            {/* Skills and tags */}
            <div className="mt-10 pt-6 border-t border-black/[.08]">
              {job.skills && job.skills.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-black mb-3">
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100"
                      >
                        {capitalize(skill)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {job.tags && job.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-black mb-3">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {job.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200"
                      >
                        {capitalize(tag)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Source link */}
            {job.post_url && (
              <div className="mt-10 pt-6 border-t border-black/[.08]">
                <a
                  href={job.post_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
                >
                  View Original Post
                  <svg
                    className="ml-2 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </a>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
