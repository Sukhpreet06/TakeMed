const mongoose = require("mongoose");

// Connect to MongoDB without deprecated options
mongoose.connect(process.env.MONGO_URL);

// Get the default connection instance
const connection = mongoose.connection;

// Event listeners for connection
connection.on("connected", () => {
    console.log("MongoDB connected successfully");
});

connection.on("error", (error) => {
    console.error("Error in MongoDB connection:", error);
});

module.exports = mongoose;
