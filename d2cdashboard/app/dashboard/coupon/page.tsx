"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, Copy, ExternalLink } from 'lucide-react';
import { Coupon, CouponFormData } from './coupon-form-modal';
import CouponFormModal from './coupon-form-modal';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from 'axios';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from 'next/image';

// Interfaces
interface LocalCoupon {
  _id: string;
  title: string;
  merchantName: string;
  merchantLogo: string;
  clickurl: string;
  couponCode: string;
  description: string;
  expirationDate: string;
  discount: string;
  category: string;
  backgroundColor: string;
  accentColor: string;
  terms: string[];
}

interface SortConfig {
  key: keyof Coupon | '';
  direction: 'asc' | 'desc' | '';
}

// Constants
const CATEGORIES = [
  "Food & Dining",
  "Shopping",
  "Travel",
  "Entertainment",
  "Electronics",
  "Fashion",
  "Health & Beauty",
  "Other"
] as const;

const ALL_CATEGORIES = "all" as const;
type CategoryType = typeof CATEGORIES[number];
type CategoryFilter = CategoryType | typeof ALL_CATEGORIES;

export default function EnhancedCouponsPage() {
  const [coupons, setCoupons] = useState<LocalCoupon[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>(ALL_CATEGORIES);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: '', direction: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState<string | null>(null);



  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/coupon');
      if (response.data.success) {
        setCoupons(response.data.coupons);
      } else {
        throw new Error(response.data.error || 'Failed to fetch coupons');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCoupon(null);
  };

  const handleEdit = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await axios.delete(`/api/coupon/${id}`);
      if (response.data.success) {
        await fetchCoupons();
        setDeleteDialogOpen(false);
        setCouponToDelete(null);
      } else {
        throw new Error(response.data.error || 'Failed to delete coupon');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete coupon');
      console.error(err);
    }
  };

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopySuccess(`Code ${code} copied!`);
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
      setError('Failed to copy code to clipboard');
    }
  };

  const handleSort = (key: keyof LocalCoupon) => {
    let direction: SortConfig['direction'] = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleVisitCoupon = (clickurl: string) => {
    if (clickurl) {
      window.open(clickurl, '_blank', 'noopener,noreferrer');
    } else {
      setError('No coupon link available');
    }
  };

  const handleModalSubmit = async (data: CouponFormData) => {
    try {
      if (data._id) {
        await axios.put(`/api/coupon/${data._id}`, data);
      } else {
        await axios.post('/api/coupon', data);
      }
      await fetchCoupons();
      handleModalClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save coupon');
      console.error(err);
    }
  };

  const filteredAndSortedCoupons = React.useMemo(() => {
    // Ensure `coupons` is always an array, even if undefined or null
    const couponsArray = Array.isArray(coupons) ? coupons : [];
  
    let filtered = [...couponsArray];
  
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((coupon) =>
        coupon.title.toLowerCase().includes(searchLower) ||
        coupon.merchantName.toLowerCase().includes(searchLower) ||
        coupon.couponCode.toLowerCase().includes(searchLower)
      );
    }
  
    // Apply category filter
    if (selectedCategory && selectedCategory !== ALL_CATEGORIES) {
      filtered = filtered.filter((coupon) => coupon.category === selectedCategory);
    }
  
    // Apply sorting
    if (sortConfig?.key && sortConfig?.direction) {
      filtered.sort((a, b) => {
        const aValue = sortConfig.key ? a[sortConfig.key] : ''; // Default to an empty string if the key is missing
        const bValue = sortConfig.key ? b[sortConfig.key] : '';
  
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
  
    return filtered;
  }, [coupons, searchTerm, selectedCategory, sortConfig]);
  

  const daysUntilExpiration = (expirationDate: string): number => {
    const today = new Date();
    const expDate = new Date(expirationDate);
    const diffTime = expDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <>
      <div className="p-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Coupon Management</CardTitle>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Coupon
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search coupons..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select
                value={selectedCategory}
                onValueChange={(value: CategoryFilter) => setSelectedCategory(value)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_CATEGORIES}>All Categories</SelectItem>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
  
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
  
            {copySuccess && (
              <Alert className="mb-4 bg-green-50">
                <AlertDescription>{copySuccess}</AlertDescription>
              </Alert>
            )}
  
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort('title')}
                    >
                      Title {sortConfig.key === 'title' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead>Merchant</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort('expirationDate')}
                    >
                      Expires In {sortConfig.key === 'expirationDate' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex justify-center items-center space-x-2">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                          <span>Loading...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredAndSortedCoupons.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        No coupons found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAndSortedCoupons.map((coupon) => (
                      <TableRow key={coupon._id} className="hover:bg-gray-900">
                        <TableCell>
                          <div className="font-medium">{coupon.title}</div>
                          <div className="text-sm text-gray-500">{coupon.description}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {coupon.merchantLogo && (
                              <Image
                                src={coupon.merchantLogo} 
                                alt={coupon.merchantName}
                                width={32}
                                height={32}
                                className="w-8 h-8 object-contain rounded"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = '/placeholder.png';
                                }}
                              />
                            )}
                            <span>
                              {coupon.clickurl ? (
                                <Link 
                                  href={coupon.clickurl} 
                                  passHref 
                                  legacyBehavior
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {coupon.merchantName}
                                </Link>
                              ) : (
                                <span>{coupon.merchantName}</span>
                              )}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <code className="bg-gray-800 px-2 py-1 rounded">
                              {coupon.couponCode}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopyCode(coupon.couponCode)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`${
                            daysUntilExpiration(coupon.expirationDate) < 7
                              ? 'text-red-600'
                              : daysUntilExpiration(coupon.expirationDate) < 30
                              ? 'text-yellow-600'
                              : 'text-green-600'
                          }`}>
                            {daysUntilExpiration(coupon.expirationDate)} days
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium text-green-600">
                            {coupon.discount}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {coupon.clickurl && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="hover:bg-blue-50"
                                onClick={() => handleVisitCoupon(coupon.clickurl)}
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="hover:bg-yellow-50"
                              onClick={() => handleEdit(coupon)}
                            >
                              <Pencil className="h-4 w-4 text-yellow-500" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="hover:bg-red-50"
                              onClick={() => {
                                setCouponToDelete(coupon._id);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
  
      <CouponFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        coupon={selectedCoupon}
      />
  
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Coupon</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this coupon? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setDeleteDialogOpen(false);
              setCouponToDelete(null);
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => couponToDelete && handleDelete(couponToDelete)}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}