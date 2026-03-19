import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/JP");
    console.log("Connected to MongoDB");

    const User = mongoose.connection.db.collection('users');
    const users = await User.find({}).toArray();
    
    console.log("Registered Users:");
    users.forEach((user, index) => {
      console.log(`${index + 1}. Name: ${user.name}, Email: ${user.email}, Role: ${user.role}`);
    });

  } catch (error) {
    console.error("Error fetching users:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

checkUsers();
