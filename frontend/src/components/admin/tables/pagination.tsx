"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationProps {
  total: number;
  skip: number;
  take: number;
  page: number;
  per_page: number;
  onPageChange: (page: number) => void;
  dataName: string;
}

export function Pagination({ total, skip, take, page, per_page, onPageChange, dataName }: PaginationProps) {
  const totalPages = Math.ceil(total / per_page);
  const startItem = skip + 1;
  const endItem = Math.min(skip + take, total);

  const canGoPrevious = page > 1;
  const canGoNext = page < totalPages;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, page - delta); i <= Math.min(totalPages - 1, page + delta); i++) {
      range.push(i);
    }

    if (page - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (page + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-600">
        {dataName} {startItem} à {endItem} sur {total}
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" onClick={() => handlePageChange(1)} disabled={!canGoPrevious}>
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => handlePageChange(page - 1)} disabled={!canGoPrevious}>
          <ChevronLeft className="h-4 w-4" />
          Précédent
        </Button>

        <div className="flex items-center space-x-1">
          {getVisiblePages().map((pageNum, index) => (
            <Button
              key={index}
              variant={pageNum === page ? "default" : "outline"}
              size="sm"
              onClick={() => typeof pageNum === "number" && handlePageChange(pageNum)}
              disabled={pageNum === "..."}
              className="min-w-[40px]">
              {pageNum}
            </Button>
          ))}
        </div>

        <Button variant="outline" size="sm" onClick={() => handlePageChange(page + 1)} disabled={!canGoNext}>
          Suivant
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => handlePageChange(totalPages)} disabled={!canGoNext}>
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
