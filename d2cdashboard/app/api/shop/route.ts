// Import required modules
import mongoose, { Schema, model, models, Model, Document } from 'mongoose';
import { NextResponse, NextRequest } from 'next/server';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// MongoDB schema for Shops
interface IShop extends Document {
  title: string;
  logo: string;
  url: string;
  category: string[];
}

const shopSchema = new Schema<IShop>(
  {
    title: { type: String, required: true },
    logo: { type: String, required: true },
    url: { type: String, required: true },
    category: { type: [String], required: true },
  },
  { collection: 'Shops' }
);

// Ensure we don't redefine the model in development
const Shop: Model<IShop> = models.Shop || model<IShop>('Shop', shopSchema);

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

// API Handlers
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const shop = await Shop.findById(id);
      if (!shop) {
        return NextResponse.json({ message: 'Shop not found' }, { status: 404 });
      }
      return NextResponse.json(shop, { status: 200 });
    } else {
      const shops = await Shop.find();
      return NextResponse.json(shops, { status: 200 });
    }
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const shop = new Shop(body);
    await shop.save();
    return NextResponse.json(shop, { status: 201 });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'ID is required' }, { status: 400 });
    }

    const body = await req.json();
    const shop = await Shop.findByIdAndUpdate(id, body, { new: true });
    if (!shop) {
      return NextResponse.json({ message: 'Shop not found' }, { status: 404 });
    }
    return NextResponse.json(shop, { status: 200 });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'ID is required' }, { status: 400 });
    }

    const shop = await Shop.findByIdAndDelete(id);
    if (!shop) {
      return NextResponse.json({ message: 'Shop not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Shop deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
