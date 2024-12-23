import mongoose from "mongoose";
const connectMongo = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/Project");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to MongoDB");
    process.exit(1);
  }
};
export default connectMongo;
