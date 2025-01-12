import mongoose, { Schema, Document } from 'mongoose';

interface IComponent extends Document {
  type: string;
  order: number;
  title?: string;
  imageUrl?: string;
  buttonText?: string;
  tag?: string;
  logoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ComponentSchema = new Schema({
  type: {
    type: String,
    required: true,
    enum: ['ReusableBanner', 'BannerCard', 'BrandCard']
  },
  order: {
    type: Number,
    required: true
  },
  title: String,
  imageUrl: String,
  buttonText: String,
  tag: String,
  logoUrl: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.models.Component || mongoose.model<IComponent>('Component', ComponentSchema);