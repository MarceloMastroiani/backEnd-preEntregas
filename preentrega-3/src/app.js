import productsRouter from "./routes/productsRouter.js";
import cartsRouter from "./routes/cartsRouter.js";
import viewsRouter from "./routes/viewsRouter.js";
import { productService } from "./repositories/index.js";
import messagesModel from "./dao/models/messages.js";
import sessionRouter from "./routes/sessionsRouter.js";
import passport from "passport";
import initilizePassport from "./config/passport.config.js";
import dbConnection from "./config/db.config.js";
import { entorno } from "./config/entorno.config.js";

import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import __dirname from "./utils.js";

const app = express();

const PORT = entorno.port;
const MONGO_URL = entorno.mongoUrl;

//MIDDLEWARES
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.engine("handlebars", handlebars.engine());

//RUTAS
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use(
  session({
    store: new MongoStore({
      mongoUrl: MONGO_URL,
      ttl: 3600,
    }),
    secret: "Secret",
    resave: false,
    saveUninitialized: false,
  })
);

//USANDO PASSPORT
initilizePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use("/", viewsRouter);
app.use("/api/sessions", sessionRouter);

//LISTEN
const server = app.listen(PORT, () =>
  console.log("Servidor corriendo en el puerto ", PORT)
);
dbConnection();

//INSTANCIANDO SOCKET.IO
const io = new Server(server);

io.on("connection", async (socket) => {
  console.log("Connected!");

  //ELIMINA EL PRODUCTO
  socket.on("delete product", async ({ id }) => {
    await productService.deleteProduct(id);
    const products = await productService.getAll();
    io.emit("list updated", { products: products });
  });

  //CHAT
  const messages = await messagesModel.find().lean();
  socket.emit("chat messages", { messages });

  socket.on("new message", async (messageData) => {
    await messagesModel.create(messageData);
    const messages = await messagesModel.find().lean();
    io.emit("chat messages", { messages });
  });

  socket.on("disconnect", () => {
    console.log("Socket desconectado");
  });
});
