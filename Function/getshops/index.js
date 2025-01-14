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
const ShopsSchema = new mongoose.Schema({}, { strict: false });
const Shops = mongoose.model('Shops', ShopsSchema, 'Shops');

// Fetch Bannerss with pagination
async function fetchshops(page = 1, limit = 10) {
    await connectToDatabase();
     
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, parseInt(limit));
    
    // Calculate skip value for pagination
    const skip = (pageNum - 1) * limitNum;

    // Get total count of documents for pagination metadata
    const totalDocs = await Shops.countDocuments();
    
    // Fetch paginated results
    const Shop= await Shops.find({})
        .skip(skip)
        .limit(limitNum);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalDocs / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    return {
        Shop,
        pagination: {
            currentPage: pageNum,
            totalPages,
            totalDocs,
            limit: limitNum,
            hasNextPage,
            hasPrevPage
        }
    };
}

// Export the Lambda handler
exports.handler = async (event, context) => {
    try {
        // Extract page and limit from query parameters
        const { page, limit } = event.queryStringParameters || {};
        
        const result = await fetchshops(page, limit);
        
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(result)
        };
    } catch (error) {
        console.error('Error fetching Bannerss:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ error: 'Internal Server Error' })
        };
    }
};