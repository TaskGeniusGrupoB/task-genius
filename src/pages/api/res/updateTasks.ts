import type { NextApiRequest, NextApiResponse } from "next";

import { Task, updateTasks } from "@/database/functions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { userId, tasks }: { userId: number; tasks: Task[] } = req.body;

    await updateTasks({ userId, tasks });

    return res.status(200).json({ message: "ok" });
  }

  res.status(405).json({ message: "Method Not Allowed" });
}
