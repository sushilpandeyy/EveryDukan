// app/api/components/reorder/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';

const DynamicSchema = new mongoose.Schema({
  order: {
    type: Number,
    required: true
  }
}, {
  timestamps: true,
  strict: false
});

const DynamicModel = mongoose.models.Component || 
  mongoose.model('Component', DynamicSchema);

export async function PUT(request: NextRequest) {
  try {
    await connectToDatabase();
    const { components } = await request.json();

    if (!Array.isArray(components)) {
      return NextResponse.json(
        { message: 'Invalid request body' },
        { status: 400 }
      );
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Update all components with their new order
      await Promise.all(
        components.map(({ _id, order }) =>
          DynamicModel.findByIdAndUpdate(
            _id,
            { order },
            { 
              new: true,
              session 
            }
          )
        )
      );

      // Fetch all components sorted by new order
      const updatedComponents = await DynamicModel.find()
        .sort({ order: 1 })
        .lean()
        .session(session);

      await session.commitTransaction();
      return NextResponse.json(updatedComponents);
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