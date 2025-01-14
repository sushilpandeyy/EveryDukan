'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, X } from 'lucide-react';
import { Component, Banner } from '../../types';

interface ReusableBannerFormProps {
 component: Component;
 onUpdate: (component: Component) => void;
 isEditing?: boolean;
}

export function ReusableBannerForm({ component, onUpdate, isEditing }: ReusableBannerFormProps) {
 const addNewBanner = () => {
   onUpdate({
     ...component,
     banners: [...(component.banners || []), { imageUrl: '', clickUrl: '', title: '' }]
   });
 };

 const removeBanner = (index: number) => {
   onUpdate({
     ...component,
     banners: (component.banners || []).filter((_, i) => i !== index),
   });
 };

 const updateBanner = (index: number, field: keyof Banner, value: string) => {
   const updatedBanners = [...(component.banners || [])];
   updatedBanners[index] = { ...updatedBanners[index], [field]: value };
   onUpdate({ ...component, banners: updatedBanners });
 };

 return (
   <div className="space-y-4 bg-background">
     <div className="flex gap-4">
       <div className="flex-1">
         <Input
           placeholder="Section Title"
           value={component.title}
           onChange={(e) => onUpdate({ ...component, title: e.target.value })}
           className="bg-background border-input placeholder:text-muted-foreground"
         />
       </div>
       <div className="w-32">
         <Input
           type="number"
           placeholder="Order"
           min={0}
           value={component.order}
           onChange={(e) => onUpdate({ 
             ...component, 
             order: parseInt(e.target.value) || 0 
           })}
           className="bg-background border-input placeholder:text-muted-foreground"
         />
       </div>
     </div>
     
     {component.banners?.map((banner, index) => (
       <Card key={index} className="p-4 border border-border bg-card">
         <div className="flex justify-between items-start mb-2">
           <h4 className="text-sm font-medium text-foreground">Banner {index + 1}</h4>
           {(component.banners?.length || 0) > 1 && (
             <Button
               variant="ghost"
               size="sm"
               onClick={() => removeBanner(index)}
               className="hover:bg-accent hover:text-accent-foreground"
             >
               <X className="h-4 w-4" />
             </Button>
           )}
         </div>
         <div className="space-y-3">
           <Input
             placeholder="Banner Title"
             value={banner.title}
             onChange={(e) => updateBanner(index, 'title', e.target.value)}
             className="bg-background border-input placeholder:text-muted-foreground"
           />
           <Input
             placeholder="Image URL"
             value={banner.imageUrl}
             onChange={(e) => updateBanner(index, 'imageUrl', e.target.value)}
             className="bg-background border-input placeholder:text-muted-foreground"
           />
           <Input
             placeholder="Click URL"
             value={banner.clickUrl}
             onChange={(e) => updateBanner(index, 'clickUrl', e.target.value)}
             className="bg-background border-input placeholder:text-muted-foreground"
           />
         </div>
       </Card>
     ))}
     <Button
       type="button"
       variant="outline"
       className="w-full border-input hover:bg-accent hover:text-accent-foreground"
       onClick={addNewBanner}
     >
       <PlusCircle className="h-4 w-4 mr-2" />
       Add Another Banner
     </Button>
   </div>
 );
}