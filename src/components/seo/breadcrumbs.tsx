"use client";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

import { StructuredDataScript } from "@/shared/lib/structured-data";

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  // Generate BreadcrumbList structured data
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href ? `https://www.workout.cool${item.href}` : undefined,
    })),
  };

  return (
    <>
      <StructuredDataScript data={breadcrumbStructuredData} />
      <nav aria-label="Breadcrumb" className="m-2 overflow-x-auto min-h-5 flex items-center">
        <ol className="flex items-center space-x-1 sm:space-x-2 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap min-w-max">
          {items.map((item, index) => (
            <li className="flex items-center" key={index}>
              {index > 0 && <ChevronRight aria-hidden="true" className="h-4 w-4 text-gray-400" />}
              {item.current ? (
                <span aria-current="page" className="font-medium text-gray-900 dark:text-white">
                  {item.label}
                </span>
              ) : item.href ? (
                <Link className="hover:text-gray-900 dark:hover:text-white transition-colors" href={item.href}>
                  {index === 0 ? (
                    <span className="flex items-center">
                      <Home aria-hidden="true" className="h-4 w-4 mr-1" />
                      {item.label}
                    </span>
                  ) : (
                    item.label
                  )}
                </Link>
              ) : (
                <span>{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
