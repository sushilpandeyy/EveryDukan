// Import required modules
import { NextResponse, NextRequest } from 'next/server';
import mongoose, { Schema, model, models, Model, Document } from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// MongoDB schema for Coupons
interface ICoupon extends Document {
  title: string;
  merchantName: string;
  merchantLogo: string;
  couponCode: string;
  description: string;
  expirationDate: string;
  discount: string;
  category: string;
  backgroundColor: string;
  accentColor: string;
  terms: string[];
}

const couponSchema = new Schema(
  {
    title: { type: String, required: true },
    merchantName: { type: String, required: true },
    merchantLogo: { type: String, required: true },
    couponCode: { type: String, required: true },
    description: { type: String},
    expirationDate: { type: String, required: true },
    discount: { type: String, required: true },
    category: { type: String },
    backgroundColor: { type: String, required: true },
    accentColor: { type: String, required: true },
    terms: { type: [String] },
  },
  { collection: 'Coupons' }
);

// Ensure we don't redefine the model in development
const Coupon: Model<ICoupon> = models.Coupon || model('Coupon', couponSchema);

// MongoDB connection function
let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGO_URI || '');
    isConnected = true;
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Could not connect to the database');
  }
};
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      await connectToDatabase();
      const coupon = await Coupon.findById(params.id);
      if (!coupon) {
        return NextResponse.json({ message: 'Coupon not found' }, { status: 404 });
      }
      return NextResponse.json(coupon);
    } catch (error) {
      return NextResponse.error();
    }
  }
