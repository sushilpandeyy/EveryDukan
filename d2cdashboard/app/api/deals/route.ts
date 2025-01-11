// app/api/deals/route.ts
import { NextRequest, NextResponse } from 'next/server';
import mongoose, { Schema, Document, Model, models, model } from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Interface for Deal document
interface IDeal extends Document {
  imageUrl: string;
  title: string;
  subtitle: string;
  originalPrice: number;
  discountedPrice: number;
  shopUrl: string;
  isActive: boolean;
  startDate: Date;
  endDate: Date;
}

// Define Deal Schema
const dealSchema = new Schema<IDeal>(
  {
    imageUrl: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    originalPrice: { type: Number, required: true, min: 0 },
    discountedPrice: { type: Number, required: true, min: 0 },
    shopUrl: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: true },
  },
  { 
    timestamps: true,
    collection: 'Deals'
  }
);

// Create indexes for better query performance
dealSchema.index({ isActive: 1, startDate: 1, endDate: 1 });
dealSchema.index({ title: 'text', subtitle: 'text' });

// Initialize model
const Deal: Model<IDeal> = models.Deal || model<IDeal>('Deal', dealSchema);

// MongoDB connection state
let isConnected = false;

// Database connection function
const connectToDatabase = async () => {
  if (isConnected) return;

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not defined in environment variables');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to the database');
  }
};

// Helper function to parse query parameters
const parseQueryParams = (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const search = searchParams.get('search') || '';
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortOrder = searchParams.get('sortOrder') || 'desc';
  const isActive = searchParams.get('isActive');

  return {
    page,
    limit,
    search,
    sortBy,
    sortOrder,
    isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined
  };
};

// GET /api/deals
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const { page, limit, search, sortBy, sortOrder, isActive } = parseQueryParams(request);
    const skip = (page - 1) * limit;

    // Build query
    let query: any = {};
    if (isActive !== undefined) {
      query.isActive = isActive;
    }
    if (search) {
      query.$text = { $search: search };
    }

    // Get total count for pagination
    const totalDeals = await Deal.countDocuments(query);

    // Execute query with pagination and sorting
    const deals = await Deal.find(query)
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json({
      deals,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalDeals / limit),
        totalItems: totalDeals,
        itemsPerPage: limit,
      },
    });
  } catch (error: any) {
    console.error('GET /api/deals error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deals', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/deals
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.imageUrl || !body.subtitle || !body.originalPrice || 
        !body.discountedPrice || !body.shopUrl || !body.endDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create new deal
    const deal = await Deal.create(body);
    return NextResponse.json(deal, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/deals error:', error);
    return NextResponse.json(
      { error: 'Failed to create deal', details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/deals
export async function PUT(request: NextRequest) {
  try {
    await connectToDatabase();
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json(
        { error: 'Deal ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const updatedDeal = await Deal.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedDeal) {
      return NextResponse.json(
        { error: 'Deal not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedDeal);
  } catch (error: any) {
    console.error('PUT /api/deals error:', error);
    return NextResponse.json(
      { error: 'Failed to update deal', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/deals
export async function DELETE(request: NextRequest) {
  try {
    await connectToDatabase();
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json(
        { error: 'Deal ID is required' },
        { status: 400 }
      );
    }

    const deletedDeal = await Deal.findByIdAndDelete(id);
    if (!deletedDeal) {
      return NextResponse.json(
        { error: 'Deal not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Deal deleted successfully' });
  } catch (error: any) {
    console.error('DELETE /api/deals error:', error);
    return NextResponse.json(
      { error: 'Failed to delete deal', details: error.message },
      { status: 500 }
    );
  }
}