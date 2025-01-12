import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Component from '@/models/Component';

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

    // Update orders in bulk
    await Promise.all(
      components.map((comp: { _id: string; order: number }) =>
        Component.findByIdAndUpdate(
          comp._id,
          { order: comp.order, updatedAt: Date.now() },
          { new: true }
        )
      )
    );

    const updatedComponents = await Component.find().sort({ order: 1 });
    return NextResponse.json(updatedComponents);
  } catch (error) {
    console.error('Reorder Components Error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
