"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash } from "lucide-react";
import BannerFormModal from "@/components/banner-form-modal";
import ConfirmationModal from "@/components/confirmation-modal";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";

interface Banner {
  _id: string;
  title: string;
  bannerImage: string;
  isActive: boolean;
  linkForClick: string;
}

export default function BannerManagement() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<string | null>(null);

  // Fetch Banners
  const fetchBanners = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/banners");
      if (!response.ok) throw new Error("Failed to fetch banners");
      const data = await response.json();
      if (data.success) {
        setBanners(data.data);
      } else {
        throw new Error(data.error || "Failed to fetch banners");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch banners");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Handle Add/Edit
  const handleSaveBanner = async (banner: Omit<Banner, '_id'>) => {
    try {
      const endpoint = selectedBanner ? `/api/banners` : "/api/banners";
      const method = selectedBanner ? "PUT" : "POST";
      const body = selectedBanner 
        ? JSON.stringify({ ...banner, id: selectedBanner._id })
        : JSON.stringify(banner);

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body,
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to save banner");
      }

      fetchBanners();
      setIsModalOpen(false);
      setSelectedBanner(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save banner");
    }
  };

  // Handle Delete
  const handleDeleteBanner = async () => {
    if (!bannerToDelete) return;
    try {
      const response = await fetch(`/api/banners`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: bannerToDelete }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to delete banner");
      }

      fetchBanners();
      setIsConfirmationOpen(false);
      setBannerToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete banner");
    }
  };

  return (
    <div className="p-8 space-y-6 dark:bg-gray-900">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold dark:text-white">Banner Management</h1>
        <Button
          onClick={() => {
            setSelectedBanner(null);
            setIsModalOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Banner
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="text-center dark:text-gray-300">Loading...</div>
      ) : banners.length === 0 ? (
        <div className="text-center dark:text-gray-300">No banners found</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner) => (
            <div
              key={banner._id}
              className="rounded-lg shadow-lg overflow-hidden border dark:border-gray-700 bg-white dark:bg-gray-800 relative group"
            >
              <div className="w-full h-48 overflow-hidden">
                <Image
                  src={banner.bannerImage}
                  alt={banner.title}
                  className="w-auto h-full mx-auto object-contain"
                  width={400}
                  height={200}
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold dark:text-white">{banner.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {banner.isActive ? "Active" : "Inactive"}
                </p>
                <a
                  href={banner.linkForClick}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 dark:text-blue-400 text-sm underline hover:text-blue-600 dark:hover:text-blue-300"
                >
                  Visit Link
                </a>
              </div>
              <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-white dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600"
                  onClick={() => {
                    setSelectedBanner(banner);
                    setIsModalOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4 dark:text-gray-200" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => {
                    setBannerToDelete(banner._id);
                    setIsConfirmationOpen(true);
                  }}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <BannerFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveBanner}
        banner={selectedBanner}
      />
      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onConfirm={handleDeleteBanner}
        message="Are you sure you want to delete this banner?"
      />
    </div>
  );
}