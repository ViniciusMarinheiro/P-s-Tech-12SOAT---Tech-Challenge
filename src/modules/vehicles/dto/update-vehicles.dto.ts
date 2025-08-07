import { PartialType } from '@nestjs/swagger'
import { CreateVehiclesDto } from './create-vehicles.dto'

export class UpdateVehiclesDto extends PartialType(CreateVehiclesDto) {}
