import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm'

@Entity('work_order_services')
export class WorkOrderService {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'int' })
  work_order_id: number

  @Column({ type: 'int' })
  service_id: number

  @Column({ type: 'int', default: 1 })
  quantity: number

  @Column({ type: 'int' }) // valor em centavos
  total_price: number

  @ManyToOne('WorkOrder', 'workOrderServices')
  @JoinColumn({ name: 'work_order_id' })
  workOrder: any

  @ManyToOne('Service', 'workOrderServices')
  @JoinColumn({ name: 'service_id' })
  service: any
}
