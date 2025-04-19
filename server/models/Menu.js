import mongoose from "mongoose";

const MealSchema = new mongoose.Schema({
  items: String,
  startTime: String,
  endTime: String,
});

const MenuSchema = new mongoose.Schema({
  vendorEmail: { type: String, required: true },
  vendorName: String,
  date: String,
  day: String,
  meals: {
    breakfast: MealSchema,
    lunch: MealSchema,
    dinner: MealSchema,
  },
}, { timestamps: true });

export default mongoose.model("Menu", MenuSchema);
