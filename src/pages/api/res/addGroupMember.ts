import type { NextApiRequest, NextApiResponse } from "next";

import { addGroupMember } from "@/database/functions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { userId, groupId } = req.body;

    const groupMember = await addGroupMember(userId, groupId);

    return res.status(200).json({ groupMember });
  }

  res.status(405).json({ message: "Method Not Allowed" });
}
