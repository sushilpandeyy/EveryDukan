import React from 'react';
import { Input } from '@/components/ui/input';
import { NewComponent } from '../types';

interface BannerCardFormProps {
  component: NewComponent;
  onUpdate: (updated: NewComponent) => void;
}

export function BannerCardForm({ component, onUpdate }: BannerCardFormProps) {
  return (
    <div className="space-y-4 bg-background p-4 rounded-md">
      <Input
        placeholder="Section Title"
        value={component.title}
        onChange={(e) => onUpdate({ ...component, title: e.target.value })}
        className="bg-background border-input placeholder:text-muted-foreground focus:ring-ring"
      />
      <Input
        placeholder="Image URL"
        value={component.imageUrl}
        onChange={(e) => onUpdate({ ...component, imageUrl: e.target.value })}
        className="bg-background border-input placeholder:text-muted-foreground focus:ring-ring"
      />
      <Input
        placeholder="Click URL"
        value={component.clickUrl}
        onChange={(e) => onUpdate({ ...component, clickUrl: e.target.value })}
        className="bg-background border-input placeholder:text-muted-foreground focus:ring-ring"
      />
      <Input
        placeholder="Button Text"
        value={component.buttonText}
        onChange={(e) => onUpdate({ ...component, buttonText: e.target.value })}
        className="bg-background border-input placeholder:text-muted-foreground focus:ring-ring"
      />
    </div>
  );
}