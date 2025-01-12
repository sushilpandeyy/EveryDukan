"use client";

import React, { useEffect } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { FormItem, FormLabel, FormControl } from "@/components/ui/form";

interface BannerFormData {
  title: string;
  bannerImage: string;
  isActive: boolean;
  linkForClick: string;
}

interface BannerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BannerFormData) => void;
  banner?: {
    _id?: string;  // Changed to _id to match MongoDB
    title: string;
    bannerImage: string;
    isActive: boolean;
    linkForClick: string;
  } | null;
}

export default function BannerFormModal({
  isOpen,
  onClose,
  onSubmit,
  banner,
}: BannerFormModalProps) {
  const formMethods = useForm<BannerFormData>({
    defaultValues: {
      title: banner?.title || "",
      bannerImage: banner?.bannerImage || "",
      isActive: banner?.isActive || false,
      linkForClick: banner?.linkForClick || "",
    },
  });

  const { handleSubmit, reset, control } = formMethods;

  useEffect(() => {
    if (isOpen) {
      reset({
        title: banner?.title || "",
        bannerImage: banner?.bannerImage || "",
        isActive: banner?.isActive || false,
        linkForClick: banner?.linkForClick || "",
      });
    }
  }, [isOpen, banner, reset]);

  const onFormSubmit = (data: BannerFormData) => {
    onSubmit({
      ...data,
      isActive: Boolean(data.isActive) // Ensure boolean type
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{banner ? "Edit Banner" : "Add New Banner"}</DialogTitle>
        </DialogHeader>
        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...formMethods.register("title", { required: true })} />
              </FormControl>
            </FormItem>
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input {...formMethods.register("bannerImage", { required: true })} />
              </FormControl>
            </FormItem>
            <FormItem>
              <FormLabel>Link for Click</FormLabel>
              <FormControl>
                <Input {...formMethods.register("linkForClick", { required: true })} />
              </FormControl>
            </FormItem>
            <FormItem>
              <FormLabel>Active</FormLabel>
              <FormControl>
                <Controller
                  name="isActive"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Switch
                      checked={value}
                      onCheckedChange={onChange}
                    />
                  )}
                />
              </FormControl>
            </FormItem>
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}