import * as React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

function Pagination({
  limit,
  offset,
  total,
  onChangeOffset,
  onChangePage: onChangePageProps,
}: {
  limit: number;
  offset: number;
  total: number;
  onChangeOffset?: (offset: number) => void;
  onChangePage?: (page: number) => void;
}) {
  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(offset / limit) + 1;
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;
  let pagesFirst = [];
  let pagesLast: number[] = [];
  let pagesMiddle: number[] = [];

  if (totalPages > 5) {
    if (currentPage <= 3) {
      pagesFirst = Array.from({ length: 3 }, (_, i) => i + 1);
      pagesLast = Array.from({ length: 2 }, (_, i) => totalPages - i).reverse();
    } else if (currentPage >= totalPages - 3) {
      pagesFirst = Array.from({ length: 1 }, (_, i) => i + 1);
      pagesLast = Array.from({ length: 4 }, (_, i) => totalPages - i).reverse();
    } else {
      pagesFirst = Array.from({ length: 1 }, (_, i) => i + 1);
      pagesMiddle = Array.from({ length: 3 }, (_, i) => currentPage - 1 + i);
      pagesLast = Array.from({ length: 1 }, (_, i) => totalPages - i).reverse();
    }
  } else {
    pagesFirst = Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  function onChangePage(page: number) {
    onChangeOffset?.((page - 1) * limit);
    onChangePageProps?.(page - 1);
  }

  if (1 >= totalPages) {
    return null;
  }

  return (
    <PaginationBase className="pb-20">
      <PaginationContent>
        {hasPreviousPage && (
          <PaginationItem>
            <PaginationPrevious onClick={() => onChangePage(currentPage - 1)} />
          </PaginationItem>
        )}

        {pagesFirst.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              onClick={() => onChangePage(page)}
              isActive={page === currentPage}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        {pagesMiddle.length > 0 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {pagesMiddle.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              onClick={() => onChangePage(page)}
              isActive={page === currentPage}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        {pagesLast.length > 0 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {pagesLast.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              onClick={() => onChangePage(page)}
              isActive={page === currentPage}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        {hasNextPage && (
          <PaginationItem>
            <PaginationNext onClick={() => onChangePage(currentPage + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </PaginationBase>
  );
}

function PaginationBase({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  );
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a">;

function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        className
      )}
      {...props}
    />
  );
}

function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pl-2.5", className)}
      {...props}
    >
      <ChevronLeftIcon />
      <span className="hidden sm:block">Previous</span>
    </PaginationLink>
  );
}

function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pr-2.5", className)}
      {...props}
    >
      <span className="hidden sm:block">Next</span>
      <ChevronRightIcon />
    </PaginationLink>
  );
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
