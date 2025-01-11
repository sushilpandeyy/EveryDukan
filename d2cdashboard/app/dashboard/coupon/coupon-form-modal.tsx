"use client";

import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { X } from 'lucide-react';
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

interface CouponFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  coupon?: {
    id?: string;
    title: string;
    merchantName: string;
    merchantLogo: string;
    couponCode: string;
    description: string;
    expirationDate: string;
    discount: string;
    category: string;
    backgroundColor: string;
    accentColor: string;
    terms: string[];
  } | null;
}

const CATEGORIES = [
  "Food & Dining",
  "Shopping",
  "Travel",
  "Entertainment",
  "Electronics",
  "Fashion",
  "Health & Beauty",
  "Other"
];

export default function CouponFormModal({
  isOpen,
  onClose,
  onSubmit,
  coupon,
}: CouponFormModalProps) {
  const formMethods = useForm({
    defaultValues: {
      title: coupon?.title || "",
      merchantName: coupon?.merchantName || "",
      merchantLogo: coupon?.merchantLogo || "",
      couponCode: coupon?.couponCode || "",
      description: coupon?.description || "",
      expirationDate: coupon?.expirationDate || "",
      discount: coupon?.discount || "",
      category: coupon?.category || CATEGORIES[0],
      backgroundColor: coupon?.backgroundColor || "#ffffff",
      accentColor: coupon?.accentColor || "#ffffff",
      terms: coupon?.terms?.join("\n") || "",
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = formMethods;

  useEffect(() => {
    if (isOpen) {
      reset({
        title: coupon?.title || "",
        merchantName: coupon?.merchantName || "",
        merchantLogo: coupon?.merchantLogo || "",
        couponCode: coupon?.couponCode || "",
        description: coupon?.description || "",
        expirationDate: coupon?.expirationDate || "",
        discount: coupon?.discount || "",
        category: coupon?.category || CATEGORIES[0],
        backgroundColor: coupon?.backgroundColor || "#ffffff",
        accentColor: coupon?.accentColor || "#ffffff",
        terms: coupon?.terms?.join("\n") || "",
      });
    }
  }, [isOpen, coupon, reset]);

  const handleFormSubmit = (data: any) => {
    const terms = data.terms.split("\n").filter(Boolean);
    onSubmit({ ...data, terms });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{coupon ? "Edit Coupon" : "Add New Coupon"}</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...formMethods.register("title", { required: true })} />
                </FormControl>
                <FormMessage>{errors.title && "Title is required"}</FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel>Merchant Name</FormLabel>
                <FormControl>
                  <Input {...formMethods.register("merchantName", { required: true })} />
                </FormControl>
                <FormMessage>{errors.merchantName && "Merchant name is required"}</FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel>Merchant Logo URL</FormLabel>
                <FormControl>
                  <Input {...formMethods.register("merchantLogo", { required: true })} />
                </FormControl>
                <FormMessage>{errors.merchantLogo && "Merchant logo is required"}</FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel>Coupon Code</FormLabel>
                <FormControl>
                  <Input {...formMethods.register("couponCode", { required: true })} />
                </FormControl>
                <FormMessage>{errors.couponCode && "Coupon code is required"}</FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel>Discount</FormLabel>
                <FormControl>
                  <Input {...formMethods.register("discount", { required: true })} />
                </FormControl>
                <FormMessage>{errors.discount && "Discount is required"}</FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select {...formMethods.register("category")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>

              <FormItem>
                <FormLabel>Background Color</FormLabel>
                <FormControl>
                  <Input
                    {...formMethods.register("backgroundColor", { required: true })}
                    type="color"
                  />
                </FormControl>
              </FormItem>

              <FormItem>
                <FormLabel>Accent Color</FormLabel>
                <FormControl>
                  <Input
                    {...formMethods.register("accentColor", { required: true })}
                    type="color"
                  />
                </FormControl>
              </FormItem>

              <FormItem className="col-span-2">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...formMethods.register("description", { required: true })}
                  />
                </FormControl>
                <FormMessage>{errors.description && "Description is required"}</FormMessage>
              </FormItem>

              <FormItem className="col-span-2">
                <FormLabel>Terms & Conditions</FormLabel>
                <FormControl>
                  <Textarea
                    {...formMethods.register("terms", { required: true })}
                    placeholder="Enter terms, one per line"
                  />
                </FormControl>
                <FormMessage>{errors.terms && "Terms are required"}</FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel>Expiration Date</FormLabel>
                <FormControl>
                  <Input
                    {...formMethods.register("expirationDate", { required: true })}
                    type="date"
                  />
                </FormControl>
                <FormMessage>
                  {errors.expirationDate && "Expiration date is required"}
                </FormMessage>
              </FormItem>
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">{coupon ? "Update" : "Create"} Coupon</Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
