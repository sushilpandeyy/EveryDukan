'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface FormData {
  title: string;
  type: string;
}

interface ComponentFormProps {
  onSubmit: (data: FormData) => void;
  initialData?: Partial<FormData>;
  submitLabel?: string;
}

const componentTypes = [
  'hero',
  'features',
  'testimonials',
  'pricing',
  'contact',
];

export function ComponentForm({ 
  onSubmit, 
  initialData = {}, 
  submitLabel = 'Add Component' 
}: ComponentFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<FormData>({
    defaultValues: {
      title: initialData.title || '',
      type: initialData.type || '',
    },
  });

  const handleSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      await onSubmit(data);
      form.reset();
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(handleSubmit)} 
        className="space-y-6 bg-background p-6 rounded-lg border border-border"
      >
        <FormField
          control={form.control}
          name="title"
          rules={{ required: 'Title is required' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">Title</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter component title" 
                  {...field} 
                  className="bg-background border-input placeholder:text-muted-foreground focus:ring-ring"
                />
              </FormControl>
              <FormMessage className="text-destructive" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          rules={{ required: 'Component type is required' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">Component Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="bg-background border-input focus:ring-ring">
                    <SelectValue 
                      placeholder="Select a component type" 
                      className="text-foreground placeholder:text-muted-foreground"
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-popover border-border">
                  {componentTypes.map((type) => (
                    <SelectItem 
                      key={type} 
                      value={type}
                      className="text-foreground hover:bg-accent hover:text-accent-foreground"
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-destructive" />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? (
            <span className="text-primary-foreground opacity-70">Loading...</span>
          ) : (
            submitLabel
          )}
        </Button>
      </form>
    </Form>
  );
}