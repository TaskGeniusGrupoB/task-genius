import type { NextApiRequest, NextApiResponse } from "next";

import { deleteGroupTaskById } from "@/database/functions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { taskId } = req.body;

    const deletedTask = await deleteGroupTaskById(taskId);

    return res.status(200).json({ deletedTask });
  }

  res.status(405).json({ message: "Method Not Allowed" });
}
