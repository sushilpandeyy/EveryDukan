"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, Copy, ExternalLink } from 'lucide-react';
import CouponFormModal from './coupon-form-modal';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

// Interfaces
interface Coupon {
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
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>(ALL_CATEGORIES);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: '', direction: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);


  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/coupon');
      if (!response.ok) throw new Error('Failed to fetch coupons');
      const data = await response.json();
      if (!data.success) throw new Error(data.error || 'Failed to fetch coupons');
      setCoupons(data.coupons);
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

  const handleSort = (key: keyof Coupon) => {
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

  const handleModalSubmit = async (data: Coupon) => { 
    setIsModalOpen(false);
  };

  const filteredAndSortedCoupons = React.useMemo(() => {
    let filtered = [...coupons];
    
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
    if (selectedCategory !== ALL_CATEGORIES) {
      filtered = filtered.filter((coupon) => 
        coupon.category === selectedCategory
      );
    }

    // Apply sorting
    if (sortConfig.key && sortConfig.direction) {
      filtered.sort((a, b) => {
        const aValue = sortConfig.key ? a[sortConfig.key] : '';
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

  return (<>
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
                    <TableRow key={coupon._id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="font-medium">{coupon.title}</div>
                        <div className="text-sm text-gray-500">{coupon.description}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {coupon.merchantLogo && (
                            <img 
                              src={coupon.merchantLogo} 
                              alt={coupon.merchantName}
                              className="w-8 h-8 object-contain rounded"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/placeholder.png';
                              }}
                            />
                          )}
                          <span>{coupon.merchantName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <code className="bg-gray-100 px-2 py-1 rounded">
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
                            className="hover:bg-red-50"
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
    </>
  );
}