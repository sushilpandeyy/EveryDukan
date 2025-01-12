// app/components/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Component {
  _id: string;
  type: 'ReusableBanner' | 'BannerCard' | 'BrandCard';
  order: number;
  title?: string;
  imageUrl?: string;
  buttonText?: string;
  tag?: string;
  logoUrl?: string;
}

export default function ComponentsPage() {
  const [components, setComponents] = useState<Component[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newComponent, setNewComponent] = useState({
    type: 'ReusableBanner',
    title: '',
    imageUrl: '',
    buttonText: '',
    tag: '',
    logoUrl: '',
  });

  useEffect(() => {
    fetchComponents();
  }, []);

  const fetchComponents = async () => {
    try {
      const response = await fetch('/api/components');
      const data = await response.json();
      setComponents(data);
    } catch (error) {
      console.error('Error fetching components:', error);
    }
  };

  const handleAddComponent = async () => {
    try {
      const response = await fetch('/api/components', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newComponent),
      });

      if (response.ok) {
        await fetchComponents();
        setIsAddDialogOpen(false);
        setNewComponent({
          type: 'ReusableBanner',
          title: '',
          imageUrl: '',
          buttonText: '',
          tag: '',
          logoUrl: '',
        });
      }
    } catch (error) {
      console.error('Error adding component:', error);
    }
  };

  const handleDeleteComponent = async (id: string) => {
    try {
      await fetch(`/api/components/${id}`, {
        method: 'DELETE',
      });
      await fetchComponents();
    } catch (error) {
      console.error('Error deleting component:', error);
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(components);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order property for all items
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    setComponents(updatedItems);

    // Save new order to backend
    try {
      await fetch('/api/components/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          components: updatedItems.map((item) => ({
            _id: item._id,
            order: item.order,
          })),
        }),
      });
    } catch (error) {
      console.error('Error reordering components:', error);
    }
  };

  const renderComponentFields = () => {
    switch (newComponent.type) {
      case 'ReusableBanner':
        return (
          <>
            <Input
              placeholder="Image URL"
              value={newComponent.imageUrl}
              onChange={(e) =>
                setNewComponent({ ...newComponent, imageUrl: e.target.value })
              }
              className="mb-4"
            />
            <Input
              placeholder="Title"
              value={newComponent.title}
              onChange={(e) =>
                setNewComponent({ ...newComponent, title: e.target.value })
              }
              className="mb-4"
            />
          </>
        );
      case 'BannerCard':
        return (
          <>
            <Input
              placeholder="Image URL"
              value={newComponent.imageUrl}
              onChange={(e) =>
                setNewComponent({ ...newComponent, imageUrl: e.target.value })
              }
              className="mb-4"
            />
            <Input
              placeholder="Button Text"
              value={newComponent.buttonText}
              onChange={(e) =>
                setNewComponent({ ...newComponent, buttonText: e.target.value })
              }
              className="mb-4"
            />
          </>
        );
      case 'BrandCard':
        return (
          <>
            <Input
              placeholder="Logo URL"
              value={newComponent.logoUrl}
              onChange={(e) =>
                setNewComponent({ ...newComponent, logoUrl: e.target.value })
              }
              className="mb-4"
            />
            <Input
              placeholder="Tag"
              value={newComponent.tag}
              onChange={(e) =>
                setNewComponent({ ...newComponent, tag: e.target.value })
              }
              className="mb-4"
            />
            <Input
              placeholder="Button Text"
              value={newComponent.buttonText}
              onChange={(e) =>
                setNewComponent({ ...newComponent, buttonText: e.target.value })
              }
              className="mb-4"
            />
          </>
        );
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Homepage Components</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Component</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Component</DialogTitle>
            </DialogHeader>
            <Select
              value={newComponent.type}
              onValueChange={(value: any) =>
                setNewComponent({ ...newComponent, type: value })
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
            {renderComponentFields()}
            <Button onClick={handleAddComponent}>Add Component</Button>
          </DialogContent>
        </Dialog>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="components">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {components.map((component, index) => (
                <Draggable
                  key={component._id}
                  draggableId={component._id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="mb-4"
                    >
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-semibold">{component.type}</h3>
                              <p className="text-sm text-gray-500">
                                {component.title || component.buttonText}
                              </p>
                            </div>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteComponent(component._id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}