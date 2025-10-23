# Medical AI - Sistema de Sugestão de Diagnósticos

Sistema fullstack para gravação de consultas médicas, transcrição via IA e sugestão de diagnósticos.

## Stack Tecnológico

### Backend
- Node.js + TypeScript
- Express.js
- Prisma ORM
- PostgreSQL
- OpenAI API (Whisper + GPT-4)
- AWS S3 / Cloudflare R2
- JWT Authentication

### Frontend
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Zustand (State Management)
- React Hook Form + Zod

## Começando

### Opção 1: Docker (Recomendado) 🐳

O jeito mais fácil de começar é usando Docker com hot-reload automático:

```bash
# 1. Configurar variáveis de ambiente
cp .env.example .env
# Edite .env e adicione suas API keys

# 2. Iniciar ambiente
make dev

# 3. Executar migrations
make migrate

# 4. Acessar aplicação
# Frontend: http://localhost:3000
# Backend:  http://localhost:3001
```

**Comandos úteis:**
- `make help` - Ver todos os comandos
- `make logs` - Ver logs
- `make prisma-studio` - GUI do banco de dados
- `make down` - Parar containers

---

### Opção 2: Desenvolvimento Local

#### Pré-requisitos
- Node.js 20+
- PostgreSQL 16+
- npm ou yarn

#### Backend

```bash
cd backend

# Instalar dependências
npm install

# Configurar .env
cp .env.example .env
# Edite .env com suas credenciais

# Executar migrations
npm run prisma:migrate
npm run prisma:generate

# Iniciar servidor
npm run dev
# → http://localhost:3001
```

#### Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Configurar .env.local
cp .env.local.example .env.local

# Iniciar servidor
npm run dev
# → http://localhost:3000
```

---

## Estrutura do Projeto

```
medical-ai-app/
├── backend/
│   ├── src/
│   │   ├── config/          # Configurações
│   │   ├── controllers/     # Controllers
│   │   ├── middlewares/     # Middlewares (auth, etc)
│   │   ├── routes/          # Rotas da API
│   │   ├── services/        # Lógica de negócio
│   │   ├── utils/           # Utilitários
│   │   └── types/           # TypeScript types
│   ├── prisma/
│   │   └── schema.prisma    # Schema do banco
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── app/
│   │   ├── (auth)/          # Rotas de autenticação
│   │   └── (dashboard)/     # Rotas protegidas
│   ├── components/
│   │   ├── ui/              # Componentes shadcn/ui
│   │   ├── layout/          # Layout components
│   │   ├── forms/           # Formulários
│   │   └── audio/           # Gravação de áudio
│   ├── lib/
│   │   ├── api/             # Cliente API
│   │   └── validations/     # Schemas Zod
│   ├── hooks/               # Custom hooks
│   ├── types/               # TypeScript types
│   ├── store/               # Zustand stores
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
├── Makefile
└── README.md
```

---

## Funcionalidades

**Implementado:**
- ✅ Autenticação JWT com cookies HTTP-only
- ✅ Registro e login de médicos
- ✅ Proteção de rotas
- ✅ Persistência de sessão

**Em desenvolvimento:**
- Gravação de consultas com áudio
- Transcrição automática (Whisper API)
- Sugestões de diagnóstico (GPT-4)
- Dashboard de consultas

---

## Modelos do Banco de Dados

### User
- Médicos e administradores
- CRM obrigatório
- Autenticação via JWT

### Consultation
- Dados do paciente
- Gravação de áudio
- Transcrição
- Status da consulta

### Diagnosis
- Sintomas identificados
- Diagnóstico preliminar
- Recomendações
- Exames sugeridos

---

## Variáveis de Ambiente

### Docker (.env na raiz)
```env
OPENAI_API_KEY=sua_key
AWS_ACCESS_KEY_ID=sua_key
AWS_SECRET_ACCESS_KEY=sua_secret
```

### Backend (backend/.env)
```env
DATABASE_URL=postgresql://...
JWT_SECRET=seu_secret
OPENAI_API_KEY=sua_key
AWS_ACCESS_KEY_ID=sua_key
```

### Frontend (frontend/.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

---

## Scripts Disponíveis

### Com Docker (Makefile)
- `make dev` - Inicia desenvolvimento
- `make migrate` - Executa migrations
- `make logs` - Ver logs
- `make prisma-studio` - GUI do banco

### Backend (npm)
- `npm run dev` - Servidor dev (hot-reload)
- `npm run build` - Build TypeScript
- `npm start` - Servidor produção
- `npm run prisma:migrate` - Migrations
- `npm run prisma:studio` - Prisma Studio

### Frontend (npm)
- `npm run dev` - Servidor dev
- `npm run build` - Build produção
- `npm start` - Servidor produção

---

## Tecnologias e Bibliotecas

### Backend
- **express** - Framework web
- **prisma** - ORM
- **bcryptjs** - Hash de senhas
- **jsonwebtoken** - Autenticação JWT
- **zod** - Validação de dados
- **multer** - Upload de arquivos
- **openai** - API OpenAI (Whisper/GPT)
- **aws-sdk** - AWS S3
- **helmet** - Segurança
- **morgan** - Logs HTTP

### Frontend
- **next** - Framework React
- **tailwindcss** - Estilização
- **shadcn/ui** - Componentes UI
- **axios** - Cliente HTTP
- **react-hook-form** - Formulários
- **zod** - Validação
- **zustand** - State management
- **lucide-react** - Ícones

---

---

## Desenvolvimento

Comandos úteis durante o desenvolvimento:

```bash
make logs              # Ver logs de todos os serviços
make prisma-studio     # Abrir interface gráfica do banco
make backend-shell     # Acessar shell do container backend
make db-reset          # Resetar banco (cuidado!)
```

---

## Próximos Passos

- Gravador de áudio no frontend (botão gravar/parar)
- Upload de áudio para S3/Cloudflare R2
- Transcrição automática via Whisper
- Análise de sintomas e sugestões de diagnóstico com GPT-4
- Listagem e filtros de consultas anteriores
- Exportar histórico em PDF

---

Status: Em desenvolvimento
