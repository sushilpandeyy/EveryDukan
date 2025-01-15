require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = "test";

let cachedDb = null;

async function connectToDatabase() {
    if (cachedDb) {
        return cachedDb;
    }

    try {
        const client = await MongoClient.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const db = client.db(DB_NAME);
        cachedDb = db;
        return db;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
}

exports.handler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;

    try {
        const userData = JSON.parse(event.body);

        if (!userData.name || !userData.gender || !userData.fcmToken) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'Missing required fields'
                })
            };
        }

        const currentTime = new Date();

        const newUser = {
            name: userData.name,
            preferences: Array.isArray(userData.preferences) ? userData.preferences : [],
            gender: userData.gender,
            fcmToken: userData.fcmToken,
            createdAt: currentTime,
            lastVisitedAt: currentTime
        };

        const db = await connectToDatabase();
        const collection = db.collection('users');

        const result = await collection.insertOne(newUser);

        const userWithId = {
            ...newUser,
            _id: result.insertedId
        };

        return {
            statusCode: 201,
            body: JSON.stringify({
                message: 'User created successfully',
                user: userWithId
            })
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Internal server error',
                error: error.message
            })
        };
    }
};