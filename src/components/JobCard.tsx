import { marked } from "marked";
import he from "he";

// Predefined color mapping for tags
const TAG_COLORS = ["blue", "green", "purple"] as const;

// Function to get consistent color for a tag
function getTagColor(tag: string): string {
  // Use the tag string to generate a consistent index
  const index = tag
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return TAG_COLORS[index % TAG_COLORS.length];
}

// Function to strip markdown and get plain text
function stripMarkdown(markdown: string): string {
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

export interface Job {
  id: string;
  title: string;
  job_markdown: string;
  date: string;
  tags: string[]; // Now just an array of strings
}

export default function JobCard({ job }: { job: Job }) {
  const plainTextDescription = stripMarkdown(job.job_markdown);

  return (
    <div className="border border-black/[.08] dark:border-white/[.145] rounded-lg p-6 hover:border-black/20 dark:hover:border-white/30 transition-colors">
      <div className="flex justify-between items-start mb-3">
        <h2 className="text-lg font-semibold">{job.title}</h2>
        <time className="text-sm text-gray-500 whitespace-nowrap ml-4">
          {job.date}
        </time>
      </div>
      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
        {plainTextDescription}
      </p>
      <div className="flex flex-wrap gap-2">
        {job.tags.map((tag) => {
          const color = getTagColor(tag);
          return (
            <span
              key={tag}
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium bg-${color}-100 text-${color}-800`}
            >
              {tag}
            </span>
          );
        })}
      </div>
    </div>
  );
}
