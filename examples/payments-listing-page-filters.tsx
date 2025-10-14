"use client";

import { FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { usePaymentsListingPageFiltersCtrl } from "./payments-listing-page-filters.ctrl";
import { PaymentsListingPageFiltersProps } from "./payments-listing-page-filters.types";
import { ViewFormProvider } from "@devesharp/react-hooks-v2";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Filter } from "lucide-react";

/**
 * Componente principal de filtros para Payments Listing Page
 */
export function PaymentsListingPageFilters(
  props: PaymentsListingPageFiltersProps
) {
  const ctrl = usePaymentsListingPageFiltersCtrl(props);

  return (
    <Sheet open={props.isVisibleMobile} onOpenChange={props.onRequestClose}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="md:hidden">
          <Filter className="h-4 w-4 mr-2" />
          Filtros
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[400px] sm:w-[540px] gap-0">
        <SheetHeader>
          <SheetTitle>
            <span className="text-lg font-medium">Filtros de Pagamentos</span>
          </SheetTitle>
        </SheetHeader>

        <div className="p-5 flex-1 overflow-y-auto">
          <ViewFormProvider {...ctrl.viewForm}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                ctrl.onSubmit();
              }}
              className="space-y-4"
            >
              <Input
                name="search"
                title="Buscar"
                placeholder="Digite para buscar..."
              />

              <Select
                name="status"
                title="Status"
                options={[
                  { value: "", label: "Todos" },
                  { value: "pending", label: "Pendente" },
                  { value: "paid", label: "Pago" },
                  { value: "cancelled", label: "Cancelado" },
                ]}
              />

              <Select
                name="type"
                title="Tipo"
                options={[
                  { value: "", label: "Todos" },
                  { value: "income", label: "Receita" },
                  { value: "expense", label: "Despesa" },
                ]}
              />

              <Input
                name="date_start"
                title="Data Inicial"
                type="date"
              />

              <Input
                name="date_end"
                title="Data Final"
                type="date"
              />
            </form>
          </ViewFormProvider>
        </div>

        <SheetFooter className="mt-6">
          <div className="flex gap-2 w-full flex-col">
            <SheetClose asChild>
              <Button
                type="button"
                variant="outline"
                onClick={ctrl.resetForm}
                className="flex-1"
              >
                Limpar
              </Button>
            </SheetClose>
            <Button
              type="submit"
              disabled={ctrl.isSubmitting}
              onClick={ctrl.onSubmit}
              className="flex-1"
            >
              {ctrl.isSubmitting ? "Aplicando..." : "Pesquisar"}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
