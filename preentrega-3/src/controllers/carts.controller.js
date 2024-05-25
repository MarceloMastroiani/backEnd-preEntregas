import { cartService, productService } from "../repositories/index.js";

export const cartByIdd = async (req, res) => {
  let id = req.params.cid;

  let result = await cartService.getCartById(id);
  res.json({ result });
};

export const creatCart = async (req, res) => {
  let result = await cartService.createCart();

  res.json({ result });
};

export const cartAddProduct = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    const cart = await cartService.getCartById(cartId);
    const product = await productService.getById(productId);

    if (product) {
      await cartService.addProduct(cartId, productId);
      res.send({ status: "success" });
    } else {
      res
        .status(404)
        .send({ error: `Producto con la ID ${productId} no encontrado` });
    }
  } catch (error) {
    console.error("Error al agregar el producto al carrito:", error);
    res.status(500).send("Error Interno del Server");
  }
};

export const cartDeleteProduct = async (req, res) => {
  let { cid, pid } = req.params;
  // let cid = req.params.cid;
  // let pid = req.params.pid;

  let result = await cartService.deleteProduct(cid, pid);

  res.send({ cart: result });
};

export const cartDeleteAll = async (req, res) => {
  let cid = req.params.cid;

  let result = await cartService.deleteAll(cid);
  res.send({ result });
};

export const updatQuantity = async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const newProductQuantity = req.body.quantity;

  if (newProductQuantity) {
    const updatedQuantity = await cartService.updateQuantity(
      cid,
      pid,
      newProductQuantity
    );
    res.send({ updatedQuantity });
  } else {
    res.send("Hubo un error al actualizar la cantidad del producto");
  }
};

export const updatCart = async (req, res) => {
  const cid = req.params.cid;
  const productList = req.body;

  if (productList) {
    const updatedProducts = await cartService.updateCart(cid, productList);
    res.send(updatedProducts);
  } else {
    res.send("Carrito no encontrado");
  }
};
