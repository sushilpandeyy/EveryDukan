import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Component from '@/models/Component';

export async function GET() {
  try {
    await connectToDatabase();
    const components = await Component.find().sort({ order: 1 });
    return NextResponse.json(components);
  } catch (error) {
    console.error('GET Components Error:', error);
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

    // Get the last component to determine new order
    const lastComponent = await Component.findOne().sort({ order: -1 });
    const newOrder = lastComponent ? lastComponent.order + 1 : 0;

    const component = new Component({
      ...body,
      order: newOrder,
    });

    await component.save();
    return NextResponse.json(component, { status: 201 });
  } catch (error) {
    console.error('POST Component Error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
