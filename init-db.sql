-- Script de inicialização do banco de dados
-- Executado automaticamente quando o container PostgreSQL é criado

-- Criar schema se não existir
CREATE SCHEMA IF NOT EXISTS public;

-- Definir schema padrão
SET search_path TO public;

-- Criar extensões úteis
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Comentário de inicialização
SELECT 'Banco de dados oficina_db inicializado com sucesso!' as status;