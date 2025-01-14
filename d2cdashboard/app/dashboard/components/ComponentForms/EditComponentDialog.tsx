// app/ComponentForms/EditComponentDialog.tsx
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PencilIcon } from 'lucide-react';
import { Component } from '../types';
import { ReusableBannerForm } from './edit/ReusableBannerForm';
import { BannerCardForm } from './edit/BannerCardForm';
import { BrandCardForm } from './edit/BrandCardForm';

interface EditComponentDialogProps {
  component: Component;
  onEdit: () => void;
}

export function EditComponentDialog({ component, onEdit }: EditComponentDialogProps) {
  const [open, setOpen] = useState(false);
  const [editingComponent, setEditingComponent] = useState<Component>(component);

  const handleEdit = async () => {
    try {
      const response = await fetch(`/api/components/${component._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingComponent),
      });

      if (!response.ok) throw new Error('Failed to update component');
      
      onEdit();
      setOpen(false);
    } catch (error) {
      console.error('Error updating component:', error);
    }
  };

  const renderForm = () => {
    switch (editingComponent.type) {
      case 'ReusableBanner':
        return (
          <ReusableBannerForm
            component={editingComponent}
            onUpdate={setEditingComponent}
            isEditing={true}
          />
        );
      case 'BannerCard':
        return (
          <BannerCardForm
            component={editingComponent}
            onUpdate={setEditingComponent}
            isEditing={true}
          />
        );
      case 'BrandCard':
        return (
          <BrandCardForm
            component={editingComponent}
            onUpdate={setEditingComponent}
            isEditing={true}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <PencilIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit {component.type}</DialogTitle>
        </DialogHeader>
        {renderForm()}
        <Button onClick={handleEdit} className="mt-4">
          Save Changes
        </Button>
      </DialogContent>
    </Dialog>
  );
}