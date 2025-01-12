import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Component from '@/models/Component';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const component = await Component.findById(params.id);
    
    if (!component) {
      return NextResponse.json(
        { message: 'Component not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(component);
  } catch (error) {
    console.error('GET Component Error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const updatedComponent = await Component.findByIdAndUpdate(
      params.id,
      { ...body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!updatedComponent) {
      return NextResponse.json(
        { message: 'Component not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedComponent);
  } catch (error) {
    console.error('PUT Component Error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const deletedComponent = await Component.findByIdAndDelete(params.id);

    if (!deletedComponent) {
      return NextResponse.json(
        { message: 'Component not found' },
        { status: 404 }
      );
    }

    // Reorder remaining components
    await Component.updateMany(
      { order: { $gt: deletedComponent.order } },
      { $inc: { order: -1 } }
    );

    return NextResponse.json(
      { message: 'Component deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE Component Error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
