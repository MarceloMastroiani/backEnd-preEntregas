import dotenv from "dotenv";

dotenv.config();

export const entorno = {
  port: process.env.PORT,
  mongoUrl: process.env.MONGO_URL,

  //NODEMAILER CONFIG
  mail_username: process.env.MAIL_USERNAME,
  mail_password: process.env.MAIL_PASSWORD,

  //TWILIO CONFIG
  twilio_sid: process.env.TWILIO_SSID,
  auth_token: process.env.AUTH_TOKEN,
  phone_number: process.env.PHONE_NUMBER,
  phone_number_to: process.env.PHONE_NUMBER_TO,
};
