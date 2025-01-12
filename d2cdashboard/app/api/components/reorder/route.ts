// app/api/components/route.ts
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
  
export async function PUT(request: NextRequest) {
  try {
    await connectToDatabase();
    const { items } = await request.json();

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { message: 'Invalid request body' },
        { status: 400 }
      );
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Update orders in bulk
      await Promise.all(
        items.map(item =>
          DynamicModel.findByIdAndUpdate(
            item._id,
            { order: item.order },
            { 
              new: true,
              session
            }
          )
        )
      );

      const updatedItems = await DynamicModel.find()
        .sort({ order: 1 })
        .lean()
        .session(session)
        .exec();

      await session.commitTransaction();
      return NextResponse.json(updatedItems);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error('Reorder Error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}