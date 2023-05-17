import type { NextApiRequest, NextApiResponse } from "next";

import { GroupTask, updateGroupTasks } from "@/database/functions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { groupId, tasks }: { groupId: number; tasks: GroupTask[] } =
      req.body;

    await updateGroupTasks({ groupId, tasks });

    return res.status(200).json({ message: "ok" });
  }

  res.status(405).json({ message: "Method Not Allowed" });
}
