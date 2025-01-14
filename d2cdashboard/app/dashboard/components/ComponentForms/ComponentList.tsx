// app/ComponentForms/ComponentList.tsx
'use client';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Component } from '../types';
import { Button } from '@/components/ui/button';
import { TrashIcon } from 'lucide-react';
import { EditComponentDialog } from './EditComponentDialog';

interface ComponentListProps {
  components: Component[];
  onDelete: (id: string) => void;
  onReorder: (result: any) => void;
  onEdit: () => void;
}

export function ComponentList({ components, onDelete, onReorder, onEdit }: ComponentListProps) {
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
                    className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-medium">{component.title}</h3>
                      <p className="text-sm text-gray-500">{component.type}</p>
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
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
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