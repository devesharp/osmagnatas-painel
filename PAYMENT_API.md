# API de Pagamentos de Inadimplências

Este documento descreve como usar a API de pagamentos para registrar pagamentos em inadimplências.

## Mudanças no Schema

### Transaction
- Adicionado campo `inadimplencia_id` (opcional) para associar uma transação a uma inadimplência
- Relação com `Inadimplencia` através do campo `inadimplencia_id`

### Inadimplencia
- Adicionado campo `amount_payed` para rastrear o valor total pago
- O campo é atualizado automaticamente quando um pagamento é registrado
- Quando `amount_payed >= amount`, o campo `payed` é automaticamente marcado como `true`

## Endpoints

### 1. Criar Transação com Inadimplência

**POST** `/api/transactions`

Você pode criar uma transação e associá-la a uma inadimplência:

```json
{
  "customer_id": 1,
  "inadimplencia_id": 5,
  "amount": 100.00,
  "status": "PAYED",
  "payment_type": "IN",
  "notes": "Pagamento parcial",
  "moeda": "USD"
}
```

**Validações:**
- A inadimplência deve existir
- A inadimplência deve pertencer ao mesmo customer da transação
- Todos os campos obrigatórios de transação devem ser fornecidos

### 2. Registrar Pagamento de Inadimplência

**POST** `/api/inadimplencia/{id}/payment`

Esta é a rota principal para processar pagamentos de inadimplências. Ela:
1. Cria uma transação automaticamente marcada como `PAYED`
2. Atualiza o campo `amount_payed` da inadimplência
3. Marca a inadimplência como `payed=true` se o valor total for atingido

**Parâmetros:**
- `id` (path): ID da inadimplência

**Body:**
```json
{
  "amount": 50.00,
  "moeda": "USD",
  "notes": "Pagamento via PIX"
}
```

**Campos:**
- `amount` (obrigatório): Valor do pagamento (deve ser > 0)
- `moeda` (opcional): Moeda do pagamento (padrão: "USD")
- `notes` (opcional): Observações sobre o pagamento

**Resposta de Sucesso (201):**
```json
{
  "success": true,
  "data": {
    "transaction": {
      "id": 123,
      "customer_id": 1,
      "inadimplencia_id": 5,
      "status": "PAYED",
      "payment_type": "IN",
      "amount": 50.00,
      "moeda": "USD",
      "payed_at": "2025-10-07T17:45:00.000Z",
      // ... outros campos
    },
    "inadimplencia": {
      "id": 5,
      "customer_id": 1,
      "amount": 200.00,
      "amount_payed": 150.00,
      "payed": false,
      // ... outros campos
    },
    "message": "Pagamento de 50 registrado com sucesso"
  }
}
```

**Validações:**
- O valor do pagamento não pode ser maior que o saldo devedor
- O saldo devedor é calculado como: `amount - amount_payed`
- Se o valor total for atingido, `payed` é automaticamente marcado como `true`

**Erros Comuns:**

1. Valor maior que o saldo devedor (400):
```json
{
  "success": false,
  "data": {
    "error": "Valor inválido",
    "message": "O valor do pagamento (100) não pode ser maior que o saldo devedor (50)"
  }
}
```

2. Inadimplência não encontrada (404):
```json
{
  "success": false,
  "data": {
    "error": "Inadimplência não encontrada",
    "message": "A inadimplência especificada não existe"
  }
}
```

3. Valor inválido (400):
```json
{
  "success": false,
  "data": {
    "error": "Dados inválidos",
    "message": "O valor do pagamento deve ser maior que zero"
  }
}
```

## Exemplos de Uso

### Exemplo 1: Pagamento Parcial

```bash
curl -X POST \
  http://localhost:3000/api/inadimplencia/5/payment \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer SEU_TOKEN' \
  -d '{
    "amount": 50.00,
    "moeda": "BRL",
    "notes": "Primeira parcela do pagamento"
  }'
```

### Exemplo 2: Pagamento Total

```bash
curl -X POST \
  http://localhost:3000/api/inadimplencia/5/payment \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer SEU_TOKEN' \
  -d '{
    "amount": 200.00,
    "moeda": "BRL",
    "notes": "Pagamento integral da dívida"
  }'
```

Neste caso, se o valor total da inadimplência for 200.00 e não houver pagamentos anteriores, a inadimplência será marcada como `payed=true`.

### Exemplo 3: Verificar Status da Inadimplência

```bash
curl -X GET \
  http://localhost:3000/api/inadimplencia/5 \
  -H 'Authorization: Bearer SEU_TOKEN'
```

Resposta:
```json
{
  "success": true,
  "data": {
    "id": 5,
    "customer_id": 1,
    "amount": 200.00,
    "amount_payed": 150.00,
    "payed": false,
    "customer": {
      "id": 1,
      "name": "João Silva",
      "email": "joao@example.com"
    }
  }
}
```

## Transações Atômicas

A rota de pagamento usa transações do Prisma para garantir consistência:
- A criação da transaction e a atualização da inadimplência ocorrem atomicamente
- Se qualquer operação falhar, ambas são revertidas
- Isso garante que `amount_payed` sempre reflete a soma das transações pagas

## Autenticação

Todas as rotas requerem autenticação via token JWT no header:
```
Authorization: Bearer SEU_TOKEN_JWT
```

O usuário autenticado é automaticamente registrado como `created_by` na transação criada.

