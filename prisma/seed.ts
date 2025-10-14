import { PrismaClient } from '../src/generated/prisma'
import { hashPassword } from '../src/lib/auth'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Criar usuário admin padrão
  const adminPassword = await hashPassword('123456')
  const admin = await prisma.user.upsert({
    where: { email: 'admin@admin.br' },
    update: {},
    create: {
      email: 'admin@admin.br',
      user_name: 'admin',
      password: adminPassword,
      ativo: true,
      telefone: '(11) 99999-9999',
    },
  })

  console.log('✅ Usuário admin criado:', {
    id: admin.id,
    email: admin.email,
    user_name: admin.user_name
  })

  // Criar usuários de exemplo
  const user1Password = await hashPassword('user123')
  const user1 = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      email: 'alice@example.com',
      user_name: 'alice',
      password: user1Password,
      ativo: true,
      telefone: '(11) 88888-8888',
    },
  })

  const user2Password = await hashPassword('user123')
  const user2 = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      email: 'bob@example.com',
      user_name: 'bob',
      password: user2Password,
      ativo: true,
      telefone: '(11) 77777-7777',
    },
  })

  console.log('✅ Usuários criados:', {
    user1: { id: user1.id, email: user1.email, user_name: user1.user_name },
    user2: { id: user2.id, email: user2.email, user_name: user2.user_name }
  })

  // Criar posts de exemplo
  const post1 = await prisma.post.create({
    data: {
      title: 'Primeiro Post',
      content: 'Este é o conteúdo do primeiro post criado automaticamente.',
      published: true,
      authorId: user1.id,
    },
  })

  const post2 = await prisma.post.create({
    data: {
      title: 'Segundo Post',
      content: 'Este é o conteúdo do segundo post.',
      published: false,
      authorId: user2.id,
    },
  })

  // Criar customers de exemplo
  const customer1 = await prisma.customer.create({
    data: {
      name: 'João Silva',
      person_type: 'PF',
      email: 'joao.silva@email.com',
      phone: '(11) 98765-4321',
      cpf: '123.456.789-00',
      access_website: 'https://empresa-joao.com',
      access_email: 'joao.acesso@email.com',
      access_password: await hashPassword('cliente123'),
      created_by: admin.id,
    },
  })

  const customer2 = await prisma.customer.create({
    data: {
      name: 'Tech Solutions Ltda',
      person_type: 'PJ',
      email: 'contato@techsolutions.com.br',
      phone: '(21) 98765-4321',
      cnpj: '12.345.678/0001-90',
      access_website: 'https://techsolutions.com.br',
      access_email: 'admin@techsolutions.com.br',
      access_password: await hashPassword('empresa456'),
      created_by: user1.id,
    },
  })

  const customer3 = await prisma.customer.create({
    data: {
      name: 'Maria Santos',
      person_type: 'PF',
      email: 'maria.santos@email.com',
      phone: '(31) 98765-4321',
      cpf: '987.654.321-00',
      wallet_address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      access_website: 'https://maria-designs.com',
      access_email: 'maria.work@email.com',
      access_password: await hashPassword('designer789'),
      created_by: user2.id,
    },
  })

  const customer4 = await prisma.customer.create({
    data: {
      name: 'Mega Corp S.A.',
      person_type: 'PJ',
      email: 'atendimento@megacorp.com.br',
      phone: '(11) 3456-7890',
      cnpj: '98.765.432/0001-10',
      access_website: 'https://megacorp.com.br',
      access_email: 'support@megacorp.com.br',
      access_password: await hashPassword('corp2024'),
      created_by: admin.id,
    },
  })

  console.log('✅ Customers criados:', {
    customer1: { id: customer1.id, name: customer1.name, email: customer1.email },
    customer2: { id: customer2.id, name: customer2.name, email: customer2.email },
    customer3: { id: customer3.id, name: customer3.name, email: customer3.email },
    customer4: { id: customer4.id, name: customer4.name, email: customer4.email }
  })

  // Criar transactions de exemplo
  const transaction1 = await prisma.transaction.create({
    data: {
      customer_id: customer1.id,
      status: 'PAYED',
      payment_type: 'IN',
      notes: 'Pagamento mensal do serviço de hospedagem',
      amount: 299.99,
      moeda: 'USD',
      grams: 150,
      expired_at: new Date('2024-12-31'),
      payed_at: new Date('2024-12-15'),
      created_by: admin.id,
    },
  })

  const transaction2 = await prisma.transaction.create({
    data: {
      customer_id: customer2.id,
      status: 'PENDING',
      payment_type: 'OUT',
      notes: 'Desenvolvimento de sistema web personalizado',
      amount: 2500.00,
      moeda: 'USD',
      grams: 0,
      expired_at: new Date('2024-12-25'),
      created_by: user1.id,
    },
  })

  const transaction3 = await prisma.transaction.create({
    data: {
      customer_id: customer3.id,
      status: 'CANCELED',
      payment_type: 'OUT',
      notes: 'Projeto de design de identidade visual',
      amount: 850.50,
      moeda: 'USD',
      grams: 0,
      expired_at: new Date('2024-11-30'),
      created_by: user2.id,
    },
  })

  const transaction4 = await prisma.transaction.create({
    data: {
      customer_id: customer4.id,
      status: 'PAYED',
      payment_type: 'IN',
      notes: 'Consultoria em infraestrutura de TI',
      amount: 1250.00,
      moeda: 'USD',
      grams: 300,
      expired_at: new Date('2024-12-20'),
      payed_at: new Date('2024-12-18'),
      created_by: admin.id,
    },
  })

  const transaction5 = await prisma.transaction.create({
    data: {
      customer_id: customer1.id,
      status: 'PENDING',
      payment_type: 'OUT',
      notes: 'Manutenção preventiva do servidor',
      amount: 150.00,
      moeda: 'USD',
      grams: 0,
      expired_at: new Date('2025-01-15'),
      created_by: user1.id,
    },
  })

  const transaction6 = await prisma.transaction.create({
    data: {
      customer_id: customer2.id,
      status: 'PAYED',
      payment_type: 'IN',
      notes: 'Suporte técnico mensal',
      amount: 200.00,
      moeda: 'USD',
      grams: 75,
      expired_at: new Date('2024-12-31'),
      payed_at: new Date('2024-12-01'),
      created_by: user2.id,
    },
  })

  const transaction7 = await prisma.transaction.create({
    data: {
      customer_id: customer3.id,
      status: 'PENDING',
      payment_type: 'OUT',
      notes: 'Criação de landing page',
      amount: 450.00,
      moeda: 'USD',
      grams: 0,
      expired_at: new Date('2025-01-10'),
      created_by: admin.id,
    },
  })

  const transaction8 = await prisma.transaction.create({
    data: {
      customer_id: customer4.id,
      status: 'PENDING',
      payment_type: 'OUT',
      notes: 'Implementação de sistema de backup',
      amount: 750.00,
      moeda: 'USD',
      grams: 0,
      expired_at: new Date('2025-02-01'),
      created_by: user1.id,
    },
  })

  // Criar inadimplências de exemplo
  const inadimplencia1 = await prisma.inadimplencia.create({
    data: {
      customer_id: customer1.id,
      amount: 450.00,
      payed: false,
      grams: 200,
      created_by: admin.id,
    },
  })

  const inadimplencia2 = await prisma.inadimplencia.create({
    data: {
      customer_id: customer2.id,
      amount: 1200.50,
      payed: false,
      grams: 500,
      created_by: user1.id,
    },
  })

  const inadimplencia3 = await prisma.inadimplencia.create({
    data: {
      customer_id: customer3.id,
      amount: 75.25,
      payed: true,
      grams: 50,
      created_by: user2.id,
    },
  })

  const inadimplencia4 = await prisma.inadimplencia.create({
    data: {
      customer_id: customer4.id,
      amount: 890.00,
      payed: false,
      grams: 350,
      created_by: admin.id,
    },
  })

  const inadimplencia5 = await prisma.inadimplencia.create({
    data: {
      customer_id: customer1.id,
      amount: 230.00,
      payed: true,
      grams: 120,
      created_by: user1.id,
    },
  })

  const inadimplencia6 = await prisma.inadimplencia.create({
    data: {
      customer_id: customer2.id,
      amount: 567.80,
      payed: false,
      grams: 250,
      created_by: user2.id,
    },
  })

  const inadimplencia7 = await prisma.inadimplencia.create({
    data: {
      customer_id: customer3.id,
      amount: 180.00,
      payed: false,
      grams: 90,
      created_by: admin.id,
    },
  })

  const inadimplencia8 = await prisma.inadimplencia.create({
    data: {
      customer_id: customer4.id,
      amount: 350.00,
      payed: true,
      grams: 180,
      created_by: user1.id,
    },
  })

  console.log('✅ Transactions criadas:', {
    transaction1: { id: transaction1.id, customer: customer1.name, status: transaction1.status, amount: transaction1.amount, moeda: transaction1.moeda, grams: transaction1.grams },
    transaction2: { id: transaction2.id, customer: customer2.name, status: transaction2.status, amount: transaction2.amount, moeda: transaction2.moeda, grams: transaction2.grams },
    transaction3: { id: transaction3.id, customer: customer3.name, status: transaction3.status, amount: transaction3.amount, moeda: transaction3.moeda, grams: transaction3.grams },
    transaction4: { id: transaction4.id, customer: customer4.name, status: transaction4.status, amount: transaction4.amount, moeda: transaction4.moeda, grams: transaction4.grams },
    transaction5: { id: transaction5.id, customer: customer1.name, status: transaction5.status, amount: transaction5.amount, moeda: transaction5.moeda, grams: transaction5.grams },
    transaction6: { id: transaction6.id, customer: customer2.name, status: transaction6.status, amount: transaction6.amount, moeda: transaction6.moeda, grams: transaction6.grams },
    transaction7: { id: transaction7.id, customer: customer3.name, status: transaction7.status, amount: transaction7.amount, moeda: transaction7.moeda, grams: transaction7.grams },
    transaction8: { id: transaction8.id, customer: customer4.name, status: transaction8.status, amount: transaction8.amount, moeda: transaction8.moeda, grams: transaction8.grams }
  })

  console.log('✅ Inadimplências criadas:', {
    inadimplencia1: { id: inadimplencia1.id, customer: customer1.name, amount: inadimplencia1.amount, payed: inadimplencia1.payed, grams: inadimplencia1.grams },
    inadimplencia2: { id: inadimplencia2.id, customer: customer2.name, amount: inadimplencia2.amount, payed: inadimplencia2.payed, grams: inadimplencia2.grams },
    inadimplencia3: { id: inadimplencia3.id, customer: customer3.name, amount: inadimplencia3.amount, payed: inadimplencia3.payed, grams: inadimplencia3.grams },
    inadimplencia4: { id: inadimplencia4.id, customer: customer4.name, amount: inadimplencia4.amount, payed: inadimplencia4.payed, grams: inadimplencia4.grams },
    inadimplencia5: { id: inadimplencia5.id, customer: customer1.name, amount: inadimplencia5.amount, payed: inadimplencia5.payed, grams: inadimplencia5.grams },
    inadimplencia6: { id: inadimplencia6.id, customer: customer2.name, amount: inadimplencia6.amount, payed: inadimplencia6.payed, grams: inadimplencia6.grams },
    inadimplencia7: { id: inadimplencia7.id, customer: customer3.name, amount: inadimplencia7.amount, payed: inadimplencia7.payed, grams: inadimplencia7.grams },
    inadimplencia8: { id: inadimplencia8.id, customer: customer4.name, amount: inadimplencia8.amount, payed: inadimplencia8.payed, grams: inadimplencia8.grams }
  })

  // Criar logs de exemplo - mais abrangente
  const logsData = [
    // Logins e logouts
    {
      user_id: admin.id,
      log_type: 'LOGIN' as const,
      description: `Usuário admin fez login no sistema`,
      date: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 horas atrás
    },
    {
      user_id: user1.id,
      log_type: 'LOGIN' as const,
      description: `Usuário alice fez login no sistema`,
      date: new Date(Date.now() - 90 * 60 * 1000) // 1.5 horas atrás
    },
    {
      user_id: user2.id,
      log_type: 'LOGIN' as const,
      description: `Usuário bob fez login no sistema`,
      date: new Date(Date.now() - 60 * 60 * 1000) // 1 hora atrás
    },
    {
      user_id: admin.id,
      log_type: 'LOGOUT' as const,
      description: `Usuário admin fez logout do sistema`,
      date: new Date(Date.now() - 30 * 60 * 1000) // 30 minutos atrás
    },

    // Ações com transações
    {
      user_id: user1.id,
      log_type: 'CREATE_TRANSACTION' as const,
      description: `Usuário alice criou transação #${transaction2.id} no valor de R$ ${transaction2.amount.toFixed(2)}`,
      date: new Date(Date.now() - 45 * 60 * 1000) // 45 minutos atrás
    },
    {
      user_id: admin.id,
      log_type: 'UPDATE_TRANSACTION' as const,
      description: `Usuário admin atualizou transação #${transaction1.id} no valor de R$ ${transaction1.amount.toFixed(2)}`,
      date: new Date(Date.now() - 40 * 60 * 1000) // 40 minutos atrás
    },
    {
      user_id: user2.id,
      log_type: 'UPDATE_TRANSACTION' as const,
      description: `Usuário bob atualizou transação #${transaction3.id} no valor de R$ ${transaction3.amount.toFixed(2)}`,
      date: new Date(Date.now() - 35 * 60 * 1000) // 35 minutos atrás
    },
    {
      user_id: admin.id,
      log_type: 'DELETE_TRANSACTION' as const,
      description: `Usuário admin excluiu transação #99 no valor de R$ 150.00`,
      date: new Date(Date.now() - 25 * 60 * 1000) // 25 minutos atrás
    },
    {
      user_id: user1.id,
      log_type: 'VIEW_TRANSACTION' as const,
      description: `Usuário alice visualizou transação #${transaction4.id}`,
      date: new Date(Date.now() - 20 * 60 * 1000) // 20 minutos atrás
    },

    // Ações com clientes
    {
      user_id: user2.id,
      log_type: 'CREATE_CUSTOMER' as const,
      description: `Usuário bob criou cliente "Maria Santos" (#${customer3.id})`,
      date: new Date(Date.now() - 50 * 60 * 1000) // 50 minutos atrás
    },
    {
      user_id: admin.id,
      log_type: 'UPDATE_CUSTOMER' as const,
      description: `Usuário admin atualizou cliente "João Silva" (#${customer1.id})`,
      date: new Date(Date.now() - 48 * 60 * 1000) // 48 minutos atrás
    },
    {
      user_id: user1.id,
      log_type: 'VIEW_CUSTOMER' as const,
      description: `Usuário alice visualizou cliente "João Silva" (#${customer1.id})`,
      date: new Date(Date.now() - 15 * 60 * 1000) // 15 minutos atrás
    },
    {
      user_id: user2.id,
      log_type: 'VIEW_CUSTOMER' as const,
      description: `Usuário bob visualizou cliente "Tech Solutions Ltda" (#${customer2.id})`,
      date: new Date(Date.now() - 10 * 60 * 1000) // 10 minutos atrás
    },

    // Ações com inadimplências
    {
      user_id: admin.id,
      log_type: 'CREATE_INADIMPLENCIA' as const,
      description: `Usuário admin criou inadimplência #${inadimplencia1.id} no valor de R$ ${inadimplencia1.amount.toFixed(2)}`,
      date: new Date(Date.now() - 55 * 60 * 1000) // 55 minutos atrás
    },
    {
      user_id: user1.id,
      log_type: 'UPDATE_INADIMPLENCIA' as const,
      description: `Usuário alice atualizou inadimplência #${inadimplencia2.id} no valor de R$ ${inadimplencia2.amount.toFixed(2)}`,
      date: new Date(Date.now() - 42 * 60 * 1000) // 42 minutos atrás
    },
    {
      user_id: user2.id,
      log_type: 'UPDATE_INADIMPLENCIA' as const,
      description: `Usuário bob atualizou inadimplência #${inadimplencia3.id} no valor de R$ ${inadimplencia3.amount.toFixed(2)}`,
      date: new Date(Date.now() - 38 * 60 * 1000) // 38 minutos atrás
    },
    {
      user_id: admin.id,
      log_type: 'DELETE_INADIMPLENCIA' as const,
      description: `Usuário admin excluiu inadimplência #999 no valor de R$ 200.00`,
      date: new Date(Date.now() - 28 * 60 * 1000) // 28 minutos atrás
    },
    {
      user_id: user1.id,
      log_type: 'VIEW_INADIMPLENCIA' as const,
      description: `Usuário alice visualizou inadimplência #${inadimplencia4.id}`,
      date: new Date(Date.now() - 18 * 60 * 1000) // 18 minutos atrás
    },
    {
      user_id: user2.id,
      log_type: 'VIEW_INADIMPLENCIA' as const,
      description: `Usuário bob visualizou inadimplência #${inadimplencia5.id}`,
      date: new Date(Date.now() - 12 * 60 * 1000) // 12 minutos atrás
    },

    // Logs de ontem
    {
      user_id: admin.id,
      log_type: 'LOGIN' as const,
      description: `Usuário admin fez login no sistema`,
      date: new Date(Date.now() - 24 * 60 * 60 * 1000) // Ontem
    },
    {
      user_id: user1.id,
      log_type: 'CREATE_TRANSACTION' as const,
      description: `Usuário alice criou transação #100 no valor de R$ 500.00`,
      date: new Date(Date.now() - 23 * 60 * 60 * 1000) // Ontem +1h
    },
    {
      user_id: user2.id,
      log_type: 'UPDATE_CUSTOMER' as const,
      description: `Usuário bob atualizou cliente "Mega Corp S.A." (#${customer4.id})`,
      date: new Date(Date.now() - 22 * 60 * 60 * 1000) // Ontem +2h
    },

    // Logs de semana passada
    {
      user_id: admin.id,
      log_type: 'DELETE_CUSTOMER' as const,
      description: `Usuário admin excluiu cliente "Cliente Antigo" (#999)`,
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 1 semana atrás
    },
    {
      user_id: user1.id,
      log_type: 'LOGIN' as const,
      description: `Usuário alice fez login no sistema`,
      date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) // 6 dias atrás
    },
    {
      user_id: user2.id,
      log_type: 'CREATE_TRANSACTION' as const,
      description: `Usuário bob criou transação #101 no valor de R$ 750.00`,
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 dias atrás
    },

    // Logs mais antigos para testar paginação
    {
      user_id: admin.id,
      log_type: 'LOGIN' as const,
      description: `Usuário admin fez login no sistema`,
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 dias atrás
    },
    {
      user_id: user1.id,
      log_type: 'CREATE_CUSTOMER' as const,
      description: `Usuário alice criou cliente "Cliente Histórico" (#1000)`,
      date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000) // 25 dias atrás
    }
  ];

  // Criar logs em lote
  const createdLogs = [];
  for (const logData of logsData) {
    const log = await prisma.log.create({
      data: logData
    });
    createdLogs.push(log);
  }

  console.log('✅ Logs criados:', {
    total: createdLogs.length,
    tipos: {
      LOGIN: createdLogs.filter(l => l.log_type === 'LOGIN').length,
      LOGOUT: createdLogs.filter(l => l.log_type === 'LOGOUT').length,
      CREATE_TRANSACTION: createdLogs.filter(l => l.log_type === 'CREATE_TRANSACTION').length,
      UPDATE_TRANSACTION: createdLogs.filter(l => l.log_type === 'UPDATE_TRANSACTION').length,
      DELETE_TRANSACTION: createdLogs.filter(l => l.log_type === 'DELETE_TRANSACTION').length,
      CREATE_CUSTOMER: createdLogs.filter(l => l.log_type === 'CREATE_CUSTOMER').length,
      UPDATE_CUSTOMER: createdLogs.filter(l => l.log_type === 'UPDATE_CUSTOMER').length,
      VIEW_TRANSACTION: createdLogs.filter(l => l.log_type === 'VIEW_TRANSACTION').length,
      VIEW_CUSTOMER: createdLogs.filter(l => l.log_type === 'VIEW_CUSTOMER').length,
      DELETE_CUSTOMER: createdLogs.filter(l => l.log_type === 'DELETE_CUSTOMER').length,
      CREATE_INADIMPLENCIA: createdLogs.filter(l => l.log_type === 'CREATE_INADIMPLENCIA').length,
      UPDATE_INADIMPLENCIA: createdLogs.filter(l => l.log_type === 'UPDATE_INADIMPLENCIA').length,
      DELETE_INADIMPLENCIA: createdLogs.filter(l => l.log_type === 'DELETE_INADIMPLENCIA').length,
      VIEW_INADIMPLENCIA: createdLogs.filter(l => l.log_type === 'VIEW_INADIMPLENCIA').length,
    },
    exemplo: {
      primeiro: { id: createdLogs[0].id, type: createdLogs[0].log_type, description: createdLogs[0].description.substring(0, 60) + '...' },
      ultimo: { id: createdLogs[createdLogs.length - 1].id, type: createdLogs[createdLogs.length - 1].log_type, description: createdLogs[createdLogs.length - 1].description.substring(0, 60) + '...' }
    }
  })

  console.log('🎉 Seed concluído com sucesso!')
  console.log('')
  console.log('👤 Usuários de teste criados:')
  console.log('   Admin: admin@example.com / admin123')
  console.log('   Alice: alice@example.com / user123')
  console.log('   Bob:   bob@example.com / user123')
  console.log('')
  console.log('🏢 Customers de teste criados:')
  console.log('   João Silva (PF): joao.silva@email.com / cliente123')
  console.log('   Tech Solutions Ltda (PJ): contato@techsolutions.com.br / empresa456')
  console.log('   Maria Santos (PF): maria.santos@email.com / designer789')
  console.log('   Mega Corp S.A. (PJ): atendimento@megacorp.com.br / corp2024')
  console.log('')
  console.log('💰 Transactions de teste criadas:')
  console.log('   8 transações criadas com diferentes status (PENDING, PAYED, CANCELED)')
  console.log('   Valores variando de $150.00 a $2500.00')
  console.log('   Valores de grams variando de 0g a 300g')
  console.log('   Serviços: hospedagem, desenvolvimento web, design, consultoria TI, etc.')
  console.log('')
  console.log('⚠️ Inadimplências de teste criadas:')
  console.log('   8 inadimplências criadas com status mistos (pagas e não pagas)')
  console.log('   Valores variando de $75.25 a $1200.50')
  console.log('   Valores de grams variando de 50g a 500g')
  console.log('   Distribuídas entre todos os customers para demonstração')
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
