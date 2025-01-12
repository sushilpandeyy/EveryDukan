import { Component, NewComponent } from '../dashboard/components/types';

const API_BASE = '/api/components';

export async function fetchComponents(): Promise<Component[]> {
  const response = await fetch(API_BASE);
  if (!response.ok) {
    throw new Error('Failed to fetch components');
  }
  return response.json();
}

export async function createComponent(component: NewComponent): Promise<Component> {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(component),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create component');
  }
  return response.json();
}

export async function updateComponent(id: string, component: Partial<Component>): Promise<Component> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(component),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update component');
  }
  return response.json();
}

export async function deleteComponent(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete component');
  }
}

export async function reorderComponents(components: Array<{ _id: string; order: number }>): Promise<Component[]> {
  const response = await fetch(`${API_BASE}/reorder`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ components }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to reorder components');
  }
  return response.json();
}
