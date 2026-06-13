import mongoose from "mongoose";
//function to connect mongodb database

export const connectDB = async () => {
  try {
    console.log("URI:", process.env.MONGODB_URI);

    mongoose.connection.on("connected", () =>
      console.log("database connected"),
    );

    await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    console.log("DB ERROR:", error);
  }
};
