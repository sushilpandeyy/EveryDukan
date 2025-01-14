// page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { ComponentList } from './ComponentForms/ComponentList';
import { AddComponentDialog } from './ComponentForms/AddComponentDialog';
import { Component } from './types';

export default function ComponentsPage() {
  const [components, setComponents] = useState<Component[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    fetchComponents();
  }, []);

  const fetchComponents = async () => {
    try {
      const response = await fetch('/api/components');
      const data = await response.json();
      setComponents(data.sort((a: Component, b: Component) => a.order - b.order));
    } catch (error) {
      console.error('Error fetching components:', error);
    }
  };

  const handleDeleteComponent = async (id: string) => {
    try {
      await fetch(`/api/components/${id}`, { method: 'DELETE' });
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

    // Update order numbers
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    setComponents(updatedItems);

    try {
      await fetch('/api/components/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          components: updatedItems.map(item => ({
            _id: item._id,
            order: item.order,
          })),
        }),
      });
    } catch (error) {
      console.error('Error reordering components:', error);
      // Revert to original order if the API call fails
      await fetchComponents();
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Homepage Components</h1>
        <AddComponentDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAdd={fetchComponents}
        />
      </div>
      <ComponentList
        components={components}
        onDelete={handleDeleteComponent}
        onReorder={handleDragEnd}
      />
    </div>
  );
}