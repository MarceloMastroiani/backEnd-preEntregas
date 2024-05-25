import express from "express";
import { privateAccess } from "../middlewares/privateAuth.js";
import { publicAccess } from "../middlewares/publicAuth.js";
import {
  viewGetAll,
  viewGetAllRealTime,
  viewChat,
  viewProducts,
  viewCarts,
  viewRestore,
  viewRegister,
  viewLogin,
} from "../controllers/views.controller.js";
//import checkRole from "../middlewares/checkRole.middlewares.js";

const viewsRouter = express.Router();

//MUESTRA LOS PRODUCTOS EN home.handlebars
viewsRouter.get("/", privateAccess, viewGetAll);

//CREA Y MUESTRA LOS PRODUCTOS EN realTimeProducts
viewsRouter.get("/realTimeProducts", privateAccess, viewGetAllRealTime);

//REMDERIZA EL CHAT
viewsRouter.get("/chat", privateAccess, viewChat); //checkRole("usuario"),

//RENDERIZA UNA VISTA PRODUCTS
viewsRouter.get("/products", privateAccess, viewProducts);

//RENDERIZA LA VISTA DEL CARRITO
viewsRouter.get("/carts/:cid", privateAccess, viewCarts); //FUNCIONA

//RESTAURAR PASSWORD
viewsRouter.get("/restore", privateAccess, viewRestore);

//VISTA DE REGISTRAR
viewsRouter.get("/register", publicAccess, viewRegister);

//VISTA DEL LOGIN
viewsRouter.get("/login", publicAccess, viewLogin);

export default viewsRouter;
