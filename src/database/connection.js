const mongoose = require("mongoose");
const config = require("./config/config"); // Import config
const logger = require("./utils/logger"); // Import logger

const connectDB = async () => {
    try {
        await mongoose.connect(config.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        logger.info("✅ MongoDB connected successfully!");
    } catch (error) {
        logger.error("❌ MongoDB connection failed!", error);
        process.exit(1); // Exit process on failure
    }
};

module.exports = connectDB;
