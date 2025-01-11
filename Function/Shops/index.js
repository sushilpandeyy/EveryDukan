// Import required modules
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Define the MongoDB schema for Shops
const shopSchema = new mongoose.Schema({
    title: String,
    logo: String,
    url: String,
    category: [String],
    // Add other fields as per your collection structure
}, { collection: 'Shops' });

// Create a model
const Shop = mongoose.model('Shop', shopSchema);

// Establish MongoDB connection
let connection = null;
const connectToDatabase = async () => {
    if (connection) {
        return connection;
    }

    try {
        connection = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
        return connection;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw new Error('Could not connect to the database');
    }
};

// Lambda handler
exports.handler = async (event) => {
    try {
        // Connect to the database
        await connectToDatabase();

        // Extract the ID from the event (e.g., query parameters or path)
        const shopId = event.queryStringParameters && event.queryStringParameters.id;
        if (!shopId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Shop ID is required' }),
            };
        }

        // Find the shop by ID
        const shop = await Shop.findById(shopId);
        if (!shop) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Shop not found' }),
            };
        }

        // Return the shop data
        return {
            statusCode: 200,
            body: JSON.stringify(shop),
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error', error: error.message }),
        };
    }
};
