# 🛠️ Sistema Integrado de Atendimento e Execução de Serviços - Oficina Mecânica FullStack Motors

## 📌 Contexto

Uma oficina mecânica de médio porte, especializada em manutenção de veículos, tem enfrentado desafios para expandir seus serviços com qualidade e eficiência.

Atualmente, o processo de atendimento, diagnóstico, execução de serviços e entrega dos veículos é feito de forma **desorganizada**, utilizando anotações manuais e planilhas, gerando problemas como:

- ❌ Erros na priorização dos atendimentos
- ❌ Falhas no controle de peças e insumos
- ❌ Dificuldade em acompanhar o status dos serviços
- ❌ Perda de histórico de clientes e veículos
- ❌ Ineficiência no fluxo de orçamentos e autorizações

Para resolver essas questões, a oficina decidiu investir em um **Sistema Integrado de Atendimento e Execução de Serviços**, permitindo:

- 📲 Clientes acompanharem em tempo real o andamento dos serviços
- ✅ Aprovação de reparos adicionais via aplicativo
- ⚙️ Gestão interna mais eficiente, organizada e segura

---

## 🎯 Objetivo do Projeto

Desenvolver a **primeira versão (MVP)** do back-end do sistema, com foco em:

- Gestão de **ordens de serviço (OS)**
- Gestão de **clientes**
- Gestão de **peças e insumos**
- Aplicação de **Domain-Driven Design (DDD)**
- Garantia de **boas práticas de Qualidade de Software e Segurança**

---

## 🚀 Funcionalidades

### 📄 Criação da Ordem de Serviço (OS)

- Identificação do cliente por **CPF/CNPJ**
- Cadastro de veículo (**placa, marca, modelo, ano**)
- Inclusão dos serviços solicitados (ex.: troca de óleo, alinhamento)
- Inclusão de peças e insumos necessários
- Geração automática de orçamento com base nos serviços e peças
- Envio do orçamento ao cliente para aprovação

### 📊 Acompanhamento da OS

- Status possíveis:
  - Recebida
  - Em diagnóstico
  - Aguardando aprovação
  - Em execução
  - Finalizada
  - Entregue
- Alteração automática de status conforme ações no sistema
- Consulta pública via API para acompanhamento do progresso

### 🗂️ Gestão Administrativa

- CRUD de clientes
- CRUD de veículos
- CRUD de serviços
- CRUD de peças e insumos, com controle de estoque
- Listagem e detalhamento de ordens de serviço
- Monitoramento do tempo médio de execução

---

## 🔐 Segurança e Qualidade

- Autenticação **JWT** para APIs administrativas
- Validação de dados sensíveis (**CPF, CNPJ, placa de veículo**)
- Testes unitários e de integração para os principais fluxos

---

## 🏗️ Tecnologias Utilizadas

- **Node.js / NestJS**
- **TypeScript**
- **PostgreSQL**
- **DDD (Domain-Driven Design)**
- **Jest** (testes)
- **JWT** (segurança)

---

## 🛠️ Como Executar o Projeto com Docker Compose

### Pré-requisitos

- [Docker](https://www.docker.com/) instalado
- [Docker Compose](https://docs.docker.com/compose/) instalado

### Passos para execução

1. Clone o repositório:

   ```bash
   git clone https://github.com/ViniciusMarinheiro/P-s-Tech-12SOAT---Tech-Challenge.git

   ```

2. Acesse a pasta do projeto:
   ```bash
   cd P-s-Tech-12SOAT---Tech-Challenge
   ```
3. Construa e inicie os containers:

   ```bash
   docker-compose up -d --build

   ```

4. Acesse a aplicação na porta configurada:

   ```bash
   http://localhost:3333/api/oficina

   ```

5. Acesse a documentação da aplicação:
   ```bash
   http://localhost:3333/api/v1/oficina/documentation
   ```

## Descrição

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Compilar e executar o projeto

```bash
# development
$ yarn

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Create Migrations

```bash
$ yarn migration:generate MinhaMigration
```

## Execução de testes

```bash
# unit tests
$yarn test

# e2e tests
$yarn test:e2e

# test coverage
$yarn test:cov
```

## Desenvolvimento

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
