import { connectMongo, disconnectMongo } from "../db/mongoose.js";
import Message from "../models/message.js";

const saveMessage = async (message) => {
  try {
    await connectMongo();
    const savedMessage = await Message.create(message);
    return savedMessage;
  } catch (error) {
    console.error(error);
  } finally {
    await disconnectMongo();
  }
};

export default saveMessage;
