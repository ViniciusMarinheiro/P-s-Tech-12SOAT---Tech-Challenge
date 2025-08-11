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
import { WorkOrderStatusEnum } from '../enum/work-order-status.enum'

@Entity('work_orders')
export class WorkOrder {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'int', name: 'customer_id' })
  customerId: number

  @Column({ type: 'int', name: 'vehicle_id' })
  vehicleId: number

  @Column({ type: 'int', name: 'user_id' })
  userId: number

  @Column({ type: 'varchar', name: 'hash_view', nullable: true })
  hashView: string

  @Column({
    type: 'simple-enum',
    enum: WorkOrderStatusEnum,
    default: WorkOrderStatusEnum.RECEIVED,
  })
  status: WorkOrderStatusEnum

  @Column({ type: 'int', default: 0, name: 'total_amount' })
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

  @ManyToOne('User', 'workOrders')
  @JoinColumn({ name: 'user_id' })
  user: any

  @OneToMany('WorkOrderService', 'workOrder')
  workOrderServices: any[]

  @OneToMany('WorkOrderPart', 'workOrder')
  workOrderParts: any[]

  @Column({ type: 'timestamp', name: 'started_at', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  startedAt: Date

  @Column({ type: 'timestamp', name: 'finished_at', nullable: true})
  finishedAt: Date
}
