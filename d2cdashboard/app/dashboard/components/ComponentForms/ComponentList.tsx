'use client';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Component } from '../types';
import { Button } from '@/components/ui/button';
import { TrashIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { EditComponentDialog } from './EditComponentDialog';
import { useState } from 'react';

interface ComponentListProps {
  components: Component[];
  onDelete: (id: string) => void;
  onReorder: (result: any) => void;
  onEdit: () => void;
}

export function ComponentList({ components, onDelete, onReorder, onEdit }: ComponentListProps) {
  const [slideIndices, setSlideIndices] = useState<{ [key: string]: number }>({});

  const handlePrevious = (componentId: string, maxLength: number) => {
    setSlideIndices(prev => ({
      ...prev,
      [componentId]: ((prev[componentId] || 0) - 2 + maxLength) % maxLength
    }));
  };

  const handleNext = (componentId: string, maxLength: number) => {
    setSlideIndices(prev => ({
      ...prev,
      [componentId]: ((prev[componentId] || 0) + 2) % maxLength
    }));
  };

  const renderPreview = (component: Component) => {
    const currentIndex = slideIndices[component._id] || 0;

    switch (component.type) {
      case 'ReusableBanner':
        const banners = component.banners || [];
        return (
          <div className="relative mt-2">
            <div className="grid grid-cols-2 gap-2">
              {banners.slice(currentIndex, currentIndex + 2).map((banner, index) => (
                <div key={index} className="relative h-32 rounded-md overflow-hidden border border-border">
                  <img
                    src={banner.imageUrl}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm p-1">
                    <p className="text-foreground text-xs truncate">{banner.title}</p>
                  </div>
                </div>
              ))}
            </div>
            {banners.length > 2 && (
              <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between pointer-events-none">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm shadow-md pointer-events-auto hover:bg-accent"
                  onClick={() => handlePrevious(component._id, banners.length)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm shadow-md pointer-events-auto hover:bg-accent"
                  onClick={() => handleNext(component._id, banners.length)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        );
      
      case 'BrandCard':
        const brands = component.brands || [];
        return (
          <div className="relative mt-2">
            <div className="grid grid-cols-4 gap-2">
              {brands.slice(currentIndex, currentIndex + 4).map((brand, index) => (
                <div key={index} className="relative h-20 rounded-md overflow-hidden bg-accent/10 border border-border p-2">
                  <img
                    src={brand.logoUrl}
                    alt={brand.title}
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm p-1">
                    <p className="text-foreground text-xs truncate">{brand.tag}</p>
                  </div>
                </div>
              ))}
            </div>
            {brands.length > 4 && (
              <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between pointer-events-none">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm shadow-md pointer-events-auto hover:bg-accent"
                  onClick={() => handlePrevious(component._id, brands.length)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm shadow-md pointer-events-auto hover:bg-accent"
                  onClick={() => handleNext(component._id, brands.length)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        );
      
      case 'BannerCard':
        return (
          <div className="mt-2 relative h-40 rounded-md overflow-hidden border border-border">
            <img
              src={component.imageUrl}
              alt={component.title}
              className="w-full h-full object-cover"
            />
            {component.buttonText && (
              <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm p-1">
                <p className="text-foreground text-xs truncate">{component.buttonText}</p>
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <DragDropContext onDragEnd={onReorder}>
      <Droppable droppableId="components">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-4"
          >
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
                    className="bg-card p-4 rounded-lg shadow-md border border-border max-w-3xl mx-auto"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-foreground">{component.title}</h3>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-muted-foreground">{component.type}</p>
                          <p className="text-sm text-muted-foreground">• Order: {component.order}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <EditComponentDialog 
                          component={component}
                          onEdit={onEdit}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(component._id)}
                          className="hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {renderPreview(component)}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}