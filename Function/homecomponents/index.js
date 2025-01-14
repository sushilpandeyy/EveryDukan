require('dotenv').config();
const mongoose = require('mongoose');

let conn = null;

// Connect to the MongoDB database
async function connectToDatabase() {
    if (!conn) {
        conn = await mongoose.connect(process.env.MONGO_URI, {
            dbName: 'test',
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    }
}

// Define a flexible schema
const ComponentSchema = new mongoose.Schema({}, { strict: false });
const Component = mongoose.model('Component', ComponentSchema, 'components');

// Fetch all documents from the 'components' collection
async function fetchAllComponents() {
    await connectToDatabase();
    return await Component.find({});
}

// Export the Lambda handler
exports.handler = async (event, context) => {
    try {
        const components = await fetchAllComponents();
        return {
            statusCode: 200,
            body: JSON.stringify(components),
        };
    } catch (error) {
        console.error('Error fetching components:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }
};
