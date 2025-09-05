import { prisma } from '@/lib/prisma'
import { LogType } from '@/types/log'

/**
 * Serviço de logging para registrar ações dos usuários
 */
export class LoggerService {
  /**
   * Registra uma ação do usuário
   */
  static async log(
    userId: number,
    logType: LogType,
    description: string
  ): Promise<void> {
    try {
      await prisma.log.create({
        data: {
          user_id: userId,
          log_type: logType,
          description,
        },
      })
    } catch (error) {
      console.error('Erro ao registrar log:', error)
      // Não lança erro para não quebrar o fluxo principal
    }
  }

  /**
   * Registra login do usuário
   */
  static async logLogin(userId: number, userName: string): Promise<void> {
    await this.log(
      userId,
      'LOGIN',
      `Usuário ${userName} fez login no sistema`
    )
  }

  /**
   * Registra logout do usuário
   */
  static async logLogout(userId: number, userName: string): Promise<void> {
    await this.log(
      userId,
      'LOGOUT',
      `Usuário ${userName} fez logout do sistema`
    )
  }

  /**
   * Registra criação de transação
   */
  static async logCreateTransaction(
    userId: number,
    userName: string,
    transactionId: number,
    amount: number
  ): Promise<void> {
    await this.log(
      userId,
      'CREATE_TRANSACTION',
      `Usuário ${userName} criou transação #${transactionId} no valor de R$ ${amount.toFixed(2)}`
    )
  }

  /**
   * Registra atualização de transação
   */
  static async logUpdateTransaction(
    userId: number,
    userName: string,
    transactionId: number,
    amount: number
  ): Promise<void> {
    await this.log(
      userId,
      'UPDATE_TRANSACTION',
      `Usuário ${userName} atualizou transação #${transactionId} no valor de R$ ${amount.toFixed(2)}`
    )
  }

  /**
   * Registra exclusão de transação
   */
  static async logDeleteTransaction(
    userId: number,
    userName: string,
    transactionId: number,
    amount: number
  ): Promise<void> {
    await this.log(
      userId,
      'DELETE_TRANSACTION',
      `Usuário ${userName} excluiu transação #${transactionId} no valor de R$ ${amount.toFixed(2)}`
    )
  }

  /**
   * Registra visualização de transação
   */
  static async logViewTransaction(
    userId: number,
    userName: string,
    transactionId: number
  ): Promise<void> {
    await this.log(
      userId,
      'VIEW_TRANSACTION',
      `Usuário ${userName} visualizou transação #${transactionId}`
    )
  }

  /**
   * Registra criação de cliente
   */
  static async logCreateCustomer(
    userId: number,
    userName: string,
    customerId: number,
    customerName: string
  ): Promise<void> {
    await this.log(
      userId,
      'CREATE_CUSTOMER',
      `Usuário ${userName} criou cliente "${customerName}" (#${customerId})`
    )
  }

  /**
   * Registra atualização de cliente
   */
  static async logUpdateCustomer(
    userId: number,
    userName: string,
    customerId: number,
    customerName: string
  ): Promise<void> {
    await this.log(
      userId,
      'UPDATE_CUSTOMER',
      `Usuário ${userName} atualizou cliente "${customerName}" (#${customerId})`
    )
  }

  /**
   * Registra exclusão de cliente
   */
  static async logDeleteCustomer(
    userId: number,
    userName: string,
    customerId: number,
    customerName: string
  ): Promise<void> {
    await this.log(
      userId,
      'DELETE_CUSTOMER',
      `Usuário ${userName} excluiu cliente "${customerName}" (#${customerId})`
    )
  }

  /**
   * Registra visualização de cliente
   */
  static async logViewCustomer(
    userId: number,
    userName: string,
    customerId: number,
    customerName: string
  ): Promise<void> {
    await this.log(
      userId,
      'VIEW_CUSTOMER',
      `Usuário ${userName} visualizou cliente "${customerName}" (#${customerId})`
    )
  }
}
