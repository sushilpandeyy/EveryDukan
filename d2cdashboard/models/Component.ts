import mongoose, { Schema, Document } from 'mongoose';

   

export interface Banner {
    imageUrl: string;
    clickUrl: string;
    title: string;
  }
  
  export interface Brand {
    logoUrl: string;
    clickUrl: string;
    title: string;
    tag?: string;
    buttonText: string;
  }
  
  export interface IComponent extends mongoose.Document {
    type: 'ReusableBanner' | 'BannerCard' | 'BrandCard';
    order: number;
    title: string;
    banners?: Banner[];
    imageUrl?: string;
    clickUrl?: string;
    buttonText?: string;
    brands?: Brand[];
    createdAt: Date;
    updatedAt: Date;
  }
  
  export type ComponentDocument = mongoose.HydratedDocument<IComponent>;
  
  const BannerSchema = new mongoose.Schema<Banner>({
    imageUrl: {
      type: String,
      required: true,
      validate: {
        validator: (v: string) => /^https?:\/\/.+/.test(v),
        message: 'Image URL must be a valid URL'
      }
    },
    clickUrl: {
      type: String,
      required: true,
      validate: {
        validator: (v: string) => /^https?:\/\/.+/.test(v),
        message: 'Click URL must be a valid URL'
      }
    },
    title: {
      type: String,
      required: true,
      trim: true
    }
  }, { _id: false });
  
  const BrandSchema = new mongoose.Schema<Brand>({
    logoUrl: {
      type: String,
      required: true,
      validate: {
        validator: (v: string) => /^https?:\/\/.+/.test(v),
        message: 'Logo URL must be a valid URL'
      }
    },
    clickUrl: {
      type: String,
      required: true,
      validate: {
        validator: (v: string) => /^https?:\/\/.+/.test(v),
        message: 'Click URL must be a valid URL'
      }
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    tag: {
      type: String,
      trim: true
    },
    buttonText: {
      type: String,
      required: true,
      trim: true
    }
  }, { _id: false });
  
  const ComponentSchema = new mongoose.Schema<IComponent>({
    type: {
      type: String,
      required: true,
      enum: ['ReusableBanner', 'BannerCard', 'BrandCard']
    },
    order: {
      type: Number,
      required: true,
      min: 0
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    banners: {
      type: [BannerSchema],
      validate: {
        validator: function(this: IComponent, v: Banner[]) {
          return this.type !== 'ReusableBanner' || (v && v.length > 0);
        },
        message: 'ReusableBanner must have at least one banner'
      }
    },
    imageUrl: {
      type: String,
      validate: {
        validator: function(this: IComponent, v: string) {
          return this.type !== 'BannerCard' || (v && /^https?:\/\/.+/.test(v));
        },
        message: 'BannerCard must have a valid image URL'
      }
    },
    clickUrl: {
      type: String,
      validate: {
        validator: function(this: IComponent, v: string) {
          return this.type !== 'BannerCard' || (v && /^https?:\/\/.+/.test(v));
        },
        message: 'BannerCard must have a valid click URL'
      }
    },
    buttonText: String,
    brands: {
      type: [BrandSchema],
      validate: {
        validator: function(this: IComponent, v: Brand[]) {
          return this.type !== 'BrandCard' || (v && v.length > 0);
        },
        message: 'BrandCard must have at least one brand'
      }
    }
  }, {
    timestamps: true,
    validateBeforeSave: true
  });
  
  const Component = mongoose.models.Component as mongoose.Model<IComponent> || 
    mongoose.model<IComponent>('Component', ComponentSchema);
  
  export default Component;