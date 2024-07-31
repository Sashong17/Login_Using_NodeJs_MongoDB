const mongoose = require('mongoose');

// MongoDB connection string
const uri = "mongodb+srv://sashong2003:12345@cluster0.xwvoysc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB
mongoose.connect(uri)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch(err => {
        console.error("Error connecting to MongoDB", err);
    });

// Define the schema and model for the users collection
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    dob: String,
    email: String,
    number: String,
    address: String,
    username: String,
    role: String // Store role if needed
});

const User = mongoose.model("User", userSchema);

// Define the schema and model for the drivers collection
const driverSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    dob: String,
    email: String,
    number: String,
    address: String,
    licenseNo: String,
    licenseExpiry: String,
    vehicleType: String,
    username: String,
    password: {
        type: String,
        required: true
    }
});

const Driver = mongoose.model("Driver", driverSchema);

module.exports = { User, Driver };
