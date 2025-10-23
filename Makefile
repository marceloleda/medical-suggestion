.PHONY: help dev up down restart logs build clean migrate prisma-studio db-reset backend-shell frontend-shell postgres-shell

# Cores para output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[0;33m
NC := \033[0m # No Color

help: ## Mostra esta mensagem de ajuda
	@echo "$(BLUE)Comandos disponíveis:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2}'

dev: ## Inicia todos os serviços em modo desenvolvimento (com hot-reload)
	@echo "$(BLUE)Iniciando ambiente de desenvolvimento...$(NC)"
	docker-compose up -d
	@echo "$(GREEN)✓ Ambiente iniciado!$(NC)"
	@echo "$(YELLOW)Frontend: http://localhost:3000$(NC)"
	@echo "$(YELLOW)Backend:  http://localhost:3001$(NC)"
	@echo "$(YELLOW)PostgreSQL: localhost:5432$(NC)"

up: dev ## Alias para 'dev'

down: ## Para todos os containers
	@echo "$(BLUE)Parando containers...$(NC)"
	docker-compose down
	@echo "$(GREEN)✓ Containers parados$(NC)"

restart: ## Reinicia todos os containers
	@echo "$(BLUE)Reiniciando containers...$(NC)"
	docker-compose restart
	@echo "$(GREEN)✓ Containers reiniciados$(NC)"

logs: ## Mostra logs de todos os serviços
	docker-compose logs -f

logs-backend: ## Mostra logs apenas do backend
	docker-compose logs -f backend

logs-frontend: ## Mostra logs apenas do frontend
	docker-compose logs -f frontend

logs-db: ## Mostra logs do PostgreSQL
	docker-compose logs -f postgres

build: ## Reconstrói as imagens Docker
	@echo "$(BLUE)Reconstruindo imagens...$(NC)"
	docker-compose build
	@echo "$(GREEN)✓ Imagens reconstruídas$(NC)"

rebuild: ## Reconstrói e reinicia todos os containers
	@echo "$(BLUE)Reconstruindo e reiniciando...$(NC)"
	docker-compose up -d --build
	@echo "$(GREEN)✓ Reconstruído e reiniciado$(NC)"

clean: ## Remove containers, volumes e imagens
	@echo "$(YELLOW)⚠ Isto irá remover todos os containers, volumes e dados!$(NC)"
	@read -p "Tem certeza? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		docker-compose down -v --rmi local; \
		echo "$(GREEN)✓ Ambiente limpo$(NC)"; \
	else \
		echo "$(BLUE)Operação cancelada$(NC)"; \
	fi

migrate: ## Executa migrations do Prisma
	@echo "$(BLUE)Executando migrations...$(NC)"
	docker-compose exec backend npx prisma migrate dev
	@echo "$(GREEN)✓ Migrations executadas$(NC)"

migrate-deploy: ## Executa migrations em produção (sem prompts)
	@echo "$(BLUE)Executando migrations (deploy)...$(NC)"
	docker-compose exec backend npx prisma migrate deploy
	@echo "$(GREEN)✓ Migrations executadas$(NC)"

prisma-generate: ## Gera Prisma Client
	@echo "$(BLUE)Gerando Prisma Client...$(NC)"
	docker-compose exec backend npx prisma generate
	@echo "$(GREEN)✓ Prisma Client gerado$(NC)"

prisma-studio: ## Abre Prisma Studio (GUI para banco de dados)
	@echo "$(BLUE)Abrindo Prisma Studio...$(NC)"
	@echo "$(YELLOW)Prisma Studio: http://localhost:5555$(NC)"
	docker-compose exec backend npx prisma studio

db-reset: ## Reseta o banco de dados (CUIDADO: apaga todos os dados!)
	@echo "$(YELLOW)⚠ Isto irá apagar TODOS os dados do banco!$(NC)"
	@read -p "Tem certeza? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		docker-compose exec backend npx prisma migrate reset; \
		echo "$(GREEN)✓ Banco resetado$(NC)"; \
	else \
		echo "$(BLUE)Operação cancelada$(NC)"; \
	fi

backend-shell: ## Acessa shell do container backend
	docker-compose exec backend sh

frontend-shell: ## Acessa shell do container frontend
	docker-compose exec frontend sh

postgres-shell: ## Acessa shell do PostgreSQL
	docker-compose exec postgres psql -U medical_admin -d medical_ai_db

install-backend: ## Instala dependências do backend
	docker-compose exec backend npm install

install-frontend: ## Instala dependências do frontend
	docker-compose exec frontend npm install

status: ## Mostra status dos containers
	docker-compose ps

stats: ## Mostra estatísticas de uso dos containers
	docker stats medical-ai-backend medical-ai-frontend medical-ai-postgres
