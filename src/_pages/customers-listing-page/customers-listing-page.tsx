"use client";

import { Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableListing } from "@/components/table-listing/table-listing";
import { Pagination } from "@/components/ui/pagination";
import { CustomersListingPageCtrl } from "./customers-listing-page.ctrl";
import { CustomersListingPageFilters } from "./components/customers-listing-page-filters/customers-listing-page-filters";
import { ErrorPage } from "@/components/error-page";
import { useRouter } from "next/navigation";

export function CustomersListingPage() {
  const ctrl = CustomersListingPageCtrl();
  const router = useRouter();
  
  return (
    <div className="w-full p-5">
      {/* Header */}
      <div className="pb-3">
        <div className="mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold">Clientes</h1>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={() => router.push('/customers/create')}>
                <Plus className="h-4 w-4" />
                Novo
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="">
        <CustomersListingPageFilters
          filters={ctrl.viewList.filters}
          isVisibleMobile={ctrl.openFilterModal}
          onRequestClose={() => ctrl.setOpenFilterModal(false)}
          onFiltersApply={ctrl.viewList.setFilters}
        />

        <div className="fixed bottom-0 left-0 right-0 p-3 w-full z-10 md:hidden">
          <Button
            onClick={() => ctrl.setOpenFilterModal(true)}
            className="w-full"
            size="lg"
          >
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-muted-foreground text-sm font-medium">
            Mostrando {ctrl.viewList.filters.offset + 1}-
            {ctrl.viewList.filters.offset + ctrl.viewList.resources.length} de{" "}
            {ctrl.viewList.resourcesTotal} resultados
          </div>
        </div>

{ctrl.viewList.isErrorOnLoad && <ErrorPage />}

        {!ctrl.viewList.isErrorOnLoad && (
        <div ref={ctrl.containerRef}>
          <TableListing
            selecteds={ctrl.selectedItems}
            onSelected={ctrl.setSelectedItems}
            getRowKey={(item) => item.id}
            items={ctrl.viewList.resources}
            columns={ctrl.columns}
            sortState={ctrl.viewList.filters.sort}
            onSortChange={ctrl.viewList.setSort}
            striped={true}
            loading={ctrl.viewList.isLoading || ctrl.viewList.isSearching}
            className="[&_table]:bg-transparent [&_th]:bg-gray-750 [&_t [&_th]:text-gray-400 [&_t"
            containerClassName="overflow-x-auto"
          />
        </div>)}

        <div className="pt-5">
          <Pagination
            limit={20}
            offset={ctrl.viewList.filters.offset}
            total={ctrl.viewList.resourcesTotal}
            onChangePage={ctrl.viewList.setPage}
          />
        </div>
      </div>
    </div>
  );
} 