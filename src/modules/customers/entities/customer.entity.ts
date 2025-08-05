import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm'

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 100 })
  name: string

  @Column({
    type: 'varchar',
    length: 20,
    unique: true,
    name: 'document_number',
  })
  documentNumber: string

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string

  @Column({ type: 'varchar', length: 100 })
  email: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @OneToMany('Vehicle', 'customer')
  vehicles: any[]

  @OneToMany('WorkOrder', 'customer')
  workOrders: any[]
}
