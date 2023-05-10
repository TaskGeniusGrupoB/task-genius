import type { NextApiRequest, NextApiResponse } from "next";

import { addTask } from "@/database/functions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { id, title, description, date } = req.body;

    const user = await addTask({ id, title, description, deadline: date });

    return res.status(200).json({ user });
  }

  res.status(405).json({ message: "Method Not Allowed" });
}
