// app/api/coupon/[id]/route.ts

import { NextResponse, NextRequest } from 'next/server';
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

// MongoDB connection utility
async function connectToDatabase() {
  if (!mongoose.connection.readyState) {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in the environment variables');
    }
    try {
      await mongoose.connect(mongoUri);
    } catch (error) {
      throw new Error(`Failed to connect to MongoDB: ${(error as Error).message}`);
    }
  }
}

// Interface for Coupon
interface Coupon {
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

// Function to delete a coupon by `_id`
async function deleteCoupon(_id: ObjectId) {
  await connectToDatabase();
  const db = mongoose.connection;
  const collection = db.collection('Coupons');

  try {
    const result = await collection.deleteOne({ _id });
    return result;
  } catch (error) {
    throw new Error(`Failed to delete coupon: ${(error as Error).message}`);
  }
}

// Function to create a new coupon
async function createCoupon(data: Coupon) {
  await connectToDatabase();
  const db = mongoose.connection;
  const collection = db.collection('Coupons');

  try {
    const result = await collection.insertOne(data);
    return result;
  } catch (error) {
    throw new Error(`Failed to create coupon: ${(error as Error).message}`);
  }
}

// PUT route handler
export async function PUT(
  req: NextRequest,
  { params }: any
) {
  try {
    const id = params.id;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Coupon ID is missing' },
        { status: 400 }
      );
    }

    // Validate the ID format and convert to ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid Coupon ID format' },
        { status: 400 }
      );
    }
    const _id = new ObjectId(id);

    const data = (await req.json()) as Coupon;

    // Validate required fields
    if (!data.title || !data.merchantName || !data.couponCode) {
      return NextResponse.json(
        {
          success: false,
          error: 'Required fields: title, merchantName, and couponCode are missing.',
        },
        { status: 400 }
      );
    }

    // Delete the old coupon
    const deleteResult = await deleteCoupon(_id);

    // Check if the coupon existed and was deleted
    if (deleteResult.deletedCount === 0) {
      console.warn(`Coupon with ID ${id} not found. Proceeding with creation.`);
    }

    // Create a new coupon
    const createResult = await createCoupon(data);

    return NextResponse.json({
      success: true,
      message: 'Coupon updated successfully (delete and create).',
      data: {
        _id: createResult.insertedId, // Return the new `_id`
      },
    });
  } catch (error) {
    console.error('Error in PUT handler:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
