import mongoose, { Document, Model, Schema } from 'mongoose';

// Interfaces for different component types
interface IBrand {
  logoUrl: string;
  tag?: string;
  buttonText: string;
  actionUrl: string;
}

interface IBanner {
  imageUrl: string;
  buttonText: string;
  actionUrl: string;
}

interface ISingleBanner {
  imageUrl: string;
  actionUrl: string;
}

interface IHomeSection extends Document {
  title: string;
  type: 'BRAND_CARDS' | 'BANNER_CARDS' | 'SINGLE_BANNER';
  sortOrder: number;
  isActive: boolean;
  brands?: IBrand[];
  banners?: IBanner[];
  singleBanner?: ISingleBanner;
  createdAt: Date;
  updatedAt: Date;
}

// Schemas for nested components
const brandSchema = new Schema<IBrand>({
  logoUrl: { type: String, required: true },
  tag: { type: String },
  buttonText: { type: String, required: true },
  actionUrl: { type: String, required: true }
});

const bannerSchema = new Schema<IBanner>({
  imageUrl: { type: String, required: true },
  buttonText: { type: String, required: true },
  actionUrl: { type: String, required: true }
});

const singleBannerSchema = new Schema<ISingleBanner>({
  imageUrl: { type: String, required: true },
  actionUrl: { type: String, required: true }
});

// Main home section schema
const homeSectionSchema = new Schema<IHomeSection>(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ['BRAND_CARDS', 'BANNER_CARDS', 'SINGLE_BANNER'],
      required: true
    },
    sortOrder: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    brands: [brandSchema],
    banners: [bannerSchema],
    singleBanner: singleBannerSchema
  },
  { timestamps: true }
);

// Validation middleware
homeSectionSchema.pre('save', function(next) {
  const section = this;
  
  // Ensure correct data is present based on type
  switch (section.type) {
    case 'BRAND_CARDS':
      if (!section.brands || section.brands.length === 0) {
        throw new Error('Brands array is required for BRAND_CARDS type');
      }
      break;
    case 'BANNER_CARDS':
      if (!section.banners || section.banners.length === 0) {
        throw new Error('Banners array is required for BANNER_CARDS type');
      }
      break;
    case 'SINGLE_BANNER':
      if (!section.singleBanner) {
        throw new Error('Single banner data is required for SINGLE_BANNER type');
      }
      break;
  }
  
  next();
});

// Create model
const HomeSection: Model<IHomeSection> = mongoose.models.homesections || 
  mongoose.model('homesections', homeSectionSchema);

export default HomeSection;
export type { IHomeSection, IBrand, IBanner, ISingleBanner };
