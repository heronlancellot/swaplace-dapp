import type { NextApiRequest, NextApiResponse } from "next";

interface Data {
  primaryName?: string; // Customize this based on your API's response structure
  message?: string;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const { address } = req.query;

  if (typeof address !== "string") {
    res.status(400).json({ message: "Invalid address parameter" });
    return;
  }

  try {
    const apiResponse = await fetch(`https://ensdata.net/${address}`);
    const data = await apiResponse.json();
    if (apiResponse.ok) {
      res.status(200).json(data);
    } else {
      res.status(apiResponse.status).json({ message: "Failed to fetch data" });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: "Server error", error: error.message });
    } else {
      // If the error is not an instance of Error, you might handle it differently
      res
        .status(500)
        .json({ message: "Server error", error: "An unknown error occurred" });
    }
  }
}
