# Início Rápido - Medical AI

## Setup com Docker (Recomendado) 🚀

### 1. Configure suas API Keys

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite e adicione suas keys
nano .env  # ou use seu editor preferido
```

Adicione no arquivo `.env`:
```env
OPENAI_API_KEY=sk-sua-key-aqui
AWS_ACCESS_KEY_ID=sua-access-key
AWS_SECRET_ACCESS_KEY=sua-secret-key
```

### 2. Inicie o Ambiente

```bash
# Inicia PostgreSQL, Backend e Frontend
make dev
```

Aguarde alguns segundos até ver:
```
✓ Ambiente iniciado!
Frontend: http://localhost:3000
Backend:  http://localhost:3001
PostgreSQL: localhost:5432
```

### 3. Execute as Migrations do Banco

```bash
make migrate
```

### 4. Pronto! 🎉

Acesse:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001/api
- **Prisma Studio:** `make prisma-studio` (GUI do banco)

---

## Comandos Essenciais

```bash
make dev              # Iniciar tudo
make logs             # Ver logs em tempo real
make down             # Parar containers
make restart          # Reiniciar
make prisma-studio    # Abrir GUI do banco
make help             # Ver todos os comandos
```

---

## Hot-Reload Funciona! 🔥

Você pode editar:
- **Backend:** Arquivos em `backend/src/`
- **Frontend:** Arquivos em `frontend/app/`, `frontend/components/`, etc.

As mudanças serão detectadas automaticamente!

---

## Troubleshooting

### "Port already in use"
```bash
# Parar containers conflitantes
make down

# Ou verificar o que está usando a porta
sudo lsof -i :3000  # Frontend
sudo lsof -i :3001  # Backend
sudo lsof -i :5432  # PostgreSQL
```

### Migrations falham
```bash
# Aguarde o PostgreSQL estar pronto
docker-compose logs postgres

# Tente novamente
make migrate
```

### Recomeçar do zero
```bash
# Para tudo e limpa volumes
make clean

# Inicia novamente
make dev
make migrate
```

---

## Próximos Passos

1. ✅ Configure `.env` com suas API keys
2. ✅ Execute `make dev`
3. ✅ Execute `make migrate`
4. 🚧 Comece a implementar funcionalidades!

**Consulte [DOCKER.md](./DOCKER.md) para documentação completa.**
