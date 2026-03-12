import "dotenv/config";
import mongoose from "mongoose";
import app from "./app";
mongoose.connect(process.env.MONGODB_URI!)
  .then(() => {
    console.log("Connected to MongoDB Atlas");
    app.listen(process.env.PORT ?? 5000, () =>
      console.log(`Server running on port ${process.env.PORT ?? 5000}`)
    );
  })
  .catch(err => { console.error("DB connection failed:", err); process.exit(1); });