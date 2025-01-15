// Import required modules
import { NextResponse, NextRequest } from 'next/server';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// MongoDB connection utility
async function connectToDatabase() {
  if (!mongoose.connection.readyState) {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in the environment variables');
    }
    await mongoose.connect(mongoUri);
  }
}

// Define the Coupon interface
interface Coupon {
  id: string;
  title: string;
  merchantName: string;
  merchantLogo: string;
  clickurl: string;
  couponCode: string;
  description: string;
  expirationDate: string;
  discount: string;
  category: string;
  backgroundColor: string;
  accentColor: string;
  terms: string[];
}

// Function to add a new coupon
export async function addCoupon(data: Coupon) {
  await connectToDatabase();
  const db = mongoose.connection;
  const collection = db.collection('Coupons');
  const result = await collection.insertOne(data);
  return result;
}

// Function to get all coupons
export async function getCoupons() {
  await connectToDatabase();
  const db = mongoose.connection;
  const collection = db.collection('Coupons');
  const coupons = await collection.find({}).toArray();
  return coupons;
}

// Handle API routes
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const result = await addCoupon(data);
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message });
  }
}

export async function GET() {
  try {
    const coupons = await getCoupons();
    return NextResponse.json({ success: true, coupons });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message });
  }
}
