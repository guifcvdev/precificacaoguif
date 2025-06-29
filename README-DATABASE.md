# Estrutura do Banco de Dados

Este documento descreve a estrutura do banco de dados Supabase utilizado neste projeto.

## Schemas

O banco de dados está organizado em três schemas principais:

- **auth**: Gerenciado pelo Supabase, contém tabelas relacionadas à autenticação.
- **config**: Contém tabelas de configuração do sistema, como produtos e preços base.
- **user_data**: Contém dados específicos de usuários, como preços personalizados e orçamentos.
- **public**: Contém tabelas públicas, como perfis de usuários.

## Tabelas

### Schema config

#### product_categories
Categorias de produtos disponíveis no sistema.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Identificador único (PK) |
| name | TEXT | Nome da categoria |
| slug | TEXT | Slug da categoria (único) |
| description | TEXT | Descrição da categoria |
| display_order | INTEGER | Ordem de exibição |
| created_at | TIMESTAMPTZ | Data de criação |
| updated_at | TIMESTAMPTZ | Data de atualização |

#### products
Produtos disponíveis no sistema.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Identificador único (PK) |
| category_id | UUID | Referência à categoria (FK) |
| name | TEXT | Nome do produto |
| slug | TEXT | Slug do produto (único) |
| description | TEXT | Descrição do produto |
| unit | TEXT | Unidade de medida (m², unid, etc.) |
| has_minimum_price | BOOLEAN | Indica se tem preço mínimo |
| minimum_price | DECIMAL(10,2) | Preço mínimo |
| display_order | INTEGER | Ordem de exibição |
| created_at | TIMESTAMPTZ | Data de criação |
| updated_at | TIMESTAMPTZ | Data de atualização |

#### product_options
Opções/variações de produtos.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Identificador único (PK) |
| product_id | UUID | Referência ao produto (FK) |
| name | TEXT | Nome da opção |
| description | TEXT | Descrição da opção |
| unit | TEXT | Unidade de medida |
| display_order | INTEGER | Ordem de exibição |
| created_at | TIMESTAMPTZ | Data de criação |
| updated_at | TIMESTAMPTZ | Data de atualização |

#### base_prices
Preços base definidos pelo sistema.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Identificador único (PK) |
| product_option_id | UUID | Referência à opção de produto (FK) |
| base_price | DECIMAL(10,2) | Preço base |
| created_at | TIMESTAMPTZ | Data de criação |
| updated_at | TIMESTAMPTZ | Data de atualização |

### Schema public

#### profiles
Perfis de usuários.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Identificador único (PK, FK para auth.users) |
| name | TEXT | Nome do usuário |
| company | TEXT | Empresa do usuário |
| is_admin | BOOLEAN | Indica se é administrador |
| created_at | TIMESTAMPTZ | Data de criação |
| updated_at | TIMESTAMPTZ | Data de atualização |

### Schema user_data

#### user_prices
Preços personalizados por usuário.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Identificador único (PK) |
| user_id | UUID | Referência ao usuário (FK) |
| product_option_id | UUID | Referência à opção de produto (FK) |
| price | DECIMAL(10,2) | Preço personalizado |
| created_at | TIMESTAMPTZ | Data de criação |
| updated_at | TIMESTAMPTZ | Data de atualização |

#### budget_settings
Configurações de orçamento por usuário.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Identificador único (PK) |
| user_id | UUID | Referência ao usuário (FK) |
| payment_method | TEXT | Método de pagamento padrão |
| delivery_time | TEXT | Tempo de entrega padrão |
| warranty | TEXT | Garantia padrão |
| tax_percentage | DECIMAL(5,2) | Percentual de imposto padrão |
| created_at | TIMESTAMPTZ | Data de criação |
| updated_at | TIMESTAMPTZ | Data de atualização |

#### credit_card_fees
Configurações de taxas de cartão de crédito por usuário.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Identificador único (PK) |
| user_id | UUID | Referência ao usuário (FK) |
| installments | INTEGER | Número de parcelas |
| fee_percentage | DECIMAL(5,2) | Percentual da taxa |
| created_at | TIMESTAMPTZ | Data de criação |
| updated_at | TIMESTAMPTZ | Data de atualização |

