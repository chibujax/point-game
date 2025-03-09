import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { SessionService } from './services/sessionService';
import { VoteService } from './services/voteService';
import { SessionController } from './controllers/sessionController';
import { SocketHandler } from './socket/socketHandler';

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

const sessionService = new SessionService();
const voteService = new VoteService();
const sessionController = new SessionController(sessionService);
const socketHandler = new SocketHandler(io, sessionService, voteService);

app.use(
	cors({
		origin: env === 'production' ? false : 'http://localhost:5173',
		credentials: true,
	}),
);
app.use(express.json());
app.use(cookieParser());

const router = express.Router();
router.post('/create-session', (req, res) => sessionController.createSession(req, res));
router.get('/sessions/:sessionId', (req, res) => sessionController.getSession(req, res));
router.post('/sessions/:sessionId/join', (req, res) => sessionController.joinSession(req, res));
router.get('/validate-session/:sessionId', (req, res) =>
	sessionController.validateSession(req, res),
);

app.use('/api', router);

if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, '../')));
	app.get('*', (_req, res) => {
		res.sendFile(path.join(__dirname, '../index.html'));
	});
}

io.on('connection', (socket) => socketHandler.handleConnection(socket));

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
	console.log(`${env} Server running on port ${PORT}`);
});
