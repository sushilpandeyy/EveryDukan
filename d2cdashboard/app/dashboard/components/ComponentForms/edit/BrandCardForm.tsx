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
    <div className="space-y-4">
      <Input
        placeholder="Section Title"
        value={component.title}
        onChange={(e) => onUpdate({ ...component, title: e.target.value })}
      />
      {component.brands?.map((brand, index) => (
        <Card key={index} className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-sm font-medium">Brand {index + 1}</h4>
            {(component.brands?.length || 0) > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeBrand(index)}
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
            />
            <Input
              placeholder="Logo URL"
              value={brand.logoUrl}
              onChange={(e) => updateBrand(index, 'logoUrl', e.target.value)}
            />
            <Input
              placeholder="Click URL"
              value={brand.clickUrl}
              onChange={(e) => updateBrand(index, 'clickUrl', e.target.value)}
            />
            <Input
              placeholder="Tag (optional)"
              value={brand.tag}
              onChange={(e) => updateBrand(index, 'tag', e.target.value)}
            />
            <Input
              placeholder="Button Text"
              value={brand.buttonText}
              onChange={(e) => updateBrand(index, 'buttonText', e.target.value)}
            />
          </div>
        </Card>
      ))}
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={addNewBrand}
      >
        <PlusCircle className="h-4 w-4 mr-2" />
        Add Another Brand
      </Button>
    </div>
  );
}