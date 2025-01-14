'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, X } from 'lucide-react';
import { Component } from '../../types';

interface BannerCardFormProps {
  component: Component;
  onUpdate: (component: Component) => void;
  isEditing?: boolean;
}

export function BannerCardForm({ component, onUpdate, isEditing }: BannerCardFormProps) {
  return (
    <div className="space-y-4 bg-background">
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Section Title"
            value={component.title}
            onChange={(e) => onUpdate({ ...component, title: e.target.value })}
            className="bg-background border-input"
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
            className="bg-background border-input"
          />
        </div>
      </div>

      <Card className="p-4 border border-border bg-card">
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-sm font-medium text-foreground">Banner Details</h4>
        </div>
        <div className="space-y-3">
          <Input
            placeholder="Image URL"
            value={component.imageUrl}
            onChange={(e) => onUpdate({ ...component, imageUrl: e.target.value })}
            className="bg-background border-input"
          />
          <Input
            placeholder="Click URL"
            value={component.clickUrl}
            onChange={(e) => onUpdate({ ...component, clickUrl: e.target.value })}
            className="bg-background border-input"
          />
          <Input
            placeholder="Button Text"
            value={component.buttonText}
            onChange={(e) => onUpdate({ ...component, buttonText: e.target.value })}
            className="bg-background border-input"
          />
        </div>
      </Card>
    </div>
  );
}