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
  
  export interface Component {
    _id: string;
    type: 'ReusableBanner' | 'BannerCard' | 'BrandCard';
    order: number;
    title: string;
    banners?: Banner[];
    imageUrl?: string;
    clickUrl?: string;
    buttonText?: string;
    brands?: Brand[];
  }
  
  export interface NewComponent {
    type: Component['type'];
    title: string;
    banners: Banner[];
    imageUrl: string;
    clickUrl: string;
    buttonText: string;
    brands: Brand[];
  }
  