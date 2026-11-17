import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { create, findByEmail } from "../models/user.model.js";

export class AuthServiceError extends Error {
  constructor(code) {
    super(code);
    this.code = code;
  }
}

export const registerUser = async ({ email, password }) => {
  const existingUser = await findByEmail(email);

  if (existingUser) {
    throw new AuthServiceError("EMAIL_ALREADY_REGISTERED");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  return create({ email, password: hashedPassword });
};

export const loginUser = async ({ email, password }) => {
  const user = await findByEmail(email);

  if (!user || typeof password !== "string" || !password) {
    throw new AuthServiceError("INVALID_CREDENTIALS_MISSING_USER_OR_PASSWORD");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AuthServiceError("INVALID_CREDENTIALS_PASSWORD_MISMATCH");
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );

  return token;
};
