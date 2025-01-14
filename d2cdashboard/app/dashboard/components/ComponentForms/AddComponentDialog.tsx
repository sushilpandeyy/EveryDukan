import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ReusableBannerForm } from './ReusableBannerForm';
import { BannerCardForm } from './BannerCardForm';
import { BrandCardForm } from './BrandCardForm';
import { NewComponent } from '../types';

interface AddComponentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: () => void;
}

export function AddComponentDialog({
  open,
  onOpenChange,
  onAdd,
}: AddComponentDialogProps) {
  const [newComponent, setNewComponent] = useState<NewComponent>({
    type: 'ReusableBanner',
    title: '',
    banners: [{ imageUrl: '', clickUrl: '', title: '' }],
    imageUrl: '',
    clickUrl: '',
    buttonText: '',
    brands: [{ logoUrl: '', clickUrl: '', title: '', tag: '', buttonText: '' }],
  });

  const handleAddComponent = async () => {
    try {
      const response = await fetch('/api/components', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newComponent),
      });

      if (response.ok) {
        onAdd();
        onOpenChange(false);
        setNewComponent({
          type: 'ReusableBanner',
          title: '',
          banners: [{ imageUrl: '', clickUrl: '', title: '' }],
          imageUrl: '',
          clickUrl: '',
          buttonText: '',
          brands: [{ logoUrl: '', clickUrl: '', title: '', tag: '', buttonText: '' }],
        });
      }
    } catch (error) {
      console.error('Error adding component:', error);
    }
  };

  const renderForm = () => {
    switch (newComponent.type) {
      case 'ReusableBanner':
        return (
          <ReusableBannerForm
            component={newComponent}
            onUpdate={setNewComponent}
          />
        );
      case 'BannerCard':
        return (
          <BannerCardForm
            component={newComponent}
            onUpdate={setNewComponent}
          />
        );
      case 'BrandCard':
        return (
          <BrandCardForm
            component={newComponent}
            onUpdate={setNewComponent}
          />
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          Add Component
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-background border border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Add New Component</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Select
            value={newComponent.type}
            onValueChange={(value: NewComponent['type']) =>
              setNewComponent({
                ...newComponent,
                type: value,
              })
            }
          >
            <SelectTrigger className="bg-background border-input focus:ring-ring">
              <SelectValue 
                placeholder="Select component type" 
                className="text-foreground"
              />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="ReusableBanner" className="text-foreground hover:bg-accent">
                Reusable Banner
              </SelectItem>
              <SelectItem value="BannerCard" className="text-foreground hover:bg-accent">
                Banner Card
              </SelectItem>
              <SelectItem value="BrandCard" className="text-foreground hover:bg-accent">
                Brand Card
              </SelectItem>
            </SelectContent>
          </Select>

          <div className="bg-background rounded-md">
            {renderForm()}
          </div>

          <Button 
            onClick={handleAddComponent} 
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Add Component
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}