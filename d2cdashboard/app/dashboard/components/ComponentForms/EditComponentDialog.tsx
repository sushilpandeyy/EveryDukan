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
import { ComponentForm } from './ComponentForm';

interface EditComponentDialogProps {
  component: Component;
  onEdit: () => void;
}

export function EditComponentDialog({ component, onEdit }: EditComponentDialogProps) {
  const [open, setOpen] = useState(false);

  const handleEdit = async (formData: any) => {
    try {
      const response = await fetch(`/api/components/${component._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update component');
      
      onEdit();
      setOpen(false);
    } catch (error) {
      console.error('Error updating component:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <PencilIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Component</DialogTitle>
        </DialogHeader>
        <ComponentForm 
          onSubmit={handleEdit}
          initialData={component}
          submitLabel="Save Changes"
        />
      </DialogContent>
    </Dialog>
  );
}