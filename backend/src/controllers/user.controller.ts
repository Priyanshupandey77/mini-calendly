import { Request, Response } from "express";
import prisma from "../lib/prisma";

export async function getMeController(req: Request, res: Response) {
  const user = await prisma.user.findUnique({
    where: {
      id: req.userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });
  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  return res.status(200).json(user);
}
