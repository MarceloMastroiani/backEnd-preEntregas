import { productService } from "../repositories/index.js";
import { cartService } from "../repositories/index.js";
import productsModel from "../dao/models/products.js";

export const viewGetAll = async (req, res) => {
  let product = await productService.getAll();
  res.render("home", { product });
};

export const viewGetAllRealTime = async (req, res) => {
  let product = await productService.getAll();
  res.render("realTimeProducts", { product });
};

export const viewChat = async (req, res) => {
  res.render("chat", {});
};

export const viewProducts = async (req, res) => {
  let limit = req.query.limit || 10;
  let page = req.query.page || 1;
  let sort = parseInt(req.query.sort);
  let filt = {};

  if (req.query.query) {
    filt = {
      $or: [{ description: req.query.query }, { category: req.query.query }],
    };
  }

  let sortPrice = {};
  if (sort) {
    sortPrice = { price: sort };
  }

  const result = await productsModel.paginate(filt, {
    limit,
    page,
    sort: sortPrice,
    lean: true,
  });

  result.isValid = page >= 1 && page <= result.totalPages;

  result.nextLink = result.hasNextPage
    ? `http://localhost:8080/products?limit=${result.limit}&page=${result.nextPage}&sort=${result.sort}`
    : "";
  result.prevLink = result.hasPrevPage
    ? `http://localhost:8080/products?limit=${result.limit}&page=${result.prevPage}&sort=${result.sort}`
    : "";

  const cart = await cartService.getCartById(req.user.cart._id);
  console.log(cart);
  const user = req.session.user;
  // console.log(user); //muestra los datos del usuario por consola. TODO: remove

  res.render("product", { ...result, user, cart });
};

export const viewCarts = async (req, res) => {
  const { cid } = req.params;
  try {
    const response = await cartService.getCartById(cid);
    res.render("cart", { response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const viewRestore = async (req, res) => {
  res.render("restore");
};

export const viewRegister = async (req, res) => {
  res.render("register");
};

export const viewLogin = async (req, res) => {
  res.render("login");
};
