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

  @Column({ type: 'int' })
  work_order_id: number

  @Column({ type: 'int' })
  part_id: number

  @Column({ type: 'int', default: 1 })
  quantity: number

  @Column({ type: 'int' }) // valor em centavos
  total_price: number

  @ManyToOne('WorkOrder', 'workOrderParts')
  @JoinColumn({ name: 'work_order_id' })
  workOrder: any

  @ManyToOne('Part', 'workOrderParts')
  @JoinColumn({ name: 'part_id' })
  part: any
}
