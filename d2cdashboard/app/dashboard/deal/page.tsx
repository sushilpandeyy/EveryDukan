"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Loader2, 
  Plus, 
  Search, 
  Pencil, 
  Trash2, 
  CalendarIcon, 
  ChevronsUpDown 
} from "lucide-react";
import { cn } from "@/lib/utils";

// Form Schema
const dealFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  imageUrl: z.string().url("Invalid image URL"),
  originalPrice: z.number().min(0, "Price must be positive"),
  discountedPrice: z.number().min(0, "Price must be positive"),
  shopUrl: z.string().url("Invalid shop URL"),
  isActive: z.boolean(),
  endDate: z.date().min(new Date(), "End date must be in the future"),
});

type DealFormData = z.infer<typeof dealFormSchema>;

interface Deal extends Omit<DealFormData, 'endDate'> {
  _id: string;
  startDate: string;
  endDate: string;
}

export default function DealsPage() {
  // State
  const [deals, setDeals] = useState<Deal[]>([]);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const { toast } = useToast();

  // Form
  const form = useForm<DealFormData>({
    resolver: zodResolver(dealFormSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      imageUrl: "",
      originalPrice: 0,
      discountedPrice: 0,
      shopUrl: "",
      isActive: true,
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  // Fetch deals
  const fetchDeals = async () => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        search: searchQuery,
        sortBy,
        sortOrder,
      });

      const response = await fetch(`/api/deals?${queryParams}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      setDeals(data.deals);
      setTotalPages(data.pagination.totalPages);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch deals",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Search and sort effect
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      fetchDeals();
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [currentPage, searchQuery, sortBy, sortOrder]);

  // CRUD operations
  const handleCreate = async (data: DealFormData) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      toast({
        title: "Success",
        description: "Deal created successfully",
      });
      setIsAddDialogOpen(false);
      form.reset();
      fetchDeals();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create deal",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (data: DealFormData) => {
    if (!selectedDeal) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/deals?id=${selectedDeal._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      toast({
        title: "Success",
        description: "Deal updated successfully",
      });
      setIsEditDialogOpen(false);
      setSelectedDeal(null);
      form.reset();
      fetchDeals();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update deal",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedDeal) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/deals?id=${selectedDeal._id}`, {
        method: "DELETE",
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      toast({
        title: "Success",
        description: "Deal deleted successfully",
      });
      setIsDeleteDialogOpen(false);
      setSelectedDeal(null);
      fetchDeals();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete deal",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const DealForm = ({ onSubmit, submitText }: { onSubmit: (data: DealFormData) => void; submitText: string }) => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter deal title" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subtitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subtitle</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter deal subtitle" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="originalPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Original Price</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="number" 
                    step="0.01"
                    onChange={e => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="discountedPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discounted Price</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="number" 
                    step="0.01"
                    onChange={e => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter image URL" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="shopUrl"
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
          name="endDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={date => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(value === "true")}
                defaultValue={field.value.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            submitText
          )}
        </Button>
      </form>
    </Form>
  );

  // Render page
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Deals Management</CardTitle>
          <CardDescription>Manage your promotional deals and offers</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Filter Section */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search deals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Created Date</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="originalPrice">Original Price</SelectItem>
                  <SelectItem value="discountedPrice">Discounted Price</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Add Deal Button and Dialog */}
              <Dialog 
                open={isAddDialogOpen} 
                onOpenChange={(open) => {
                  if (!open) {
                    form.reset();
                  }
                  setIsAddDialogOpen(open);
                }}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Deal
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Create New Deal</DialogTitle>
                  </DialogHeader>
                  <DealForm onSubmit={handleCreate} submitText="Create Deal" />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Deals Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : deals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      No deals found
                    </TableCell>
                  </TableRow>
                ) : (
                  deals.map((deal) => (
                    <TableRow key={deal._id}>
                      <TableCell>
                        <div className="h-12 w-12 relative rounded overflow-hidden">
                          <img
                            src={deal.imageUrl}
                            alt={deal.title}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.png";
                            }}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{deal.title}</p>
                          <p className="text-sm text-muted-foreground">{deal.subtitle}</p>
                          <a 
                            href={deal.shopUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-500 hover:underline"
                          >
                            Visit Shop
                          </a>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm line-through text-muted-foreground">
                            ${deal.originalPrice.toFixed(2)}
                          </p>
                          <p className="font-medium text-green-600">
                            ${deal.discountedPrice.toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {Math.round(((deal.originalPrice - deal.discountedPrice) / deal.originalPrice) * 100)}% off
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={deal.isActive ? "default" : "secondary"}
                          className={cn(
                            "px-2 py-1",
                            deal.isActive ? "bg-green-500/10 text-green-500" : ""
                          )}
                        >
                          {deal.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(deal.endDate), "PPP")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              setSelectedDeal(deal);
                              form.reset({
                                title: deal.title,
                                subtitle: deal.subtitle,
                                imageUrl: deal.imageUrl,
                                originalPrice: deal.originalPrice,
                                discountedPrice: deal.discountedPrice,
                                shopUrl: deal.shopUrl,
                                isActive: deal.isActive,
                                endDate: new Date(deal.endDate),
                              });
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => {
                              setSelectedDeal(deal);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 flex justify-center gap-2">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1 || isLoading}
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => setCurrentPage(page)}
                    disabled={isLoading}
                    className="w-10"
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || isLoading}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog 
        open={isEditDialogOpen} 
        onOpenChange={(open) => {
          if (!open) {
            form.reset();
          }
          setIsEditDialogOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Deal</DialogTitle>
          </DialogHeader>
          <DealForm onSubmit={handleUpdate} submitText="Update Deal" />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the deal.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )};