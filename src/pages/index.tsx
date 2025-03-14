import { fontClassName } from "../config/fonts";
import { useEffect, useRef, useState } from "react";
import JobCard from "../components/JobCard";
import { GetServerSideProps } from "next";
import type { Job, JobsResponse, Pagination } from "../types/job";
import SEO from "../components/SEO";
import { formatDistanceToNow } from "date-fns";

interface HomeProps {
  initialData: JobsResponse;
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/jobs?page=1`
    );
    const initialData = await res.json();

    return {
      props: { initialData },
    };
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return {
      props: {
        initialData: {
          success: false,
          message: "Error fetching jobs",
          data: {
            jobs: [],
            pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
          },
        },
      },
    };
  }
};

export default function Home({ initialData }: HomeProps) {
  const [jobs, setJobs] = useState<Job[]>(initialData.data.jobs);
  const [pagination, setPagination] = useState<Pagination>(
    initialData.data.pagination
  );
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  const loadMoreJobs = async () => {
    if (isLoading || pagination.page >= pagination.totalPages) return;

    setIsLoading(true);
    try {
      const nextPage = pagination.page + 1;
      const res = await fetch(`/api/jobs?page=${nextPage}`);
      const data: JobsResponse = await res.json();

      setJobs((prevJobs) => [...prevJobs, ...data.data.jobs]);
      setPagination(data.data.pagination);
      setHasError(false);
    } catch (error) {
      console.error("Error loading more jobs:", error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreJobs();
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [pagination.page, isLoading]);

  return (
    <div className={fontClassName}>
      <SEO />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-2">All Jobs</h1>
        {jobs.length > 0 && (
          <p className="text-gray-600 text-sm mb-6">
            Total{" "}
            <span className="font-bold text-black dark:text-white bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
              {pagination.total}
            </span>{" "}
            jobs found. Most recent job published{" "}
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              {formatDistanceToNow(new Date(jobs[0].created_at))}
            </span>{" "}
            ago.
          </p>
        )}
        <div className="space-y-4">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="py-4 text-center text-gray-600">
              Loading more jobs...
            </div>
          )}

          {/* Error message */}
          {hasError && (
            <div className="py-4 text-center text-red-600">
              Error loading jobs. Please try again.
            </div>
          )}

          {/* Intersection observer target */}
          {pagination.page < pagination.totalPages && (
            <div ref={observerTarget} className="h-10" />
          )}

          {/* End of list message */}
          {pagination.page >= pagination.totalPages && jobs.length > 0 && (
            <div className="py-4 text-center text-gray-600">
              {`That's all for now.`}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
