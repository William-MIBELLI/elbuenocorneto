"use server";

import { parseWithZod } from "@conform-to/zod";
import { z } from "zod";

export const newProductACTION = async (initialState: unknown, fd: FormData) => {
  console.log("PRODUCT ACTION ");
  const parsedTitle = parseWithZod(fd, {
    schema: z.object({ title: z.string().min(4, "MINIMUM DEPUIS ACTION") }),
  });
  if (parsedTitle.status !== "success") {
    return parsedTitle.reply();
  }
};
