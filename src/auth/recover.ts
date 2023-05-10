import axios from "axios";

import type { User } from "@/database/functions";

export const recover = async ({
  email,
}: Pick<User, "email">): Promise<User | null> => {
  const {
    data: { user },
  } = await axios.post("/api/res/getUserByEmail", {
    email,
  });

  return user;
};
