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
        <Button>Add Component</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Component</DialogTitle>
        </DialogHeader>
        <Select
          value={newComponent.type}
          onValueChange={(value: NewComponent['type']) =>
            setNewComponent({
              ...newComponent,
              type: value,
            })
          }
        >
          <SelectTrigger className="mb-4">
            <SelectValue placeholder="Select component type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ReusableBanner">Reusable Banner</SelectItem>
            <SelectItem value="BannerCard">Banner Card</SelectItem>
            <SelectItem value="BrandCard">Brand Card</SelectItem>
          </SelectContent>
        </Select>
        {renderForm()}
        <Button onClick={handleAddComponent} className="mt-4">
          Add Component
        </Button>
      </DialogContent>
    </Dialog>
  );
}
