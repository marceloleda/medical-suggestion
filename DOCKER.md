# Desenvolvimento com Docker

Este projeto está totalmente configurado para desenvolvimento com Docker, incluindo **hot-reload automático** para backend e frontend.

## Pré-requisitos

- Docker (versão 20.10+)
- Docker Compose (versão 2.0+)

## Início Rápido

### 1. Configurar Variáveis de Ambiente

Copie o arquivo de exemplo e configure suas variáveis:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e preencha:
- `OPENAI_API_KEY` - Sua chave da OpenAI
- `AWS_ACCESS_KEY_ID` e `AWS_SECRET_ACCESS_KEY` - Credenciais AWS (se usar S3)

### 2. Iniciar o Ambiente

```bash
# Opção 1: Usando Make (recomendado)
make dev

# Opção 2: Docker Compose direto
docker-compose up -d
```

### 3. Executar Migrations do Banco de Dados

```bash
# Primeira vez ou quando houver novas migrations
make migrate

# Ou usando docker-compose direto
docker-compose exec backend npx prisma migrate dev
```

### 4. Acessar a Aplicação

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **PostgreSQL:** localhost:5432
- **Prisma Studio:** `make prisma-studio` → http://localhost:5555

---

## Comandos Disponíveis (Makefile)

Execute `make help` para ver todos os comandos disponíveis.

### Comandos Principais

```bash
make dev              # Inicia ambiente de desenvolvimento
make down             # Para todos os containers
make restart          # Reinicia containers
make logs             # Mostra logs de todos os serviços
make logs-backend     # Logs apenas do backend
make logs-frontend    # Logs apenas do frontend
```

### Gerenciamento do Banco

```bash
make migrate          # Executa migrations
make prisma-studio    # Abre Prisma Studio (GUI do banco)
make db-reset         # Reseta banco (APAGA TODOS OS DADOS!)
make postgres-shell   # Acessa shell do PostgreSQL
```

### Build e Limpeza

```bash
make build            # Reconstrói imagens Docker
make rebuild          # Reconstrói e reinicia containers
make clean            # Remove containers, volumes e dados
```

### Shells dos Containers

```bash
make backend-shell    # Shell do container backend
make frontend-shell   # Shell do container frontend
make postgres-shell   # Shell do PostgreSQL
```

### Utilitários

```bash
make status           # Status dos containers
make stats            # Estatísticas de uso (CPU/RAM)
make install-backend  # Instala dependências do backend
make install-frontend # Instala dependências do frontend
```

---

## Hot-Reload (Desenvolvimento)

### Backend (Node.js + TypeScript)

O backend usa **volumes bind mount** para código-fonte:

- Arquivos em `./backend/src` são sincronizados com `/app/src` no container
- Mudanças no código são detectadas automaticamente por `tsx watch`
- O servidor reinicia automaticamente após mudanças

### Frontend (Next.js)

O frontend usa **volumes bind mount** para código-fonte:

- Pastas `app/`, `components/`, `lib/`, etc. são sincronizadas
- Next.js detecta mudanças automaticamente
- Hot Module Replacement (HMR) funciona normalmente

### Importante sobre node_modules

Os `node_modules` são mantidos em **volumes nomeados** para evitar conflitos entre host e container. Isso significa:

- Você NÃO precisa rodar `npm install` localmente
- As dependências ficam isoladas dentro do container
- Melhor performance, especialmente no Windows/Mac

---

## Estrutura dos Containers

### Backend
- **Imagem:** Node 20 Alpine
- **Porta:** 3001
- **Comando:** `npm run dev` (tsx watch)
- **Volumes:**
  - `./backend/src` → `/app/src`
  - `./backend/prisma` → `/app/prisma`
  - `backend_node_modules` (volume nomeado)

### Frontend
- **Imagem:** Node 20 Alpine
- **Porta:** 3000
- **Comando:** `npm run dev`
- **Volumes:**
  - `./frontend/app`, `./frontend/components`, etc.
  - `frontend_node_modules` (volume nomeado)
  - `frontend_next` (volume nomeado para cache)

### PostgreSQL
- **Imagem:** PostgreSQL 16 Alpine
- **Porta:** 5432
- **Usuário:** medical_admin
- **Senha:** medical_dev_2024
- **Banco:** medical_ai_db
- **Volume:** `postgres_data` (persistente)

---

## Troubleshooting

### Migrations falham

```bash
# Verificar se o banco está pronto
docker-compose logs postgres

# Recriar banco
make db-reset
```

### Hot-reload não funciona

```bash
# Reiniciar containers
make restart

# Se persistir, reconstruir
make rebuild
```

### Erro de permissões

```bash
# Limpar volumes e reconstruir
make clean
make dev
make migrate
```

### Container não inicia

```bash
# Ver logs
make logs

# Verificar status
make status

# Reconstruir do zero
docker-compose down -v
docker-compose up -d --build
```

### Porta já em uso

Se as portas 3000, 3001 ou 5432 já estiverem em uso, edite `docker-compose.yml`:

```yaml
ports:
  - "3001:3001"  # Mude para "3002:3001" por exemplo
```

---

## Adicionando Novas Dependências

### Backend

```bash
# Entrar no container
make backend-shell

# Instalar dependência
npm install nome-do-pacote

# Sair do container
exit
```

O `package.json` será atualizado no host automaticamente.

### Frontend

```bash
# Entrar no container
make frontend-shell

# Instalar dependência
npm install nome-do-pacote

# Sair
exit
```

---

## Build para Produção

Os Dockerfiles têm **multi-stage builds**:

### Backend (Produção)

```bash
docker build -t medical-ai-backend:prod --target production ./backend
docker run -p 3001:3001 medical-ai-backend:prod
```

### Frontend (Produção)

```bash
docker build -t medical-ai-frontend:prod --target production ./frontend
docker run -p 3000:3000 medical-ai-frontend:prod
```

---

## Dicas

1. **Sempre use `make dev` ao invés de `docker-compose up`** (mais claro)
2. **Use `make logs` para debugar problemas**
3. **Nunca commite o arquivo `.env`** (já está no .gitignore)
4. **Use `make prisma-studio` para visualizar dados** (melhor que SQL direto)
5. **Para limpar tudo:** `make clean && make dev && make migrate`

---

## Variáveis de Ambiente

### Raiz do Projeto (.env)
Usadas pelo `docker-compose.yml`:
- `OPENAI_API_KEY`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `AWS_BUCKET_NAME`

### Backend (backend/.env)
Não é necessário para Docker (valores vêm do docker-compose).
Útil para desenvolvimento local sem Docker.

### Frontend (frontend/.env.local)
- `NEXT_PUBLIC_API_URL=http://localhost:3001/api`

---

## Diferença: Docker vs Local

| Aspecto | Docker | Local |
|---------|--------|-------|
| PostgreSQL | Automático | Precisa instalar |
| Configuração | Zero config | Precisa configurar tudo |
| Isolamento | Total | Pode conflitar |
| Performance | Boa | Melhor |
| Portabilidade | 100% | Depende do SO |

**Recomendação:** Use Docker para desenvolvimento em equipe e consistência.

---

## Próximos Passos

1. Configurar suas API keys no `.env`
2. Executar `make dev`
3. Executar `make migrate`
4. Começar a desenvolver! 🚀
