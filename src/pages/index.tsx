import localFont from "next/font/local";
import Navbar from "../components/Navbar";
import JobCard, { Job } from "../components/JobCard";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Static job data (this would normally come from an API)
const jobs: Job[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    job_markdown: `
# Senior Frontend Developer

We're looking for an experienced Frontend Developer to join our team. You'll be working with React, TypeScript, and Next.js to build modern web applications.

## Requirements:
- Strong understanding of web performance
- Experience with React and TypeScript
- Knowledge of accessibility standards

## What we offer:
- Competitive salary
- Remote work options
- Health benefits
    `,
    date: "2024-02-20",
    tags: ["React", "TypeScript", "Remote"],
  },
  {
    id: "2",
    title: "Full Stack Engineer",
    job_markdown: `
# Full Stack Engineer

Join our growing team as a Full Stack Engineer. You'll be responsible for developing and maintaining both frontend and backend systems.

## Key Responsibilities:
- Develop scalable web applications
- Work with cloud infrastructure
- Collaborate with cross-functional teams

## Required Skills:
- Node.js
- React
- AWS experience
    `,
    date: "2024-02-19",
    tags: ["Node.js", "React", "AWS", "Full-time"],
  },
];

export default function Home() {
  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} min-h-screen font-[family-name:var(--font-geist-sans)]`}
    >
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6">Latest Jobs</h1>
        <div className="space-y-4">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </main>
    </div>
  );
}
