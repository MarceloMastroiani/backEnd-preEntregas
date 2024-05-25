import express from "express";
import {
  getProduct,
  getAllProduct,
  getByIdd,
  getByBrands,
  addProd,
  updateProd,
  deleteProdu,
} from "../controllers/products.controller.js";
//import checkRole from "../middlewares/checkRole.middlewares.js";

const productsRouter = express.Router();

//MUESTRA LOS PRODUCTOS AGREGANDO QUERY
productsRouter.get("/", getProduct);

//MUESTRA LOS PRODUCTOS //
productsRouter.get("/all", getAllProduct);

//BUSCAR POR ID
productsRouter.get("/:id", getByIdd);

//ENCUENTRA EL PRODUCTO POR EL BRAND
productsRouter.get("/:bran", getByBrands);

//AGREGA UN PRODUCTO
productsRouter.post("/add", addProd); //checkRole("admin")

//EDITAR UN PRODUCTO
productsRouter.put("/edit/:id", updateProd); //checkRole("admin"),

//ELIMINAR UN PRODUCTO
productsRouter.delete("/delete/:id", deleteProdu); //checkRole("admin"),

export default productsRouter;
