import type { NextApiRequest, NextApiResponse } from "next";

import { createUser } from "@/database/functions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { email, name } = req.body;

    const user = await createUser({ email, name });

    return res.status(200).json({ user });
  }

  res.status(405).json({ message: "Method Not Allowed" });
}
