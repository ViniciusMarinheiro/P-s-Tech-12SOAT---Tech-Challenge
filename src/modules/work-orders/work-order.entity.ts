import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm'

export enum WorkOrderStatus {
  RECEIVED = 'RECEIVED',
  DIAGNOSING = 'DIAGNOSING',
  AWAITING_APPROVAL = 'AWAITING_APPROVAL',
  IN_PROGRESS = 'IN_PROGRESS',
  FINISHED = 'FINISHED',
  DELIVERED = 'DELIVERED',
}

@Entity('work_orders')
export class WorkOrder {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'int', name: 'customer_id' })
  customerId: number

  @Column({ type: 'int', name: 'vehicle_id' })
  vehicleId: number

  @Column({
    type: 'enum',
    enum: WorkOrderStatus,
    default: WorkOrderStatus.RECEIVED,
  })
  status: WorkOrderStatus

  @Column({ type: 'int', default: 0, name: 'total_amount' }) // valor em centavos
  totalAmount: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @ManyToOne('Customer', 'workOrders')
  @JoinColumn({ name: 'customer_id' })
  customer: any

  @ManyToOne('Vehicle', 'workOrders')
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: any

  @OneToMany('WorkOrderService', 'workOrder')
  workOrderServices: any[]

  @OneToMany('WorkOrderPart', 'workOrder')
  workOrderParts: any[]
}
