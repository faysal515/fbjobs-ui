import { marked } from "marked";
import he from "he";
import Link from "next/link";
import type { Job } from "../types/job";

// Predefined color mapping for tags
const TAG_COLORS = ["blue", "green", "purple"] as const;

// Function to get consistent color for a tag
function getTagColor(tag: string): string {
  const index = tag
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return TAG_COLORS[index % TAG_COLORS.length];
}

// Function to strip markdown and get plain text
function stripMarkdown(markdown: string): string {
  if (!markdown) return "";

  const html = marked.parse(markdown);
  if (typeof html === "string") {
    return he.decode(
      html
        .replace(/<[^>]*>/g, "") // Remove HTML tags
        .replace(/\s+/g, " ") // Normalize whitespace
        .trim()
    );
  }
  return "";
}

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

export default function JobCard({ job }: { job: Job }) {
  const plainTextDescription = stripMarkdown(job.job_markdown);

  return (
    <div className="border border-black/[.08] dark:border-white/[.145] rounded-lg p-6 hover:border-black/20 dark:hover:border-white/30 transition-colors">
      {/* Job Type Banner */}
      <div className="flex justify-end mb-2">
        <span className="text-xs font-medium text-blue-800 bg-blue-50 px-2 py-0.5 rounded">
          {capitalize(job.job_type)}
        </span>
      </div>

      <div className="flex justify-between items-start mb-3">
        <div>
          <Link href={`/jobs/${job._id}`} className="group">
            <h2 className="text-lg font-semibold uppercase group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {job.title}
            </h2>
          </Link>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {capitalize(job.company)} • {capitalize(job.location)}
          </div>
        </div>
        <time className="text-sm text-gray-500 whitespace-nowrap ml-4">
          {formatDate(job.created_at)}
        </time>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          {capitalize(job.location_type)}
        </span>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          {formatSalary(job.salary_min, job.salary_max, job.salary_currency)}
        </span>
        {job.tags && job.tags.length > 0 && (
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getTagColor(
              job.tags[0]
            )}-50 text-${getTagColor(job.tags[0])}-800`}
          >
            {capitalize(job.tags[0])}
          </span>
        )}
      </div>

      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
        {plainTextDescription}
      </p>

      {/* Skills */}
      {job.skills && job.skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {job.skills.map((skill) => {
            const color = getTagColor(skill);
            return (
              <span
                key={skill}
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium bg-${color}-100 text-${color}-800`}
              >
                {capitalize(skill)}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
