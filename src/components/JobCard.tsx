import { marked } from "marked";
import he from "he";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Building2, MapPin, Clock, Banknote } from "lucide-react";
import { capitalize } from "../util";
import type { Job } from "../types/job";

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

export default function JobCard({ job }: { job: Job }) {
  const plainTextDescription =
    job.job_plain_text || stripMarkdown(job.job_markdown);
  const hasSalary = job.salary_min > 0 && job.salary_max > 0;
  const firstTag =
    job.tags && job.tags.length > 0 ? job.tags[0] : job.location_type;

  return (
    <div className="border border-black/[.08] rounded-lg p-6 hover:border-black/20 transition-colors">
      <div className="flex items-start gap-4">
        {/* First Tag Circle */}
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center">
          <span className="text-white font-bold text-sm text-center px-1">
            {capitalize(firstTag)}
          </span>
        </div>

        <div className="flex-grow">
          {/* First Row: Title and Posted Time */}
          <div className="flex justify-between items-center">
            <Link href={`/jobs/${job._id}`} className="group">
              <h2 className="text-lg font-semibold uppercase group-hover:text-blue-600 transition-colors">
                {job.title}
              </h2>
            </Link>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{formatDistanceToNow(new Date(job.created_at))} ago</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2 flex-wrap text-sm">
            <div className="flex items-center gap-1">
              <Building2 className="w-4 h-4 text-gray-500" />
              <span className="font-semibold text-gray-900">
                {capitalize(job.company)}
              </span>
            </div>

            <span className="text-gray-400">|</span>

            <div className="flex items-center gap-1 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{capitalize(job.location)}</span>
            </div>
            {hasSalary && (
              <>
                <span className="text-gray-400">|</span>
                <div className="flex items-center gap-1 text-gray-600">
                  <Banknote className="w-4 h-4" />
                  <span>
                    {formatSalary(
                      job.salary_min,
                      job.salary_max,
                      job.salary_currency
                    )}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Job Description */}
      <div className="mt-4 flex gap-2">
        <p className="text-gray-600 line-clamp-2">{plainTextDescription}</p>
      </div>

      {/* Skills */}
      {job.skills && job.skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {job.skills.map((skill) => (
            <span
              key={skill}
              className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
            >
              {capitalize(skill)}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
