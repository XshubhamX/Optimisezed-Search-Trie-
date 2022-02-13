const mongoose = require("mongoose");

const connectDB = async () => {
  const db = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.7qara.mongodb.net/${process.env.DB_NAME}?authSource=admin&replicaSet=atlas-rbjdfu-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true`;

  try {
    await mongoose.connect(db);

    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = {
  connectDB,
};
