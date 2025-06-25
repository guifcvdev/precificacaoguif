# Guia para Limpeza e Reconfiguração do Banco de Dados Supabase

Este guia explica como limpar completamente o banco de dados Supabase e implementar a nova estrutura.

## 🚨 IMPORTANTE - BACKUP

Antes de prosseguir, **FAÇA BACKUP** de todos os dados importantes! Este processo remove TODOS os dados existentes.

## Passo 1: Limpar o Banco de Dados Atual

### Opção A - Script Seguro (Recomendado)
1. Acesse o painel do Supabase: https://app.supabase.com/
2. Selecione seu projeto
3. Vá para "SQL Editor"
4. Crie um novo script e cole o conteúdo do arquivo `supabase/cleanup_database_safe.sql`
5. Execute o script

### Opção B - Script Completo (se houver problemas com permissões)
Se o script seguro não funcionar completamente, use:
1. Execute o arquivo `supabase/cleanup_database.sql` (versão corrigida)
2. Se aparecer erros de permissão, eles serão ignorados automaticamente

**O que este script faz:**
- Remove todas as tabelas personalizadas
- Remove todos os schemas customizados (config, user_data)
- Remove funções e triggers personalizados
- Remove políticas RLS personalizadas
- Preserva apenas as tabelas e estruturas do sistema Supabase

## Passo 2: Implementar a Nova Estrutura

Após a limpeza, execute o script principal:

1. No SQL Editor do Supabase
2. Crie um novo script e cole o conteúdo do arquivo `supabase/main.sql`
3. Execute o script

**O que este script faz:**
- Cria os schemas organizados (config, user_data)
- Cria todas as tabelas da nova estrutura
- Configura políticas de segurança RLS
- Cria funções auxiliares e triggers
- Insere dados iniciais (categorias e produtos)

## Passo 3: Verificar a Configuração

1. Verifique se as tabelas foram criadas:
   ```sql
   SELECT schemaname, tablename 
   FROM pg_tables 
   WHERE schemaname IN ('config', 'user_data', 'public')
   ORDER BY schemaname, tablename;
   ```

2. Verifique se as políticas RLS estão ativas:
   ```sql
   SELECT schemaname, tablename, rowsecurity 
   FROM pg_tables 
   WHERE schemaname IN ('config', 'user_data', 'public')
   AND rowsecurity = true;
   ```

## Passo 4: Testar a Aplicação

1. Inicie a aplicação local:
   ```bash
   npm run dev
   ```

2. Acesse a página de teste do banco: `/database-test`

3. Verifique se a conexão está funcionando

## Passo 5: Criar Usuário Administrador (Opcional)

Se você quiser criar um usuário administrador:

1. Primeiro, crie um usuário normal através da interface da aplicação
2. No SQL Editor do Supabase, execute:
   ```sql
   UPDATE public.profiles 
   SET is_admin = true 
   WHERE id = 'UUID_DO_USUARIO_AQUI';
   ```

## Problemas Conhecidos Resolvidos

### ✅ URLs de API incorretas
- Removido todas as referências ao VITE_DATABASE_URL
- Removido referências ao Neon Database
- Aplicação agora usa apenas o cliente Supabase

### ✅ Endpoints antigos
- Removido chamadas para APIs customizadas
- Todas as operações agora usam o cliente Supabase

### ✅ Configurações de ambiente
- Simplificado para usar apenas:
  - SUPABASE_URL (já configurado no código)
  - SUPABASE_ANON_KEY (já configurado no código)

### ✅ Funções de carregamento
- Atualizadas para usar queries Supabase diretas
- Removido dependências do Drizzle ORM
- Simplificado o hook useDatabase

## Estrutura Final do Banco

### Schemas:
- **auth**: Gerenciado pelo Supabase (usuários, sessões)
- **config**: Produtos, categorias, opções, preços base
- **user_data**: Dados específicos de cada usuário
- **public**: Perfis de usuários

### Principais Tabelas:
- `config.product_categories`
- `config.products`
- `config.product_options`
- `config.base_prices`
- `public.profiles`
- `user_data.user_prices`
- `user_data.budget_settings`
- `user_data.credit_card_fees`
- `user_data.installation_fees`
- `user_data.budgets`
- `user_data.budget_items`
- `user_data.budget_observations`

## Próximos Passos

1. Testar todas as funcionalidades da aplicação
2. Verificar se os dados estão sendo salvos corretamente
3. Testar a autenticação e autorização
4. Verificar se as políticas RLS estão funcionando

## Suporte

Se encontrar problemas:
1. Verifique o console do navegador para erros
2. Verifique os logs do Supabase
3. Execute novamente os scripts de limpeza e configuração se necessário

## Nota sobre Segurança

A nova estrutura implementa Row Level Security (RLS) que garante:
- Usuários só acessam seus próprios dados
- Administradores podem gerenciar todos os dados
- Configurações de produtos são acessíveis a todos (apenas leitura) 