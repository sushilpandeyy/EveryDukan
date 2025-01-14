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
    <div className="space-y-4">
      <Input
        placeholder="Section Title"
        value={component.title}
        onChange={(e) => onUpdate({ ...component, title: e.target.value })}
      />
      <Card className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-sm font-medium">Banner Details</h4>
        </div>
        <div className="space-y-3">
          <Input
            placeholder="Image URL"
            value={component.imageUrl}
            onChange={(e) => onUpdate({ ...component, imageUrl: e.target.value })}
          />
          <Input
            placeholder="Click URL"
            value={component.clickUrl}
            onChange={(e) => onUpdate({ ...component, clickUrl: e.target.value })}
          />
          <Input
            placeholder="Button Text"
            value={component.buttonText}
            onChange={(e) => onUpdate({ ...component, buttonText: e.target.value })}
          />
        </div>
      </Card>
    </div>
  );
}