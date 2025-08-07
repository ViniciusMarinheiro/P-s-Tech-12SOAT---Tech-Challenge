import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm'

@Entity('parts')
export class Part {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 100 })
  name: string

  @Column({ type: 'text', nullable: true })
  description: string

  @Column({ type: 'int', default: 0 })
  stock: number

  @Column({ type: 'int', name: 'unit_price' })
  unitPrice: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @OneToMany('WorkOrderPart', 'part')
  workOrderParts: any[]
}
