variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
  default     = "MyResourceGroup"
}

variable "location" {
  description = "The Azure region to deploy to"
  type        = string
  default     = "East US"
}

variable "cluster_name" {
  description = "The name of the AKS cluster"
  type        = string
  default     = "my-aks-cluster"
}

variable "node_count" {
  description = "The number of nodes in the AKS node pool"
  type        = number
  default     = 2
}