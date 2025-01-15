import { NextResponse } from 'next/server';
import { ComponentSchema } from '@/lib/componentValidators';
import { ZodError } from 'zod';
import mongoose from 'mongoose';

export async function validateComponent(data: any) {
  try {
    return await ComponentSchema.parseAsync(data);
  } catch (error) {
    if (error instanceof ZodError) {
      // Format error messages in a more user-friendly way
      const errorMessages = error.errors.map(err => {
        const field = err.path.join('.');
        return `${err.message}${field ? ` (${field})` : ''}`;
      });
      throw new Error(errorMessages.join('\n'));
    }
    throw error;
  }
}

export async function handleApiError(error: unknown) {
  console.error('API Error:', error);
  
  if (error instanceof mongoose.Error.ValidationError) {
    const errorMessages = Object.values(error.errors).map(err => err.message);
    return NextResponse.json(
      { 
        message: 'Validation Error',
        errors: errorMessages 
      },
      { status: 400 }
    );
  }
  
  if (error instanceof Error) {
    return NextResponse.json(
      { 
        message: 'Validation Error',
        errors: error.message.split('\n')
      },
      { status: 400 }
    );
  }
  
  return NextResponse.json(
    { message: 'Internal server error' },
    { status: 500 }
  );
}