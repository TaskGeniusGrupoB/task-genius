import type { NextApiRequest, NextApiResponse } from "next";

import { createGroup } from "@/database/functions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { userId, name } = req.body;

    const { group, groupMember } = await createGroup(userId, name);

    return res.status(200).json({ group, groupMember });
  }

  res.status(405).json({ message: "Method Not Allowed" });
}
