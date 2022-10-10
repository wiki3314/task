import mongoose from "mongoose";
import { v1 as uuidv1 } from "uuid";

/**
 * locations Schema
 */

const locationsSchema = new mongoose.Schema({
  locationId: { type: String, default: (_) => uuidv1() },
  name: { type: String },
  createdDate: { type: Date, default: Date.now },
});

/**
 * @typedef locations
 */
export default mongoose.model("locations", locationsSchema);