#### installation_fees
Configurações de taxas de instalação por usuário e localidade.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Identificador único (PK) |
| user_id | UUID | Referência ao usuário (FK) |
| location | TEXT | Localidade |
| fee | DECIMAL(10,2) | Taxa de instalação |
| created_at | TIMESTAMPTZ | Data de criação |
| updated_at | TIMESTAMPTZ | Data de atualização |

#### budgets
Orçamentos criados pelos usuários.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Identificador único (PK) |
| user_id | UUID | Referência ao usuário (FK) |
| client_name | TEXT | Nome do cliente |
| client_email | TEXT | Email do cliente |
| client_phone | TEXT | Telefone do cliente |
| client_company | TEXT | Empresa do cliente |
| status | TEXT | Status do orçamento (draft, sent, approved, rejected, completed) |
| budget_number | TEXT | Número do orçamento |
| budget_date | DATE | Data do orçamento |
| valid_until | DATE | Data de validade |
| subtotal | DECIMAL(10,2) | Subtotal |
| tax_percentage | DECIMAL(5,2) | Percentual de imposto |
| tax_value | DECIMAL(10,2) | Valor do imposto |
| discount_percentage | DECIMAL(5,2) | Percentual de desconto |
| discount_value | DECIMAL(10,2) | Valor do desconto |
| total_value | DECIMAL(10,2) | Valor total |
| payment_method | TEXT | Método de pagamento |
| delivery_time | TEXT | Tempo de entrega |
| warranty | TEXT | Garantia |
| notes | TEXT | Observações |
| installation_location | TEXT | Local de instalação |
| installation_fee | DECIMAL(10,2) | Taxa de instalação |
| created_at | TIMESTAMPTZ | Data de criação |
| updated_at | TIMESTAMPTZ | Data de atualização |

#### budget_items
Itens de orçamentos.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Identificador único (PK) |
| budget_id | UUID | Referência ao orçamento (FK) |
| product_id | UUID | Referência ao produto (FK) |
| product_option_id | UUID | Referência à opção de produto (FK) |
| description | TEXT | Descrição do item |
| quantity | DECIMAL(10,2) | Quantidade |
| unit | TEXT | Unidade de medida |
| unit_price | DECIMAL(10,2) | Preço unitário |
| total_price | DECIMAL(10,2) | Preço total |
| width | DECIMAL(10,2) | Largura (opcional) |
| height | DECIMAL(10,2) | Altura (opcional) |
| area | DECIMAL(10,2) | Área (opcional) |
| display_order | INTEGER | Ordem de exibição |
| created_at | TIMESTAMPTZ | Data de criação |
| updated_at | TIMESTAMPTZ | Data de atualização |

#### budget_observations
Observações de orçamento personalizadas por usuário.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Identificador único (PK) |
| user_id | UUID | Referência ao usuário (FK) |
| title | TEXT | Título da observação |
| content | TEXT | Conteúdo da observação |
| display_order | INTEGER | Ordem de exibição |
| created_at | TIMESTAMPTZ | Data de criação |
| updated_at | TIMESTAMPTZ | Data de atualização |

## Políticas de Segurança (RLS)

O banco de dados utiliza Row Level Security (RLS) para garantir que os usuários só possam acessar seus próprios dados:

- Usuários comuns podem ler todas as tabelas de configuração (produtos, categorias, etc.)
- Usuários comuns podem gerenciar apenas seus próprios dados (preços, orçamentos, etc.)
- Administradores podem gerenciar todas as tabelas

## Funções e Triggers

- `update_updated_at_column()`: Atualiza automaticamente o campo `updated_at` quando um registro é atualizado.
- `initialize_user_data()`: Inicializa dados para um novo usuário, incluindo preços personalizados, configurações de orçamento, etc.
- `on_auth_user_created()`: Trigger que chama `initialize_user_data()` quando um novo usuário é criado.

## Inicialização de Dados

Quando um novo usuário é criado:

1. Um perfil é criado para o usuário
2. Preços personalizados são inicializados com base nos preços base
3. Configurações de orçamento são inicializadas com valores padrão
4. Taxas de cartão de crédito são inicializadas com valores padrão
5. Taxas de instalação são inicializadas com valores padrão
