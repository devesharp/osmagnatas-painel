import { cn } from "@/lib/utils";
import { IoWarning } from "react-icons/io5";
import { Button } from "../ui/button";

export function ErrorPage() {
  return (
    <div className={cn("w-full")}>
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="relative mb-2">
          <div className="relative bg-gradient-to-r">
            <IoWarning className="h-16 w-16 text-red-500" />
          </div>
        </div>

        <div className="text-center max-w-md">
          <h3 className="text-lg font-semibold mb-2">Ocorreu um erro</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Um erro inesperado ocorreu. Por favor, tente novamente mais tarde.
          </p>

          <Button onClick={() => window.location.reload()}>Recarregar</Button>
        </div>
      </div>
    </div>
  );
}
