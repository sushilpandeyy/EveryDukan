import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';

// Define a dynamic schema that accepts any fields
const DynamicSchema = new mongoose.Schema({
  order: {
    type: Number,
    required: true,
    default: 0
  }
}, {
  timestamps: true,
  strict: false // Allows any fields to be saved
});

// Create or get the model
const DynamicModel = mongoose.models.Component || 
  mongoose.model('Component', DynamicSchema);

export async function GET() {
  try {
    await connectToDatabase();
    const items = await DynamicModel.find()
      .sort({ order: 1 })
      .lean()
      .exec();
      
    return NextResponse.json(items);
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    
    // Get the last item to determine new order
    const lastItem = await DynamicModel.findOne()
      .sort({ order: -1 })
      .lean()
      .exec();
      
    // Create new document with the provided data
    const newItem = new DynamicModel({
      ...body,
      order: lastItem && !Array.isArray(lastItem) && lastItem.order !== undefined ? lastItem.order + 1 : 0,
    });
    
    const savedItem = await newItem.save();
    return NextResponse.json(savedItem.toObject(), { status: 201 });
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
