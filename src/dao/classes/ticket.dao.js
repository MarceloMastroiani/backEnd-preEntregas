import ticketModel from "../models/ticket";

export default class Ticket {
  constructor() {
    console.log("Trabajando con ticket.dao");
  }

  getAll = async () => {
    return await ticketModel.find().lean();
  };

  getById = async (id) => {
    return await ticketModel.findOne({ _id: id }).lean();
  };

  create = async (item) => {
    return await ticketModel.create(item);
  };

  update = async (id, item) => {
    return await ticketModel.updateOne({ _id: id }, item);
  };

  delete = async (id) => {
    return await ticketModel.deleteOne({ _id: id });
  };
}
