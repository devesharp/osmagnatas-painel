"use client";

import { Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableListing } from "@/components/table-listing/table-listing";
import { Pagination } from "@/components/ui/pagination";
import { BulkFloat } from "@/components/bulk-float";
import { UsersListingPageCtrl } from "./users-listing-page.ctrl";
import { UsersListingPageFilters } from "./components/users-listing-page-filters/users-listing-page-filters";
import { useRouter } from "next/navigation";
import { ErrorPage } from "@/components/error-page";

export function UsersListingPage() {
  const router = useRouter();
  const ctrl = UsersListingPageCtrl();

  return (
    <div className="w-full p-5">
      {/* Header */}
      <div className="pb-3">
        <div className="mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold">Gerenciar Usuários</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Gerencie os usuários do sistema
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={() => router.push("/users/create")}>
                <Plus className="h-4 w-4" />
                Novo Usuário
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="">
        <UsersListingPageFilters
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
              getRowKey={(item) => item.CODIGO.toString()}
              items={ctrl.viewList.resources}
              columns={ctrl.columns}
              sortState={ctrl.viewList.filters.sort}
              onSortChange={ctrl.viewList.setSort}
              striped={true}
              loading={ctrl.viewList.isLoading || ctrl.viewList.isSearching}
              className="[&_table]:bg-transparent [&_th]:bg-gray-750 [&_t [&_th]:text-gray-400 [&_t"
              containerClassName="overflow-x-auto"
            />
          </div>
        )}

        <div className="pt-5">
          <Pagination
            limit={20}
            offset={ctrl.viewList.filters.offset}
            total={ctrl.viewList.resourcesTotal}
            onChangePage={ctrl.viewList.setPage}
          />
        </div>
      </div>

      {/* Ações em lote */}
      <BulkFloat
        itemsSelected={ctrl.selectedItems.length}
        onClearSelect={() => ctrl.setSelectedItems([])}
        actions={ctrl.actions}
      />
    </div>
  );
}
