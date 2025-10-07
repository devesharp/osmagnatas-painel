"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { InadimplenciaListingPageItem } from "./inadimplencia-listing-page.types";

const MOEDA_SYMBOL = {
  USD: "$",
  BRL: "R$",
  EUR: "€",
} as const;

interface InadimplenciaPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inadimplencia: InadimplenciaListingPageItem | null;
  onConfirm: (amount: number, notes: string) => Promise<void>;
}

export function InadimplenciaPaymentModal({
  open,
  onOpenChange,
  inadimplencia,
  onConfirm,
}: InadimplenciaPaymentModalProps) {
  const [amount, setAmount] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Calcular saldo devedor
  const remainingAmount = inadimplencia
    ? inadimplencia.amount - inadimplencia.amount_payed
    : 0;

  // Resetar campos quando o modal abre
  useEffect(() => {
    if (open && inadimplencia) {
      setAmount(remainingAmount.toFixed(2));
      setNotes("");
      setError("");
    }
  }, [open, inadimplencia, remainingAmount]);

  const handleAmountChange = (value: string) => {
    // Permitir apenas números e ponto decimal
    const regex = /^\d*\.?\d{0,2}$/;
    if (regex.test(value) || value === "") {
      setAmount(value);
      setError("");

      // Validar se não excede o saldo devedor
      const numValue = parseFloat(value);
      if (numValue > remainingAmount) {
        setError(`O valor não pode ser maior que o saldo devedor: ${formatCurrency(remainingAmount)}`);
      } else if (numValue <= 0) {
        setError("O valor deve ser maior que zero");
      }
    }
  };

  const handleConfirm = async () => {
    const numAmount = parseFloat(amount);

    // Validações
    if (!amount || isNaN(numAmount)) {
      setError("Digite um valor válido");
      return;
    }

    if (numAmount <= 0) {
      setError("O valor deve ser maior que zero");
      return;
    }

    if (numAmount > remainingAmount) {
      setError(`O valor não pode ser maior que o saldo devedor: ${formatCurrency(remainingAmount)}`);
      return;
    }

    try {
      setLoading(true);
      setError("");
      await onConfirm(numAmount, notes);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao processar pagamento");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    const symbol = MOEDA_SYMBOL.USD;
    return `${symbol}${value.toFixed(2)}`;
  };

  const handleSetFullAmount = () => {
    setAmount(remainingAmount.toFixed(2));
    setError("");
  };

  if (!inadimplencia) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Registrar Pagamento</DialogTitle>
          <DialogDescription>
            Registre um pagamento para a inadimplência de{" "}
            <strong>{inadimplencia.customer?.name}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Informações da Inadimplência */}
          <div className="rounded-lg bg-muted p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Valor Total:</span>
              <span className="font-semibold">
                {formatCurrency(inadimplencia.amount)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Já Pago:</span>
              <span className="font-semibold text-green-600">
                {formatCurrency(inadimplencia.amount_payed)}
              </span>
            </div>
            <div className="flex justify-between text-sm border-t pt-2">
              <span className="text-muted-foreground font-medium">
                Saldo Devedor:
              </span>
              <span className="font-bold text-red-600">
                {formatCurrency(remainingAmount)}
              </span>
            </div>
          </div>

          {/* Campo de Valor */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="amount">Valor do Pagamento</Label>
              <Button
                type="button"
                variant="link"
                size="sm"
                onClick={handleSetFullAmount}
                className="h-auto p-0 text-xs"
              >
                Pagar valor total
              </Button>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="amount"
                type="text"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="0.00"
                className="pl-7"
                disabled={loading}
              />
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>

          {/* Campo de Observações */}
          <div className="space-y-2">
            <Label htmlFor="notes">Observações (opcional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Pagamento via PIX, transferência bancária..."
              rows={3}
              disabled={loading}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={loading || !!error || !amount}
          >
            {loading ? "Processando..." : "Confirmar Pagamento"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

