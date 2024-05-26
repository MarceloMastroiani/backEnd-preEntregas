import Product from "../dao/classes/products.dao.js";
import Cart from "../dao/classes/carts.dao.js";
import Ticket from "../dao/classes/ticket.dao.js";

export const productService = new Product();
export const cartService = new Cart();
export const ticketService = new Ticket();
