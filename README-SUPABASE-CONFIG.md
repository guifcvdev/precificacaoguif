# Configuração do Supabase

## ⚠️ PROBLEMA IDENTIFICADO
A aplicação está tentando acessar uma URL inválida do Supabase, causando erros de conexão (`net::ERR_NAME_NOT_RESOLVED`).

## 🔧 SOLUÇÃO

### 1. Criar conta no Supabase (se não tiver)
- Acesse: https://supabase.com/dashboard
- Crie uma conta gratuita
- Crie um novo projeto

### 2. Obter credenciais do projeto
1. No dashboard do Supabase, selecione seu projeto
2. Vá em **Settings** > **API**
3. Copie os seguintes valores:
   - **Project URL** (exemplo: `https://abcdefgh.supabase.co`)
   - **anon public** key (chave longa que começa com `eyJ...`)

### 3. Configurar variáveis de ambiente
1. Copie o arquivo `.env.example` para `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edite o arquivo `.env.local` e substitua os valores:
   ```env
   VITE_SUPABASE_URL=https://seu-projeto-real.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-real-aqui
   ```

### 4. Configurar banco de dados
Execute os scripts SQL na seguinte ordem no SQL Editor do Supabase:

1. `supabase/cleanup_database_safe.sql` (se necessário limpar)
2. `supabase/setup_complete_fixed.sql` (configuração completa)

### 5. Reiniciar aplicação
```bash
npm run dev
```

## ✅ Verificação
Após a configuração, a aplicação deve:
- Conectar com sucesso ao Supabase
- Carregar observações e configurações
- Exibir mensagens de sucesso nos testes de conexão

## 🚨 Erros Comuns
- **net::ERR_NAME_NOT_RESOLVED**: URL do Supabase incorreta
- **401 Unauthorized**: Chave de API incorreta
- **403 Forbidden**: Problemas de RLS (Row Level Security)
- **404 Not Found**: Tabelas não criadas no banco 