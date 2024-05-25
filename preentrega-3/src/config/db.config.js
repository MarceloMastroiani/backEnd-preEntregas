import mongoose from "mongoose";
import {entorno} from "./entorno.config.js"

//settings
const MONGO_URL = entorno.mongoUrl

const dbConnection = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log(`Database is connected!`);
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

export default dbConnection;