import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Component } from '../types';

interface ComponentListProps {
  components: Component[];
  onDelete: (id: string) => void;
  onReorder: (result: any) => void;
}

export function ComponentList({ components, onDelete, onReorder }: ComponentListProps) {
  return (
    <DragDropContext onDragEnd={onReorder}>
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
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{component.type}</h3>
                            <p className="text-sm text-gray-500">
                              {component.type === 'BrandCard'
                                ? `${component.brands?.length} brand${
                                    component.brands?.length !== 1 ? 's' : ''
                                  }`
                                : component.title}
                            </p>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => onDelete(component._id)}
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
  );
}
