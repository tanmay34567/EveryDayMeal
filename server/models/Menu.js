// models/Menu.js
import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema({
  items: String,
  startTime: String,
  endTime: String,
});

const menuSchema = new mongoose.Schema({
  vendorEmail: { type: String, required: true },
  vendorName: { type: String, required: true },
  date: { type: String, required: true },
  day: { type: String, required: true },
  meals: {
    breakfast: mealSchema,
    lunch: mealSchema,
    dinner: mealSchema,
  },
});

export default mongoose.model("Menu", menuSchema);
