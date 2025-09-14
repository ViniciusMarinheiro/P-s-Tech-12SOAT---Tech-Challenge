# Cria o Grupo de Recursos que irá conter todos os recursos do projeto
resource "azurerm_resource_group" "rg" {
  name     = var.resource_group_name
  location = var.location
}

# Cria o cluster AKS (Azure Kubernetes Service)
resource "azurerm_kubernetes_cluster" "aks" {
  name                = var.cluster_name
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  dns_prefix          = "my-aks"

  # Configura o pool de nós padrão do cluster
  default_node_pool {
    name       = "default"
    node_count = var.node_count
    vm_size    = "Standard_D2s_v3"
  }

  # Configura a identidade gerenciada pelo sistema para o cluster
  identity {
    type = "SystemAssigned"
  }

  tags = {
    Environment = "Development"
  }
}