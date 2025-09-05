"use client";

import { TableListing } from "@/components/table-listing/table-listing";
import { Pagination } from "@/components/ui/pagination";
import { LogsListingPageCtrl } from "./logs-listing-page.ctrl";
import { ErrorPage } from "@/components/error-page";

export function LogsListingPage() {
  const ctrl = LogsListingPageCtrl();

  return (
    <div className="w-full p-5">
      {/* Header */}
      <div className="pb-3">
        <div className="mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold">Logs do Sistema</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Histórico de todas as ações realizadas no sistema
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="">

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
            getRowKey={(item) => item.id}
            items={ctrl.viewList.resources}
            columns={ctrl.columns}
            sortState={ctrl.viewList.filters.sort}
            onSortChange={ctrl.viewList.setSort}
            striped={true}
            loading={ctrl.viewList.isLoading || ctrl.viewList.isSearching}
            className="[&_table]:bg-transparent [&_th]:bg-gray-750 [&_th]:text-gray-400"
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