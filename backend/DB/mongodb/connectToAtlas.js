require("dotenv").config();
const mongoose = require("mongoose");

const connectionStringForAtlas = process.env.MONGO_ATLAS_URI;

const connectToAtlasDB = async () => {
  try {
    await mongoose.connect(connectionStringForAtlas);
    console.log("Connected to MongoDB in Atlas");
  } catch (error) {
    console.error("Could not connect MongoDB in Atlas", error);
  }
};

module.exports = connectToAtlasDB;