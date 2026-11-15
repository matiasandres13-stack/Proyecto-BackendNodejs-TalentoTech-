import bcrypt from "bcryptjs";
import { create, findByEmail } from "../models/user.model.js";

export const register = async (req, res) => {
  const { email, password } = req.body || {};

  if (
    typeof email !== "string" ||
    !email.trim() ||
    typeof password !== "string" ||
    !password
  ) {
    return res.status(400).json({ message: "Email and password are required" });
  }

const existingUser = await findByEmail(email);
  if (existingUser) {
    return res.status(400).json({ message: "Email already exists" });
  } 
  
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await create({ email, password: hashedPassword });

  res.status(201).send(user);
};

export const login = (req, res) => {
  const { email, password } = req.body || {};
  res.send("Login");
};
