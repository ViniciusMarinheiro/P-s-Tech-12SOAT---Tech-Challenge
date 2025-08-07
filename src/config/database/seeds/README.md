# 🌱 Database Seed

Este diretório contém os arquivos de seed para popular o banco de dados com dados iniciais.

## 📋 O que o seed cria

O seed cria dados de exemplo para todas as entidades do sistema:

### 👥 Usuários

- **Admin**: `admin@oficina.com` / `123456`
- **Cliente**: `joao@email.com` / `123456`

### 👤 Clientes

- João Silva Santos (CPF: 123.456.789-00)
- Maria Oliveira Costa (CPF: 987.654.321-00)
- Carlos Eduardo Lima (CPF: 456.789.123-00)

### 🚗 Veículos

- Toyota Corolla 2020 (ABC-1234)
- Honda Civic 2019 (XYZ-5678)
- Ford Focus 2021 (DEF-9012)
- Volkswagen Golf 2018 (GHI-3456)

### 🔧 Serviços

- Troca de óleo (R$ 50,00)
- Troca de freios (R$ 150,00)
- Alinhamento e balanceamento (R$ 80,00)
- Revisão geral (R$ 250,00)

### 🔩 Peças

- Filtro de óleo (R$ 15,00) - Estoque: 50
- Pastilha de freio (R$ 25,00) - Estoque: 30
- Disco de freio (R$ 80,00) - Estoque: 20
- Óleo de motor (R$ 35,00) - Estoque: 100

### 📋 Ordens de Serviço

- 3 ordens de serviço com diferentes status
- Serviços e peças associados às ordens

## 🚀 Como executar

### Desenvolvimento

```bash
# Executar seed
yarn seed

# Ou com ts-node-dev (recomendado para desenvolvimento)
yarn seed:dev
```

### Produção

```bash
# Build primeiro
yarn build

# Executar seed compilado
node dist/database/seeds/seed.js
```

## ⚠️ Importante

- **O seed limpa todos os dados existentes** antes de criar os novos
- **Execute apenas em ambiente de desenvolvimento**
- **Faça backup antes de executar em produção**

## 🔧 Personalização

Para adicionar mais dados ou modificar os existentes, edite o arquivo `seed.ts`:

```typescript
// Adicionar mais clientes
const customer4 = AppDataSource.getRepository(Customer).create({
  name: 'Novo Cliente',
  documentNumber: '111.222.333-44',
  phone: '(11) 66666-6666',
  email: 'novo@email.com',
})
```

## 📊 Estrutura do seed

O seed é executado na seguinte ordem:

1. **Limpar dados existentes**
2. **Criar usuários** (admin e cliente)
3. **Criar clientes**
4. **Criar veículos** (associados aos clientes)
5. **Criar serviços**
6. **Criar peças**
7. **Criar ordens de serviço**
8. **Adicionar serviços às ordens**
9. **Adicionar peças às ordens**

## 🎯 Uso após o seed

Após executar o seed, você pode:

1. **Fazer login** com as credenciais fornecidas
2. **Testar todas as funcionalidades** da API
3. **Ver dados relacionados** entre as entidades
4. **Testar diferentes cenários** de negócio

## 🔑 Credenciais de acesso

```
Admin: admin@oficina.com / 123456
Cliente: joao@email.com / 123456
```
