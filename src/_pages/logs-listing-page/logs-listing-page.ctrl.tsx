"use client";

import { useRef, useState } from "react";
import { ColumnConfig } from "@/components/table-listing/table-listing.types";
import { useLogsListingPageColumns } from "./logs-listing-page.cols";
import {
  IResolve,
  IResponseResults,
  useViewList,
} from "@devesharp/react-hooks-v2";

import { LogsListingPageItem } from "./logs-listing-page.types";
import { logsApi } from "@/api/logs.request";
import { ILogsListingPageFilters } from "./components/logs-listing-page-filters/logs-listing-page-filters.types";

export function LogsListingPageCtrl() {
  const [openFilterModal, setOpenFilterModal] = useState(false);
  
  const viewList = useViewList<LogsListingPageItem, ILogsListingPageFilters>({
    resolveResources: logsApi.search as IResolve<
      IResponseResults<LogsListingPageItem>
    >,
    onAfterSearch: () => {
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);
    },
  });

  const containerRef = useRef<HTMLDivElement>(null);

  // Configuração das colunas (sem ações para logs)
  const columns: ColumnConfig<LogsListingPageItem>[] = useLogsListingPageColumns();

  // Não há ações em lote para logs
  const actions: any[] = [];

  return {
    containerRef,
    viewList,
    columns,
    actions,
    openFilterModal,
    setOpenFilterModal,
  };
} 