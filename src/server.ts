/// <reference path="./types/express.d.ts" />
import dotenv from "dotenv";

dotenv.config();

import app from "./app";
import connectDb from "./config/db/connectDb";

const PORT = process.env.PORT || 3000;

async function init() {
  try {
    await connectDb();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.log("DB CONNECTION FAILED ❌");

    console.log(error);
  }
}

init();
