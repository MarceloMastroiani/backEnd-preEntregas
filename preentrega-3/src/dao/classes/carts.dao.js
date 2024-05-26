import cartModel from "../models/carts.js";
import Product from "./products.dao.js";
import Ticket from "./ticket.dao.js";

const productService = new Product();
const ticketService = new Ticket();

export default class Cart {
  constructor() {
    console.log("Trabajando con cart.dao");
  }

  getCartById = async (id) => {
    let result = await cartModel.findById(id).lean();
    return result;
  };
  getCartLean = async (id) => {
    let result = await cartModel.find({ _id: id }).lean();
    return result;
  };
  createCart = async () => {
    let result = await cartModel.create({});
    return result;
  };
  addProduct = async (id, productId) => {
    const cart = await this.getCartById(id);

    const index = cart.products.findIndex(
      (p) => p.product._id.toString() == productId
    );
    if (index >= 0) {
      cart.products[index].quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    await cartModel.updateOne({ _id: id }, cart);
  };
  deleteProduct = async (cid, pid) => {
    try {
      let cart = await cartModel.findById(cid);
      //let product = cart.products.filter((p) => p.product !== pid);

      if (!cart) {
        console.log("El carrito no existe");
      } else {
        cart.products = cart.products.filter(
          (p) => p.product._id.toString() !== pid
        );
      }

      await cart.save();
    } catch (error) {
      console.error(
        `Error al borrar el producto del carrito: ${error.message}`
      );
      throw error;
    }
  };
  deleteAll = async (cid) => {
    const cart = await cartModel.findById(cid);

    if (!cart) {
      throw new Error("Cart not found");
    }

    cart.products = [];

    return await cart.save();
  };
  updateQuantity = async (cid, pid, newProductQuantity) => {
    let cart = await this.getCartById(cid);

    let index = cart.products.findIndex((p) => p.product._id.toString() == pid);

    if (index >= 0) {
      cart.products[index].quantity = newProductQuantity;
    } else {
      console.error("Hubo un error al actualizar la cantidad del producto");
    }

    let result = cartModel.updateOne({ _id: cid }, cart);
    return result;
  };
  updateCart = async (cid, productList) => {
    const cart = await this.getCartById(cid);
    productList.forEach((pl) => {
      const index = cart.products.findIndex(
        (p) => p.product._id.toString() == pl.product
      );

      if (index >= 0) {
        cart.products[index].quantity += pl.quantity;
      } else {
        cart.products.push({ product: pl.product, quantity: pl.quantity });
      }
    });
    await cartModel.updateOne({ _id: cid }, cart);
  };
  purchase = async (cid, email) => {
    const cart = await this.getCartById(cid);

    const notPurchasedIds = [];
    let totalAmount = 0;

    for (let i = 0; i < cart.products.length; i++) {
      const item = cart.products[i]; //TODO: arreglar error de sintaxis
      const remainder = item.product.stock - item.quantity;
      if (remainder >= 0) {
        await productService.updateProduct(item.product._id, {
          ...item.product,
          stock: remainder,
        });
        await this.deleteProduct(cid, item.product._id.toString());
        totalAmount += item.quantity * item.product.price;
      } else {
        notPurchasedIds.push(item.product._id);
      }
    }

    if (totalAmount > 0) {
      await ticketService.generate(email, totalAmount);
    }

    return notPurchasedIds;
  };
  /*
  - Verifica y actualiza el stock de cada producto.
  - Elimina productos del carrito si se compran.
  - Calcula el monto total de la compra.
  - Genera un ticket si hubo una compra efectiva.
  - Devuelve los IDs de los productos que no se pudieron comprar debido a la falta de stock.
  */
}
