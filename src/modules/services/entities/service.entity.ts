import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm'

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 100 })
  name: string

  @Column({ type: 'text', nullable: true })
  description: string

  @Column({ type: 'int' }) // valor em centavos
  price: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @OneToMany('WorkOrderService', 'service')
  workOrderServices: any[]
}
