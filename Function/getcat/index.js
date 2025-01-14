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
const CatSchema = new mongoose.Schema({}, { strict: false });
const Categories= mongoose.model('Categories', CatSchema, 'Categories');

// Fetch Bannerss with pagination
async function fetchCat() {
    await connectToDatabase();
         
    const Coupon= await Coupons.find({});
    return {
        Coupon
    };
}

// Export the Lambda handler
exports.handler = async (event, context) => {
    try {
        
        const result = await fetchCat();
        
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