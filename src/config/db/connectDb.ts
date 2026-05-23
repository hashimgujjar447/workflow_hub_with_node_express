import mongoose from "mongoose";


async function connectDb() {

  try {

   

    const connection = await mongoose.connect(
      process.env.MONGO_URI as string
    );

    console.log(
      `MongoDB Connected: ${connection.connection.host}`
    );

  } catch (error) {

    console.log("MongoDB connection failed ❌");

    console.log(error);

    process.exit(1);
  }

}

export default connectDb;