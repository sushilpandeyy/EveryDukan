"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
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
import CouponFormModal from './coupon-form-modal';

interface Coupon {
  id: string;
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
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCoupons = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/coupon');
      if (!response.ok) throw new Error('Failed to fetch coupons');
      const data = await response.json();
      setCoupons(data);
    } catch (err) {
      setError('Failed to fetch coupons');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (formData: Coupon) => {
    try {
      const response = await fetch('/api/coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to create coupon');
      await fetchCoupons();
      setIsModalOpen(false);
    } catch (err) {
      setError('Failed to create coupon');
      console.error(err);
    }
  };

  const handleUpdateCoupon = async (formData: Coupon) => {
    if (!selectedCoupon) return;
    try {
      const response = await fetch(`/api/coupon/${selectedCoupon.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to update coupon');
      await fetchCoupons();
      setIsModalOpen(false);
      setSelectedCoupon(null);
    } catch (err) {
      setError('Failed to update coupon');
      console.error(err);
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    try {
      const response = await fetch(`/api/coupon/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete coupon');
      await fetchCoupons();
    } catch (err) {
      setError('Failed to delete coupon');
      console.error(err);
    }
  };

  const filteredCoupons = coupons.filter((coupon) =>
    coupon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coupon.merchantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coupon.couponCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleModalSubmit = async (formData: Coupon) => {
    if (selectedCoupon) {
      await handleUpdateCoupon(formData);
    } else {
      await handleCreateCoupon(formData);
    }
  };

  return (
    <div className="p-8">
      <Card>
        <CardHeader className="flex justify-between">
          <CardTitle>Coupon Management</CardTitle>
          <Button
            onClick={() => {
              setSelectedCoupon(null);
              setIsModalOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Coupon
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search coupons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Merchant</TableHead>
                  <TableHead>Icon</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Expiration</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredCoupons.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No coupons found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCoupons.map((coupon) => (
                    <TableRow key={coupon.id}>
                      <TableCell>{coupon.title}</TableCell>
                      <TableCell><Image src={coupon.merchantLogo} alt={coupon.merchantName} width={50} height={50} /></TableCell> 
                      <TableCell>{coupon.couponCode}</TableCell>
                      <TableCell>{new Date(coupon.expirationDate).toLocaleDateString()}</TableCell>
                      <TableCell>{coupon.discount}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedCoupon(coupon);
                              setIsModalOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteCoupon(coupon.id)}
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
        </CardContent>
      </Card>
      <CouponFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        coupon={selectedCoupon}
      />
    </div>
  );
}
