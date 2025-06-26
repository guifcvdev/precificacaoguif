# Sistema de Precificação - GUIF Comunicação Visual

Sistema de precificação para serviços de comunicação visual. Calcule preços de adesivos, lonas, placas, fachadas, luminosos e muito mais de forma rápida e precisa.

## Sobre o Projeto

Este sistema foi desenvolvido para facilitar a precificação de serviços na área de comunicação visual, oferecendo:

- ✨ Calculadoras específicas para diferentes tipos de produtos
- 📊 Configuração personalizada de preços e margens
- 💾 Persistência de dados via Supabase
- 📱 Interface responsiva e moderna
- 🔧 Configurações avançadas de impostos e taxas

## Funcionalidades Principais

### Calculadoras Disponíveis
- **Adesivo**: Corte especial, laminado, perfurado, imantado
- **Lona**: Banner/faixa, backlight, reforços e ilhós
- **Placas**: PS (1mm/2mm), ACM
- **Fachada Simples**: Com estrutura metálica e materiais
- **Letra Caixa**: Dimensionamento personalizado
- **Luminoso**: LED, tubular, fontes chaveadas
- **Vidro**: Diferentes tipos e espessuras

### Gerenciamento
- Configuração de preços base
- Gestão de observações de orçamento
- Configuração de impostos e taxas
- Histórico de orçamentos

## Tecnologias Utilizadas

- **Frontend**: React + TypeScript + Vite
- **UI**: shadcn-ui + Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Deploy**: Plataforma de hosting personalizada

## Como Executar o Projeto

### Pré-requisitos
- Node.js 18+ e npm instalados

### Instalação

1. Clone o repositório:
```bash
git clone <URL_DO_REPOSITORIO>
cd precificacaoguif
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
# Crie um arquivo .env.local com suas credenciais do Supabase
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_publica_do_supabase
```

4. Execute o projeto em modo de desenvolvimento:
```bash
npm run dev
```

5. Acesse em: `http://localhost:8080`

### Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run build:dev    # Build em modo desenvolvimento
npm run preview      # Preview do build de produção
npm run lint         # Verificação de código
```

## Configuração do Banco de Dados

O projeto utiliza Supabase como backend. Para configurar:

1. Crie um projeto no [Supabase](https://supabase.com)
2. Execute os scripts SQL da pasta `supabase/`
3. Configure as variáveis de ambiente
4. Execute as migrações necessárias

Consulte os arquivos `README-DATABASE.md` e `README-SUPABASE-CONFIG.md` para mais detalhes.

## Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── calculators/    # Calculadoras específicas
│   ├── settings/       # Configurações
│   └── ui/            # Componentes de interface
├── hooks/             # Custom hooks
├── lib/               # Bibliotecas e utilitários
├── pages/             # Páginas da aplicação
├── services/          # Serviços de API
└── types/             # Definições TypeScript
```

## Licença

Este projeto é propriedade da GUIF Comunicação Visual.

## Contato

Para suporte ou dúvidas, entre em contato através do site oficial da GUIF Comunicação Visual.
