import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError.js";

export async function signup(name: string, email: string, password: string) {
  const normalizedEmail = email.toLowerCase();
  // 1. Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 2. Create user
  let user;

  try {
    user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      throw new AppError("Email is already registered", 409);
    }

    throw error;
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("jwt not found");
  }

  const token = jwt.sign({ userId: user.id }, secret);

  return {
    user,
    token,
  };
}

export async function login(email: string, password: string) {
  const normalizedEmail = email.toLowerCase();
  const user = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
  });
  if (!user) {
    throw new Error("User not found");
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Incorrect email or password");
  }
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("jwt not found");
  }
  const token = jwt.sign({ userId: user.id }, secret);
  return token;
}
