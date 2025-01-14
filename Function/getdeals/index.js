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
const DealsSchema = new mongoose.Schema({}, { strict: false });
const Deals = mongoose.model('Deals', DealsSchema, 'Deals');

// Fetch Bannerss with pagination
async function fetchBannerss(page = 1, limit = 10) {
    await connectToDatabase();
    
    // Convert string parameters to numbers and ensure they're valid
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, parseInt(limit));
    
    // Calculate skip value for pagination
    const skip = (pageNum - 1) * limitNum;

    // Get total count of documents for pagination metadata
    const totalDocs = await Deals.countDocuments();
    
    // Fetch paginated results
    const Deal= await Deals.find({})
        .skip(skip)
        .limit(limitNum);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalDocs / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    return {
        Deal,
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
        
        const result = await fetchBannerss(page, limit);
        
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