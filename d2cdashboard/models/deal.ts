// app/models/Deal.ts
import mongoose, { Schema } from 'mongoose';

const dealSchema = new Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
  originalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  discountedPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  shopUrl: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true,
});

export interface Deal {
    _id: string;
    imageUrl: string;
    title: string;
    subtitle: string;
    originalPrice: number;
    discountedPrice: number;
    shopUrl: string;
    isActive: boolean;
    startDate: string;
    endDate: string;
  }
  
  export interface DealFormData {
    imageUrl: string;
    title: string;
    subtitle: string;
    originalPrice: number;
    discountedPrice: number;
    shopUrl: string;
    isActive: boolean;
    endDate: Date;
  }

// Create indexes for better query performance
dealSchema.index({ isActive: 1, startDate: 1, endDate: 1 });
dealSchema.index({ title: 'text', subtitle: 'text' });

export default mongoose.models.Deal || mongoose.model('Deal', dealSchema); 