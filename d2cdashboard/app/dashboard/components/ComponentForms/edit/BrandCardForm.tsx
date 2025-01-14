'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, X } from 'lucide-react';
import { Component, Brand } from '../../types';

interface BrandCardFormProps {
 component: Component;
 onUpdate: (component: Component) => void;
 isEditing?: boolean;
}

export function BrandCardForm({ component, onUpdate, isEditing }: BrandCardFormProps) {
 const addNewBrand = () => {
   onUpdate({
     ...component,
     brands: [
       ...(component.brands || []),
       { logoUrl: '', clickUrl: '', title: '', tag: '', buttonText: '' },
     ],
   });
 };

 const removeBrand = (index: number) => {
   onUpdate({
     ...component,
     brands: (component.brands || []).filter((_, i) => i !== index),
   });
 };

 const updateBrand = (index: number, field: keyof Brand, value: string) => {
   const updatedBrands = [...(component.brands || [])];
   updatedBrands[index] = { ...updatedBrands[index], [field]: value };
   onUpdate({ ...component, brands: updatedBrands });
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
     
     {component.brands?.map((brand, index) => (
       <Card key={index} className="p-4 border border-border bg-card">
         <div className="flex justify-between items-start mb-2">
           <h4 className="text-sm font-medium text-foreground">Brand {index + 1}</h4>
           {(component.brands?.length || 0) > 1 && (
             <Button
               variant="ghost"
               size="sm"
               onClick={() => removeBrand(index)}
               className="hover:bg-accent hover:text-accent-foreground"
             >
               <X className="h-4 w-4" />
             </Button>
           )}
         </div>
         <div className="space-y-3">
           <Input
             placeholder="Brand Title"
             value={brand.title}
             onChange={(e) => updateBrand(index, 'title', e.target.value)}
             className="bg-background border-input placeholder:text-muted-foreground"
           />
           <Input
             placeholder="Logo URL"
             value={brand.logoUrl}
             onChange={(e) => updateBrand(index, 'logoUrl', e.target.value)}
             className="bg-background border-input placeholder:text-muted-foreground"
           />
           <Input
             placeholder="Click URL"
             value={brand.clickUrl}
             onChange={(e) => updateBrand(index, 'clickUrl', e.target.value)}
             className="bg-background border-input placeholder:text-muted-foreground"
           />
           <Input
             placeholder="Tag (optional)"
             value={brand.tag}
             onChange={(e) => updateBrand(index, 'tag', e.target.value)}
             className="bg-background border-input placeholder:text-muted-foreground"
           />
           <Input
             placeholder="Button Text"
             value={brand.buttonText}
             onChange={(e) => updateBrand(index, 'buttonText', e.target.value)}
             className="bg-background border-input placeholder:text-muted-foreground"
           />
         </div>
       </Card>
     ))}
     <Button
       type="button"
       variant="outline"
       className="w-full border-input hover:bg-accent hover:text-accent-foreground"
       onClick={addNewBrand}
     >
       <PlusCircle className="h-4 w-4 mr-2" />
       Add Another Brand
     </Button>
   </div>
 );
}