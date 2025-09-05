// Colunas para a página Resume Page

import { ColumnConfig } from "@/components/table-listing/table-listing.types";
import { ResumePageItem } from "./resume-page.types";

export function useResumePageColumns(): ColumnConfig<ResumePageItem>[] {
  return [
    {
      key: "id",
      label: "ID",
      sortable: true,
      render: (item) => item.id,
    },
    // Adicionar mais colunas conforme necessário
  ];
} 