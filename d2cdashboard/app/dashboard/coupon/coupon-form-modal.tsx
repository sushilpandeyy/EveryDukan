"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'; // Fixed import path
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast'; // Fixed import path
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const CATEGORIES = [
  "Food & Dining",
  "Shopping",
  "Travel",
  "Entertainment",
  "Electronics",
  "Fashion",
  "Health & Beauty",
  "Other"
] as const;

export type Category = typeof CATEGORIES[number];


const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  merchantName: z.string().min(1, "Merchant name is required"),
  merchantLogo: z.string().url("Must be a valid URL"),
  clickurl: z.string().url("Must be a valid URL"),
  couponCode: z.string().min(1, "Coupon code is required"),
  description: z.string().min(1, "Description is required"),
  expirationDate: z.string().min(1, "Expiration date is required"),
  discount: z.string().min(1, "Discount is required"),
  category: z.enum(CATEGORIES),
  backgroundColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Must be a valid hex color"),
  accentColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Must be a valid hex color"),
  terms: z.string().min(1, "Terms are required"),
});

type FormSchema = z.infer<typeof formSchema>;

// Define the CouponData type with terms as string array
export interface Coupon extends Omit<FormSchema, 'terms' | 'category'> {
  _id: string;
  terms: string[];
  category: string;
}
export interface CouponFormData extends Omit<FormSchema, 'terms'> {
  _id?: string;
  terms: string[];
}


interface CouponFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CouponFormData) => Promise<void>;
  coupon?: Coupon | null;
}

export default function CouponFormModal({
  isOpen,
  onClose,
  onSubmit,
  coupon,
}: CouponFormModalProps) {
  const { toast } = useToast();

  const getValidCategory = (category: string | undefined): Category => {
    return CATEGORIES.includes(category as Category) 
      ? (category as Category) 
      : CATEGORIES[0];
  };
  
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: coupon?.title || "",
      merchantName: coupon?.merchantName || "",
      merchantLogo: coupon?.merchantLogo || "",
      clickurl: coupon?.clickurl || "",
      couponCode: coupon?.couponCode || "",
      description: coupon?.description || "",
      expirationDate: coupon?.expirationDate || "",
      discount: coupon?.discount || "",
      category: getValidCategory(coupon?.category),
      backgroundColor: coupon?.backgroundColor || "#ffffff",
      accentColor: coupon?.accentColor || "#ffffff",
      terms: coupon?.terms?.join("\n") || "",
    },
  });

  React.useEffect(() => {
    if (isOpen && coupon) {
      form.reset({
        title: coupon.title,
        merchantName: coupon.merchantName,
        merchantLogo: coupon.merchantLogo,
        clickurl: coupon.clickurl,
        couponCode: coupon.couponCode,
        description: coupon.description,
        expirationDate: coupon.expirationDate,
        discount: coupon.discount,
        category: getValidCategory(coupon.category),
        backgroundColor: coupon.backgroundColor,
        accentColor: coupon.accentColor,
        terms: coupon.terms.join("\n"),
      });
    }
  }, [isOpen, coupon, form]);

  const handleFormSubmit = async (formData: FormSchema) => {
    try {
      const submissionData: CouponFormData = {
        ...formData,
        _id: coupon?._id,
        terms: formData.terms.split("\n").filter(Boolean),
      };
      
      await onSubmit(submissionData);
      onClose();
      
      toast({
        title: "Success",
        description: `Coupon ${coupon ? "updated" : "created"} successfully`,
      });
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit coupon",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{coupon ? "Edit Coupon" : "Add New Coupon"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="merchantName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Merchant Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="merchantLogo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Merchant Logo URL</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="clickurl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Click URL</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="couponCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Coupon Code</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="discount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CATEGORIES.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expirationDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiration Date</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="backgroundColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Background Color</FormLabel>
                    <FormControl>
                      <Input {...field} type="color" className="h-10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accentColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Accent Color</FormLabel>
                    <FormControl>
                      <Input {...field} type="color" className="h-10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="h-20" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Terms & Conditions</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter terms, one per line"
                      className="h-20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {coupon ? "Update" : "Create"} Coupon
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}