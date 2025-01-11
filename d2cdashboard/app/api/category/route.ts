// Import required modules
import mongoose, { Schema, model, models, Model, Document } from 'mongoose';
import { NextResponse, NextRequest } from 'next/server';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// MongoDB schema for Categories
interface ICategory extends Document {
  title: string;
}

const categorySchema = new Schema<ICategory>(
  {
    title: { type: String, required: true },
  },
  { collection: 'Categories' }
);

// Ensure we don't redefine the model in development
const Category: Model<ICategory> = models.Category || model<ICategory>('Category', categorySchema);

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
      const category = await Category.findById(id);
      if (!category) {
        return NextResponse.json({ message: 'Category not found' }, { status: 404 });
      }
      return NextResponse.json(category, { status: 200 });
    } else {
      const categories = await Category.find();
      return NextResponse.json(categories, { status: 200 });
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
    const category = new Category(body);
    await category.save();
    return NextResponse.json(category, { status: 201 });
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
    const category = await Category.findByIdAndUpdate(id, body, { new: true });
    if (!category) {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }
    return NextResponse.json(category, { status: 200 });
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

    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Category deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
