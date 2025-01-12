import mongoose, { Schema, model, models, Model, Document } from 'mongoose';
import { NextResponse } from 'next/server';
import dotenv from 'dotenv';

dotenv.config();

// MongoDB Schema and Model for Banners
interface IBanner extends Document {
  title: string;
  bannerImage: string;
  isActive: boolean;
  linkForClick: string;
}

const bannerSchema = new Schema<IBanner>(
  {
    title: { type: String, required: true },
    bannerImage: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    linkForClick: { type: String, required: true },
  },
  { collection: 'Banners', timestamps: true }
);

const Banner: Model<IBanner> = models.Banner || model<IBanner>('Banner', bannerSchema);

// MongoDB Connection
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

// GET all banners
export async function GET() {
  await connectToDatabase();
  try {
    const banners = await Banner.find({});
    return NextResponse.json({ success: true, data: banners });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

// POST a new banner
export async function POST(req: Request) {
  await connectToDatabase();

  try {
    const { title, bannerImage, isActive, linkForClick } = await req.json();
    const banner = new Banner({ title, bannerImage, isActive, linkForClick });
    await banner.save();
    return NextResponse.json({ success: true, data: banner }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}

// PUT to update a banner
export async function PUT(req: Request) {
  await connectToDatabase();

  try {
    const { id, title, bannerImage, isActive, linkForClick } = await req.json();
    const updatedBanner = await Banner.findByIdAndUpdate(
      id,
      { title, bannerImage, isActive, linkForClick },
      { new: true }
    );
    if (!updatedBanner) {
      return NextResponse.json({ success: false, error: 'Banner not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updatedBanner });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}

// DELETE a banner by ID
export async function DELETE(req: Request) {
  await connectToDatabase();

  try {
    const { id } = await req.json();
    const deletedBanner = await Banner.findByIdAndDelete(id);
    if (!deletedBanner) {
      return NextResponse.json({ success: false, error: 'Banner not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: deletedBanner });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}
