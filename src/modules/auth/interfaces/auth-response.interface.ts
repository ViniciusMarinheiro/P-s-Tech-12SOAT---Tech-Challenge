import { UserRole } from '../enums/user-role.enum'

export interface AuthUser {
  id: number
  name: string
  email: string
  role: UserRole
}

export interface LoginResponse {
  access_token: string
}

export interface RegisterResponse {
  id: number
  name: string
  email: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export interface JwtPayload {
  sub: number
  email: string
  role: UserRole
}
