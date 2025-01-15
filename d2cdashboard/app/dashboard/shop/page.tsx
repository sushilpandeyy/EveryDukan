"use client";

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Check, ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface Category {
  _id: string;
  title: string;
  __v: number;
}

interface Shop {
  _id: string;
  title: string;
  logo: string;
  url: string;
  category: string[];
}

interface ShopFormData {
  title: string;
  logo: string;
  url: string;
  category: string[];
}

export default function ShopManagement() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<ShopFormData>({
    defaultValues: {
      title: "",
      logo: "",
      url: "",
      category: [],
    },
  });

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch("/api/category");
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch categories",
        variant: "destructive",
      });
    }
  }, [toast]);

  const fetchShops = useCallback(async () => {
    try {
      const response = await fetch("/api/shop");
      if (!response.ok) throw new Error("Failed to fetch shops");
      const data = await response.json();
      setShops(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch shops",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchShops();
    fetchCategories();
  }, [fetchCategories, fetchShops]);

  const handleCreate = async (data: ShopFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/shop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to create shop");

      toast({
        title: "Success",
        description: "Shop created successfully",
      });
      setIsAddDialogOpen(false);
      form.reset();
      fetchShops();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create shop",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (data: ShopFormData) => {
    if (!selectedShop) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/shop?id=${selectedShop._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update shop");

      toast({
        title: "Success",
        description: "Shop updated successfully",
      });
      setIsEditDialogOpen(false);
      setSelectedShop(null);
      form.reset();
      fetchShops();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update shop",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedShop) return;

    try {
      const response = await fetch(`/api/shop?id=${selectedShop._id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete shop");

      toast({
        title: "Success",
        description: "Shop deleted successfully",
      });
      setShops((prev) => prev.filter((shop) => shop._id !== selectedShop._id));
      setIsDeleteDialogOpen(false);
      setSelectedShop(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete shop",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (shop: Shop) => {
    setSelectedShop(shop);
    form.reset({
      title: shop.title,
      logo: shop.logo,
      url: shop.url,
      category: shop.category,
    });
    setIsEditDialogOpen(true);
  };

  const CategorySelect = ({ field }: any) => {
    const selectedCategories = Array.isArray(field.value) ? field.value : [];
    const [searchQuery, setSearchQuery] = useState("");

    const filteredCategories = categories.filter(category => 
      category.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCategoryToggle = (categoryTitle: string) => {
      const currentValue = Array.isArray(field.value) ? field.value : [];
      const newValue = currentValue.includes(categoryTitle)
        ? currentValue.filter((cat: string) => cat !== categoryTitle)
        : [...currentValue, categoryTitle];
      field.onChange(newValue);
    };

    return (
      <div className="space-y-2">
        <Input
          type="text"
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-2"
        />
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1 rounded-md border">
          {filteredCategories.map((category) => (
            <div
              key={category._id}
              className={cn(
                "flex items-center space-x-2 p-2 rounded-md cursor-pointer transition-colors",
                selectedCategories.includes(category.title)
                  ? "bg-primary/10 hover:bg-primary/20"
                  : "hover:bg-accent"
              )}
              onClick={() => handleCategoryToggle(category.title)}
            >
              <div
                className={cn(
                  "w-4 h-4 border rounded-sm flex items-center justify-center",
                  selectedCategories.includes(category.title)
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-input"
                )}
              >
                {selectedCategories.includes(category.title) && (
                  <Check className="h-3 w-3" />
                )}
              </div>
              <span className="text-sm">{category.title}</span>
            </div>
          ))}
        </div>

        {selectedCategories.length > 0 && (
          <div className="mt-2">
            <div className="text-sm text-muted-foreground mb-1">
              Selected ({selectedCategories.length}):
            </div>
            <div className="flex flex-wrap gap-1">
              {selectedCategories.map((cat: string) => (
                <Badge
                  key={cat}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {cat}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-3 w-3 p-0 hover:bg-transparent"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCategoryToggle(cat);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const ShopForm = ({
    onSubmit,
    submitText,
  }: {
    onSubmit: (data: ShopFormData) => void;
    submitText: string;
  }) => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter shop title" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="logo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo URL</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter logo URL" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shop URL</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter shop URL" />
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
              <FormLabel>Categories</FormLabel>
              <FormControl>
                <CategorySelect field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Processing..." : submitText}
        </Button>
      </form>
    </Form>
  );

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Shop Management</CardTitle>
          <CardDescription>Manage your shops and their details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex justify-end">
            <Dialog 
              open={isAddDialogOpen} 
              onOpenChange={(open) => {
                if (!open) {
                  form.reset({
                    title: "",
                    logo: "",
                    url: "",
                    category: [],
                  });
                }
                setIsAddDialogOpen(open);
              }}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add Shop
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Shop</DialogTitle>
                </DialogHeader>
                <ShopForm onSubmit={handleCreate} submitText="Create Shop" />
              </DialogContent>
            </Dialog>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Logo</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Categories</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shops.map((shop) => (
                  <TableRow key={shop._id}>
                    <TableCell className="font-medium">{shop.title}</TableCell>
                    <TableCell>
                      <Image
                        src={shop.logo || "/placeholder.png"}
                        alt={`${shop.title} logo`}
                        width={32}
                        height={32}
                        className="h-8 w-8 object-contain"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.png";
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <a
                        href={shop.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {shop.url}
                      </a>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {shop.category.map((cat) => (
                          <Badge key={cat} variant="secondary">
                            {cat}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => openEditDialog(shop)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => {
                            setSelectedShop(shop);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Shop</DialogTitle>
              </DialogHeader>
              <ShopForm onSubmit={handleUpdate} submitText="Update Shop" />
            </DialogContent>
          </Dialog>

          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  shop and remove it from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}