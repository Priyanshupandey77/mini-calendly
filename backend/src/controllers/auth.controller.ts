import { Request, Response } from "express";
import { login, signup } from "../services/auth.service.js";
import { loginSchema, signupSchema } from "../schemas/auth.schema.js";

export async function signupController(req: Request, res: Response) {
  const result = signupSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      msg: "Invalid input",
      errors: {
        name: "Name must be at least 2 characters",
        email: "Invalid email",
        password: "Password must be at least 8 characters",
      },
    });
  }

  const { name, email, password } = result.data;
  const user = await signup(name, email, password);
  return res.status(201).json(user);
}

export async function loginController(req: Request, res: Response) {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      msg: "Invalid input",
      errors: result.error,
    });
  }
  const { email, password } = result.data;

  const token = await login(email, password);

  return res.status(200).json({
    message: "User logged in successfully",
    token,
  });
}
