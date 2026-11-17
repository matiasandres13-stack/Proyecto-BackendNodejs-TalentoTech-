import {
  AuthServiceError,
  loginUser,
  registerUser,
} from "../services/auth.service.js";

export const register = async (req, res) => {
  const { email, password } = req.body || {};

  if (
    typeof email !== "string" ||
    !email.trim() ||
    typeof password !== "string" ||
    !password ||
    password.length < 6
  ) {
    return res.status(400).json({
      error: "El correo electrónico y la contraseña son obligatorios",
    });
  }

  try {
    const user = await registerUser({ email, password });
    return res.status(201).send({ userId: user.id, email: user.email });
  } catch (error) {
    if (
      error instanceof AuthServiceError &&
      error.code === "EMAIL_ALREADY_REGISTERED"
    ) {
      return res
        .status(400)
        .json({ error: "El correo electrónico ya está registrado" });
    }

    throw error;
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body || {};

  if (typeof email !== "string" || !email.trim()) {
    // Sin un correo válido no se puede buscar la cuenta en Firestore.
    return res
      .status(400)
      .send({ error: "Correo electrónico o contraseña incorrectos 1" });
  }

  try {
    const token = await loginUser({ email, password });
    return res.json({ token });
  } catch (error) {
    if (error instanceof AuthServiceError) {
      if (error.code === "INVALID_CREDENTIALS_MISSING_USER_OR_PASSWORD") {
        return res
          .status(400)
          .json({ error: "Correo electrónico o contraseña incorrectos 2" });
      }

      if (error.code === "INVALID_CREDENTIALS_PASSWORD_MISMATCH") {
        return res
          .status(400)
          .json({ error: "Correo electrónico o contraseña incorrectos 3" });
      }
    }

    throw error;
  }
};
