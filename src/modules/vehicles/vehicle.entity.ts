import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm'

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'int', name: 'customer_id' })
  customerId: number

  @Column({ type: 'varchar', length: 10, unique: true })
  plate: string

  @Column({ type: 'varchar', length: 50, nullable: true })
  brand: string

  @Column({ type: 'varchar', length: 50, nullable: true })
  model: string

  @Column({ type: 'int', nullable: true })
  year: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @ManyToOne('Customer', 'vehicles')
  @JoinColumn({ name: 'customer_id' })
  customer: any

  @OneToMany('WorkOrder', 'vehicle')
  workOrders: any[]
}
