import mongoose from "mongoose";
import { v1 as uuidv1 } from "uuid";

/**
 * customers Schema
 */

const customersSchema = new mongoose.Schema({
  customerId: { type: String, default: (_) => uuidv1() },
  locationId: { type: String },
  firstName: { type: String },
  lastName: { type: String },

  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please enter a valid email",
    ],
  },
  phone: { type: String },
  createdDate: { type: Date, default: Date.now },
});

/**
 * @typedef customers
 */
export default mongoose.model("customers", customersSchema);
