import { DataSource } from 'typeorm'
import * as bcrypt from 'bcryptjs'
import { UserRole } from '../../../modules/auth/enums/user-role.enum'
import { User } from '../../../modules/users/entities/user.entity'
import { Customer } from '../../../modules/customers/entities/customer.entity'
import { Vehicle } from '../../../modules/vehicles/entities/vehicle.entity'
import { WorkOrder } from '../../../modules/work-orders/entities/work-order.entity'
import { WorkOrderService } from '../../../modules/work-orders/entities/work-order-service.entity'
import { WorkOrderPart } from '../../../modules/work-orders/entities/work-order-part.entity'
import { AppDataSource } from '../data-source'
import { Part } from '../../../modules/parts/entities/part.entity'
import { Service } from '../../../modules/services/entities/service.entity'

async function seed() {
  console.log('🌱 Iniciando seed do banco de dados...')

  try {
    // Inicializar conexão
    await AppDataSource.initialize()
    console.log('✅ Conexão com banco estabelecida')

    // Limpar dados existentes (usando DELETE para evitar problemas de foreign key)
    console.log('🧹 Limpando dados existentes...')
    await AppDataSource.query('DELETE FROM work_order_parts')
    await AppDataSource.query('DELETE FROM work_order_services')
    await AppDataSource.query('DELETE FROM work_orders')
    await AppDataSource.query('DELETE FROM parts')
    await AppDataSource.query('DELETE FROM services')
    await AppDataSource.query('DELETE FROM vehicles')
    await AppDataSource.query('DELETE FROM customers')
    await AppDataSource.query('DELETE FROM users')

    // ========================================
    // 1. CRIAR USUÁRIOS
    // ========================================
    console.log('👥 Criando usuários...')

    const hashedPassword = await bcrypt.hash('admin123@', 10)

    const adminUser = AppDataSource.getRepository(User).create({
      name: 'adm',
      email: 'adm@gmail.com',
      password: hashedPassword,
      role: UserRole.ADMIN,
    })

    const customerUser = AppDataSource.getRepository(User).create({
      name: 'João Silva',
      email: 'joao@email.com',
      password: hashedPassword,
      role: UserRole.CUSTOMER,
    })

    const savedAdmin = await AppDataSource.getRepository(User).save(adminUser)
    const savedCustomer =
      await AppDataSource.getRepository(User).save(customerUser)

    console.log('✅ Usuários criados')

    // ========================================
    // 2. CRIAR CLIENTES
    // ========================================
    console.log('👤 Criando clientes...')

    const customer1 = AppDataSource.getRepository(Customer).create({
      name: 'João Silva Santos',
      documentNumber: '123.456.789-00',
      phone: '(11) 99999-9999',
      email: 'joao.silva@email.com',
    })

    const customer2 = AppDataSource.getRepository(Customer).create({
      name: 'Maria Oliveira Costa',
      documentNumber: '987.654.321-00',
      phone: '(11) 88888-8888',
      email: 'maria.oliveira@email.com',
    })

    const customer3 = AppDataSource.getRepository(Customer).create({
      name: 'Carlos Eduardo Lima',
      documentNumber: '456.789.123-00',
      phone: '(11) 77777-7777',
      email: 'carlos.lima@email.com',
    })

    const savedCustomer1 =
      await AppDataSource.getRepository(Customer).save(customer1)
    const savedCustomer2 =
      await AppDataSource.getRepository(Customer).save(customer2)
    const savedCustomer3 =
      await AppDataSource.getRepository(Customer).save(customer3)

    console.log('✅ Clientes criados')

    // ========================================
    // 3. CRIAR VEÍCULOS
    // ========================================
    console.log('🚗 Criando veículos...')

    const vehicle1 = AppDataSource.getRepository(Vehicle).create({
      customerId: savedCustomer1.id,
      plate: 'ABC-1234',
      brand: 'Toyota',
      model: 'Corolla',
      year: 2020,
    })

    const vehicle2 = AppDataSource.getRepository(Vehicle).create({
      customerId: savedCustomer1.id,
      plate: 'XYZ-5678',
      brand: 'Honda',
      model: 'Civic',
      year: 2019,
    })

    const vehicle3 = AppDataSource.getRepository(Vehicle).create({
      customerId: savedCustomer2.id,
      plate: 'DEF-9012',
      brand: 'Ford',
      model: 'Focus',
      year: 2021,
    })

    const vehicle4 = AppDataSource.getRepository(Vehicle).create({
      customerId: savedCustomer3.id,
      plate: 'GHI-3456',
      brand: 'Volkswagen',
      model: 'Golf',
      year: 2018,
    })

    const savedVehicle1 =
      await AppDataSource.getRepository(Vehicle).save(vehicle1)
    const savedVehicle2 =
      await AppDataSource.getRepository(Vehicle).save(vehicle2)
    const savedVehicle3 =
      await AppDataSource.getRepository(Vehicle).save(vehicle3)
    const savedVehicle4 =
      await AppDataSource.getRepository(Vehicle).save(vehicle4)

    console.log('✅ Veículos criados')

    // ========================================
    // 4. CRIAR SERVIÇOS
    // ========================================
    console.log('🔧 Criando serviços...')

    const service1 = AppDataSource.getRepository(Service).create({
      name: 'Troca de óleo',
      description: 'Troca de óleo do motor com filtro',
      price: 5000, // R$ 50,00
    })

    const service2 = AppDataSource.getRepository(Service).create({
      name: 'Troca de freios',
      description: 'Troca de pastilhas e discos de freio',
      price: 15000, // R$ 150,00
    })

    const service3 = AppDataSource.getRepository(Service).create({
      name: 'Alinhamento e balanceamento',
      description: 'Alinhamento e balanceamento das rodas',
      price: 8000, // R$ 80,00
    })

    const service4 = AppDataSource.getRepository(Service).create({
      name: 'Revisão geral',
      description: 'Revisão completa do veículo',
      price: 25000, // R$ 250,00
    })

    const savedService1 =
      await AppDataSource.getRepository(Service).save(service1)
    const savedService2 =
      await AppDataSource.getRepository(Service).save(service2)
    const savedService3 =
      await AppDataSource.getRepository(Service).save(service3)
    const savedService4 =
      await AppDataSource.getRepository(Service).save(service4)

    console.log('✅ Serviços criados')

    // ========================================
    // 5. CRIAR PEÇAS
    // ========================================
    console.log('🔩 Criando peças...')

    const part1 = AppDataSource.getRepository(Part).create({
      name: 'Filtro de óleo',
      description: 'Filtro de óleo para motor 1.0',
      stock: 50,
      unitPrice: 1500, // R$ 15,00
    })

    const part2 = AppDataSource.getRepository(Part).create({
      name: 'Pastilha de freio',
      description: 'Pastilha de freio dianteira',
      stock: 30,
      unitPrice: 2500, // R$ 25,00
    })

    const part3 = AppDataSource.getRepository(Part).create({
      name: 'Disco de freio',
      description: 'Disco de freio dianteiro',
      stock: 20,
      unitPrice: 8000, // R$ 80,00
    })

    const part4 = AppDataSource.getRepository(Part).create({
      name: 'Óleo de motor',
      description: 'Óleo sintético 5W30',
      stock: 100,
      unitPrice: 3500, // R$ 35,00
    })

    const savedPart1 = await AppDataSource.getRepository(Part).save(part1)
    const savedPart2 = await AppDataSource.getRepository(Part).save(part2)
    const savedPart3 = await AppDataSource.getRepository(Part).save(part3)
    const savedPart4 = await AppDataSource.getRepository(Part).save(part4)

    console.log('✅ Peças criadas')

    // ========================================
    // 6. CRIAR ORDENS DE SERVIÇO
    // ========================================
    // console.log('📋 Criando ordens de serviço...')

    // const workOrder1 = AppDataSource.getRepository(WorkOrder).create({
    //   customerId: savedCustomer1.id,
    //   vehicleId: savedVehicle1.id,
    //   status: WorkOrderStatus.IN_PROGRESS,
    //   totalAmount: 6500, // R$ 65,00
    // })

    // const workOrder2 = AppDataSource.getRepository(WorkOrder).create({
    //   customerId: savedCustomer2.id,
    //   vehicleId: savedVehicle3.id,
    //   status: WorkOrderStatus.RECEIVED,
    //   totalAmount: 15000, // R$ 150,00
    // })

    // const workOrder3 = AppDataSource.getRepository(WorkOrder).create({
    //   customerId: savedCustomer3.id,
    //   vehicleId: savedVehicle4.id,
    //   status: WorkOrderStatus.FINISHED,
    //   totalAmount: 33000, // R$ 330,00
    // })

    // const savedWorkOrder1 =
    //   await AppDataSource.getRepository(WorkOrder).save(workOrder1)
    // const savedWorkOrder2 =
    //   await AppDataSource.getRepository(WorkOrder).save(workOrder2)
    // const savedWorkOrder3 =
    //   await AppDataSource.getRepository(WorkOrder).save(workOrder3)

    console.log('✅ Ordens de serviço criadas')

    // ========================================
    // 7. CRIAR SERVIÇOS NAS ORDENS
    // ========================================
    console.log('🔧 Adicionando serviços às ordens...')

    // const workOrderService1 = AppDataSource.getRepository(
    //   WorkOrderService,
    // ).create({
    //   workOrderId: savedWorkOrder1.id,
    //   serviceId: savedService1.id,
    //   quantity: 1,
    //   totalPrice: 5000, // R$ 50,00
    // })

    // const workOrderService2 = AppDataSource.getRepository(
    //   WorkOrderService,
    // ).create({
    //   workOrderId: savedWorkOrder2.id,
    //   serviceId: savedService2.id,
    //   quantity: 1,
    //   totalPrice: 15000, // R$ 150,00
    // })

    // const workOrderService3 = AppDataSource.getRepository(
    //   WorkOrderService,
    // ).create({
    //   workOrderId: savedWorkOrder3.id,
    //   serviceId: savedService4.id,
    //   quantity: 1,
    //   totalPrice: 25000, // R$ 250,00
    // })

    // await AppDataSource.getRepository(WorkOrderService).save(workOrderService1)
    // await AppDataSource.getRepository(WorkOrderService).save(workOrderService2)
    // await AppDataSource.getRepository(WorkOrderService).save(workOrderService3)

    // console.log('✅ Serviços adicionados às ordens')

    // ========================================
    // 8. CRIAR PEÇAS NAS ORDENS
    // ========================================
    // console.log('🔩 Adicionando peças às ordens...')

    // const workOrderPart1 = AppDataSource.getRepository(WorkOrderPart).create({
    //   workOrderId: savedWorkOrder1.id,
    //   partId: savedPart1.id,
    //   quantity: 1,
    //   totalPrice: 1500, // R$ 15,00
    // })

    // const workOrderPart2 = AppDataSource.getRepository(WorkOrderPart).create({
    //   workOrderId: savedWorkOrder3.id,
    //   partId: savedPart2.id,
    //   quantity: 2,
    //   totalPrice: 5000, // R$ 50,00
    // })

    // const workOrderPart3 = AppDataSource.getRepository(WorkOrderPart).create({
    //   workOrderId: savedWorkOrder3.id,
    //   partId: savedPart4.id,
    //   quantity: 1,
    //   totalPrice: 3000, // R$ 30,00
    // })

    // await AppDataSource.getRepository(WorkOrderPart).save(workOrderPart1)
    // await AppDataSource.getRepository(WorkOrderPart).save(workOrderPart2)
    // await AppDataSource.getRepository(WorkOrderPart).save(workOrderPart3)

    console.log('✅ Peças adicionadas às ordens')

    console.log('🎉 Seed concluído com sucesso!')
    console.log('')
    console.log('📊 Dados criados:')
    console.log('   👥 Usuários: 2')
    console.log('   👤 Clientes: 3')
    console.log('   🚗 Veículos: 4')
    console.log('   🔧 Serviços: 4')
    console.log('   🔩 Peças: 4')
    console.log('   📋 Ordens de serviço: 3')
    console.log('')
    console.log('🔑 Credenciais de acesso:')
    console.log('   Admin: admin@oficina.com / 123456')
    console.log('   Cliente: joao@email.com / 123456')
  } catch (error) {
    console.error('❌ Erro durante o seed:', error)
    throw error
  } finally {
    await AppDataSource.destroy()
  }
}

// Executar seed se o arquivo for executado diretamente
if (require.main === module) {
  seed()
    .then(() => {
      console.log('✅ Seed executado com sucesso!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Erro ao executar seed:', error)
      process.exit(1)
    })
}

export { seed }
