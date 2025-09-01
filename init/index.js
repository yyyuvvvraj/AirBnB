const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

// Encode your password if it contains special characters like "@"
const username = "yyyuvvvraj";
const rawPassword = "Yuvraj@2806";
const encodedPassword = encodeURIComponent(rawPassword); // Yuvraj%402806

const MONGO_ATLAS_URI = `mongodb+srv://${username}:${encodedPassword}@cluster0.4tqzhl2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

async function main() {
    try {
        await mongoose.connect(MONGO_ATLAS_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connected");

        // Initialize the data only after successful connection
        await Listing.deleteMany({});
        await Listing.insertMany(initData.data);
        console.log("Data was initialized");
    } catch (err) {
        console.log("Error:", err);
    } finally {
        // Close mongoose connection
        mongoose.connection.close();
    }
}

main();
