import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';

// Define the schema (you can move this to a separate models file)
const DynamicSchema = new mongoose.Schema({
  order: {
    type: Number,
    required: true,
    default: 0
  }
}, {
  timestamps: true,
  strict: false
});

const DynamicModel = mongoose.models.Component || 
  mongoose.model('Component', DynamicSchema);

 
// The PUT method with a more specific params type
export async function PUT(
  request: NextRequest,
  { params }: { params: any } // Ensure the type is explicitly defined for params
) {
  try {
    await connectToDatabase();
    
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { message: 'Invalid ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const updatedItem = await DynamicModel.findByIdAndUpdate(
      params.id,
      { ...body },
      { 
        new: true,
        lean: true
      }
    ).exec();

    if (!updatedItem) {
      return NextResponse.json(
        { message: 'Item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// The DELETE method with a more specific params type
export async function DELETE(
  request: NextRequest,
  { params }: { params: any } // Ensure the type is explicitly defined for params
) {
  try {
    await connectToDatabase();
    
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { message: 'Invalid ID' },
        { status: 400 }
      );
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const deletedItem = await DynamicModel.findById(params.id).session(session);
      
      if (!deletedItem) {
        await session.abortTransaction();
        return NextResponse.json(
          { message: 'Item not found' },
          { status: 404 }
        );
      }

      await deletedItem.deleteOne({ session });

      // Update orders for remaining items
      await DynamicModel.updateMany(
        { order: { $gt: deletedItem.order } },
        { $inc: { order: -1 } },
        { session }
      );

      await session.commitTransaction();
      return NextResponse.json(
        { message: 'Item deleted successfully' },
        { status: 200 }
      );
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
