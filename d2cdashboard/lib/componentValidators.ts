import { z } from 'zod';

// Helper for URL validation that allows empty strings
const optionalUrl = z.string().url().or(z.string().max(0)).optional();
const requiredUrl = z.string().url();

export const BannerSchema = z.object({
  imageUrl: requiredUrl.describe('Banner Image URL'),
  clickUrl: requiredUrl.describe('Banner Click URL'),
  title: z.string().min(1).describe('Banner Title')
});

export const BrandSchema = z.object({
  logoUrl: requiredUrl.describe('Brand Logo URL'),
  clickUrl: requiredUrl.describe('Brand Click URL'),
  title: z.string().min(1).describe('Brand Title'),
  tag: z.string().optional(),
  buttonText: z.string().min(1).describe('Brand Button Text')
});

// Base component schema with common fields
const BaseComponentSchema = z.object({
  type: z.enum(['ReusableBanner', 'BannerCard', 'BrandCard']),
  title: z.string().min(1).describe('Section Title'),
});

// Type-specific schemas
const ReusableBannerSchema = BaseComponentSchema.extend({
  type: z.literal('ReusableBanner'),
  banners: z.array(BannerSchema).min(1).describe('Banners'),
  // Make other fields optional and empty for this type
  imageUrl: optionalUrl,
  clickUrl: optionalUrl,
  buttonText: z.string().optional(),
  brands: z.array(BrandSchema).optional(),
});

const BannerCardSchema = BaseComponentSchema.extend({
  type: z.literal('BannerCard'),
  imageUrl: requiredUrl.describe('Banner Image URL'),
  clickUrl: requiredUrl.describe('Banner Click URL'),
  buttonText: z.string().min(1).describe('Button Text'),
  // Make other fields optional and empty for this type
  banners: z.array(BannerSchema).optional(),
  brands: z.array(BrandSchema).optional(),
});

const BrandCardSchema = BaseComponentSchema.extend({
  type: z.literal('BrandCard'),
  brands: z.array(BrandSchema).min(1).describe('Brands'),
  // Make other fields optional and empty for this type
  imageUrl: optionalUrl,
  clickUrl: optionalUrl,
  buttonText: z.string().optional(),
  banners: z.array(BannerSchema).optional(),
});

export const ComponentSchema = z.discriminatedUnion('type', [
  ReusableBannerSchema,
  BannerCardSchema,
  BrandCardSchema
]);