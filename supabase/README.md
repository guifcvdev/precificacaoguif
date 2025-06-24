# Instruções para Configuração do Banco de Dados Supabase

Este diretório contém scripts SQL para configurar o banco de dados Supabase do projeto.

## Ordem de Execução

Os scripts devem ser executados na seguinte ordem:

1. `schema_setup.sql` - Configuração inicial (schemas e extensões)
2. `tables_products.sql` - Tabelas de produtos e configurações
3. `tables_user_data.sql` - Tabelas de dados de usuários
4. `tables_budgets.sql` - Tabelas de orçamentos
5. `policies.sql` - Políticas de segurança (RLS)
6. `functions.sql` - Funções auxiliares
7. `seed_initial_data.sql` - Dados iniciais

Alternativamente, você pode executar o script `main.sql`, que importa todos os scripts acima na ordem correta.

## Como Executar

1. Faça login no painel de controle do Supabase
2. Vá para a seção "SQL Editor"
3. Crie um novo script SQL
4. Cole o conteúdo do script `main.sql` ou dos scripts individuais
5. Execute o script

## Notas Importantes

- Os scripts utilizam `IF NOT EXISTS` para evitar erros ao reexecutar
- Para adicionar um usuário administrador, descomente e edite a última linha do script `seed_initial_data.sql`
- Após executar os scripts, verifique se as políticas de segurança estão funcionando corretamente
- Ao criar novos usuários no Supabase, o trigger `on_auth_user_created` inicializará automaticamente os dados do usuário

## Solução de Problemas

Se encontrar erros durante a execução dos scripts:

1. Verifique se os scripts estão sendo executados na ordem correta
2. Verifique se não há tabelas com o mesmo nome em schemas diferentes
3. Verifique se as extensões necessárias estão instaladas
4. Se necessário, execute `DROP SCHEMA config CASCADE; DROP SCHEMA user_data CASCADE;` para limpar o banco de dados e começar novamente 