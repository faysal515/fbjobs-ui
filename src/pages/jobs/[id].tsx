import { GetServerSideProps } from "next";
import { fontClassName } from "../../config/fonts";
import Navbar from "../../components/Navbar";
import { marked } from "marked";
import Link from "next/link";
import type { Job } from "../../types/job";

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

interface JobDetailsProps {
  job: Job;
}

export const getServerSideProps: GetServerSideProps<JobDetailsProps> = async (
  context
) => {
  try {
    const { id } = context.params || {};
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/jobs/${id}`
    );
    const data = await res.json();

    if (!data.success) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        job: data.data,
      },
    };
  } catch (error) {
    console.error("Error fetching job details:", error);
    return {
      notFound: true,
    };
  }
};

export default function JobDetails({ job }: JobDetailsProps) {
  const renderedMarkdown = marked.parse(job.job_markdown);

  return (
    <div className={fontClassName}>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button - clean, no dark mode */}
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
