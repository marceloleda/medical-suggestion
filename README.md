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

**Documentação completa:** [DOCKER.md](./DOCKER.md)

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
├── DOCKER.md
└── README.md
```

---

## Funcionalidades Planejadas

### Fase 1 - Setup Inicial ✅
- [x] Estrutura do projeto
- [x] Configuração Docker
- [x] Schema do banco de dados

### Fase 2 - Autenticação
- [ ] Registro de médicos
- [ ] Login/Logout
- [ ] Proteção de rotas

### Fase 3 - Gravação de Consultas
- [ ] Gravação de áudio
- [ ] Upload para S3/R2
- [ ] Transcrição via Whisper

### Fase 4 - Diagnóstico IA
- [ ] Análise de transcrição
- [ ] Geração de sugestões
- [ ] Confirmação pelo médico

### Fase 5 - Dashboard
- [ ] Listagem de consultas
- [ ] Visualização de diagnósticos
- [ ] Relatórios

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

## Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

---

## Licença

Este projeto é privado e confidencial.

---

## Suporte

Para dúvidas sobre:
- **Docker:** Veja [DOCKER.md](./DOCKER.md)
- **Desenvolvimento:** Consulte a documentação inline
- **Issues:** Abra uma issue no repositório

---

## Roadmap

- [ ] Implementar autenticação completa
- [ ] Sistema de gravação de áudio
- [ ] Integração com Whisper API
- [ ] Integração com GPT-4 para diagnósticos
- [ ] Dashboard com analytics
- [ ] Exportação de relatórios
- [ ] Modo offline
- [ ] App mobile (React Native)

---

**Status:** 🚧 Em desenvolvimento ativo

**Última atualização:** 2025
