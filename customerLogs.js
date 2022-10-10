import mongoose from "mongoose";
import { v1 as uuidv1 } from "uuid";

/**
 * customer Logs Schema
 */
const customerLogsSchema = new mongoose.Schema({
  customerId: { type: String },
  type: { type: String },
  text: { type: String },
  date: { type: Date, default: Date.now },
});

/**
 * @typedef customerLogs
 */
export default mongoose.model("customerLogs", customerLogsSchema);
