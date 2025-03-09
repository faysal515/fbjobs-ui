import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const page = req.query.page || "1";
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/api/jobs?page=${page}`
    );
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return res.status(500).json({ message: "Error fetching jobs" });
  }
}
