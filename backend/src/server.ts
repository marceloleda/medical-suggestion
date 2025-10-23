import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/auth.routes';
import consultationRoutes from './routes/consultation.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares globais
app.use(helmet());

// CORS configurado para desenvolvimento (aceita qualquer porta do localhost)
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Permite requisições sem origin (como Postman, curl, etc)
    if (!origin) {
      return callback(null, true);
    }

    // Em desenvolvimento, aceita qualquer localhost
    if (process.env.NODE_ENV === 'development') {
      if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
        return callback(null, true);
      }
    }

    // Em produção, verifica a origin específica
    const allowedOrigin = process.env.CORS_ORIGIN;
    if (allowedOrigin && origin === allowedOrigin) {
      return callback(null, true);
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser()); // Parser de cookies (necessário para ler req.cookies)
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '..' ,'uploads')));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/consultations', consultationRoutes);

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rota 404
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Error handler global
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erro:', err);
  res.status(err.statusCode || 500).json({
    error: err.message || 'Erro interno do servidor',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📝 Ambiente: ${process.env.NODE_ENV || 'development'}`);
});
