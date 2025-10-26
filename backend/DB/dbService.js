const connectToLocalDB = require("./mongodb/connectToMongodbLocally");
const connectToAtlasDB = require("./mongodb/connectToAtlas");
require("dotenv").config();

const NODE_ENV = process.env.NODE_ENV
const DB = process.env.DB;

const connectToDB = async () => {
    if (DB === "MONGODB") {
        if (NODE_ENV === "development") {
            await connectToLocalDB();
        }

        if (NODE_ENV === "production") {
            await connectToAtlasDB();
        }
    }

    if (DB === "sql"){

    }
}

module.exports = connectToDB;