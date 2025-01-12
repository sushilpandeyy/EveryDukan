import { useState, useCallback } from 'react';
import { Component, NewComponent } from '../app/dashboard/components/types';
import * as componentService from '../app/services/componentService';

export function useComponents() {
  const [components, setComponents] = useState<Component[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComponents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await componentService.fetchComponents();
      setComponents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const createComponent = useCallback(async (component: NewComponent) => {
    try {
      await componentService.createComponent(component);
      await fetchComponents();
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create component');
    }
  }, [fetchComponents]);

  const deleteComponent = useCallback(async (id: string) => {
    try {
      await componentService.deleteComponent(id);
      await fetchComponents();
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete component');
    }
  }, [fetchComponents]);

  const reorderComponents = useCallback(async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(components);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    setComponents(updatedItems);

    try {
      await componentService.reorderComponents(
        updatedItems.map(item => ({
          _id: item._id,
          order: item.order,
        }))
      );
    } catch (err) {
      await fetchComponents(); // Revert to server state on error
      throw err instanceof Error ? err : new Error('Failed to reorder components');
    }
  }, [components, fetchComponents]);

  return {
    components,
    loading,
    error,
    fetchComponents,
    createComponent,
    deleteComponent,
    reorderComponents,
  };
}