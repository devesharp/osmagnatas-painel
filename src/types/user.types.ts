// Interface User consistente com o modelo User do schema Prisma
export interface User {
  id: number;
  email: string;
  user_name?: string | null;
  password?: string | null;
  ativo: boolean;
  telefone?: string | null;
  createdAt: Date;
  updatedAt: Date;
  access_token?: string;
}
