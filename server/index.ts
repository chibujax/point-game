import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { FileSessionService } from './services/fileSessionService';
import { VoteService } from './services/voteService';
import { SessionController } from './controllers/sessionController';
import { SocketHandler } from './socket/socketHandler';
import { validateCreateSession, validateJoinSession, validateSessionId } from './middleware/validationMiddleware';
import { rateLimit, sanitizeRequest, securityHeaders, basicValidation } from './middleware/securityMiddleware';
import { globalErrorHandler, notFoundHandler } from './middleware/errorMiddleware';

const app = express();
const httpServer = createServer(app);
const env = process.env.NODE_ENV;
const io = new Server(httpServer, {
	cors: {
		origin: env === 'production' ? false : 'http://localhost:5173',
		methods: ['GET', 'POST'],
		credentials: true,
	},
});

const sessionService = new FileSessionService();
const voteService = new VoteService();
const sessionController = new SessionController(sessionService);
const socketHandler = new SocketHandler(io, sessionService, voteService);

app.use(securityHeaders);
app.use(
	cors({
		origin: env === 'production' ? false : 'http://localhost:5173',
		credentials: true,
	}),
);
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());
app.use(sanitizeRequest);
app.use(basicValidation);


const router = express.Router();
const apiLimiter = rateLimit(60000, 30); 

router.post('/create-session', apiLimiter, validateCreateSession, sessionController.createSession);
router.get('/sessions/:sessionId', apiLimiter, validateSessionId, sessionController.getSession);
router.post('/sessions/:sessionId/join', apiLimiter, validateSessionId, validateJoinSession, sessionController.joinSession);
router.get('/validate-session/:sessionId', apiLimiter, validateSessionId, sessionController.validateSession);

app.use('/api', router);

if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, '../')));
	app.get('*', (_req, res) => {
		res.sendFile(path.join(__dirname, '../index.html'));
	});
}

app.use(notFoundHandler);
app.use(globalErrorHandler);

io.on('connection', (socket) => socketHandler.handleConnection(socket));

process.on('SIGINT', () => {
	console.log('Server shutting down');
	process.exit(0);
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
	console.log(`${env} Server running on port ${PORT}`);
});
