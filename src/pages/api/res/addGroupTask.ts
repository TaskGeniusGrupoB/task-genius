import type { NextApiRequest, NextApiResponse } from "next";

import { addGroupTask } from "@/database/functions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { groupId, title, description, deadline } = req.body;

    const group = await addGroupTask({ groupId, title, description, deadline });

    return res.status(200).json({ group });
  }

  res.status(405).json({ message: "Method Not Allowed" });
}
