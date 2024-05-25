import userModel from "../dao/models/users.js";
import { createHash } from "../utils.js";
import UserDTO from "../dao/DTOs/current.dto.js";

export const sessionRegister = async (req, res) => {
  res.status(201).send({ status: "success", message: "Usuario registrado" });
};

export const sessionFailRegister = async (req, res) => {
  console.log("error");
  res.send({ error: "Falló" });
};

export const sessionLogin = async (req, res) => {
  if (!req.user) return res.status(400).send("error");
  req.session.user = {
    first_name: req.user.first_name,
    last_name: req.user.last_name,
    email: req.user.email,
    age: req.user.age,
    cart: req.user.cart,
    role: req.user.role,
  };
  res.status(200).send({ status: "success", payload: req.user });
};

export const sessionFailLogin = async (req, res) => {
  console.log("error");
  res.send({ error: "Fallo" });
};

export const sessionLogout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Hubo un error al destruir la sesion");
    }
  });
  res.redirect("/login");
};

export const sessionRestore = async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  console.log(user);
  if (!user)
    return res
      .status(400)
      .send({ status: "error", message: "No se encuentra el user" });
  const newPass = createHash(password);

  await userModel.updateOne({ _id: user._id }, { $set: { password: newPass } });

  res.send({ status: "success", message: "Updated password" });
};

export const sessionGithubcallback = async (req, res) => {
  req.session.user = req.user;
  res.redirect("/products");
};

export const sessionCurrent = async (req, res) => {
  const user = req.session.user;
  const userDTO = new UserDTO(user);
  res.send({ payload: userDTO });
};
