import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm'

@Entity('work_order_parts')
export class WorkOrderPart {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'int', name: 'work_order_id' })
  workOrderId: number

  @Column({ type: 'int', name: 'part_id' })
  partId: number

  @Column({ type: 'int', default: 1 })
  quantity: number

  @Column({ type: 'int', name: 'total_price' })
  totalPrice: number

  @ManyToOne('WorkOrder', 'workOrderParts')
  @JoinColumn({ name: 'work_order_id' })
  workOrder: any

  @ManyToOne('Part', 'workOrderParts')
  @JoinColumn({ name: 'part_id' })
  part: any
}
