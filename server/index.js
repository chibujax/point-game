"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const fileSessionService_1 = require("./services/fileSessionService");
const voteService_1 = require("./services/voteService");
const sessionController_1 = require("./controllers/sessionController");
const socketHandler_1 = require("./socket/socketHandler");
const validationMiddleware_1 = require("./middleware/validationMiddleware");
const securityMiddleware_1 = require("./middleware/securityMiddleware");
const errorMiddleware_1 = require("./middleware/errorMiddleware");
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const env = process.env.NODE_ENV;
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: env === 'production' ? false : 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true,
    },
});
const sessionService = new fileSessionService_1.FileSessionService();
const voteService = new voteService_1.VoteService();
const sessionController = new sessionController_1.SessionController(sessionService);
const socketHandler = new socketHandler_1.SocketHandler(io, sessionService, voteService);
app.use(securityMiddleware_1.securityHeaders);
app.use((0, cors_1.default)({
    origin: env === 'production' ? false : 'http://localhost:5173',
    credentials: true,
}));
app.use(express_1.default.json({ limit: '100kb' }));
app.use((0, cookie_parser_1.default)());
app.use(securityMiddleware_1.sanitizeRequest);
app.use(securityMiddleware_1.basicValidation);
const router = express_1.default.Router();
const apiLimiter = (0, securityMiddleware_1.rateLimit)(60000, 30);
router.post('/create-session', apiLimiter, validationMiddleware_1.validateCreateSession, sessionController.createSession);
router.get('/sessions/:sessionId', apiLimiter, validationMiddleware_1.validateSessionId, sessionController.getSession);
router.post('/sessions/:sessionId/join', apiLimiter, validationMiddleware_1.validateSessionId, validationMiddleware_1.validateJoinSession, sessionController.joinSession);
router.get('/validate-session/:sessionId', apiLimiter, validationMiddleware_1.validateSessionId, sessionController.validateSession);
app.use('/api', router);
if (process.env.NODE_ENV === 'production') {
    app.use(express_1.default.static(path_1.default.join(__dirname, '../')));
    app.get('*', (_req, res) => {
        res.sendFile(path_1.default.join(__dirname, '../index.html'));
    });
}
app.use(errorMiddleware_1.notFoundHandler);
app.use(errorMiddleware_1.globalErrorHandler);
io.on('connection', (socket) => socketHandler.handleConnection(socket));
process.on('SIGINT', () => {
    console.log('Server shutting down');
    process.exit(0);
});
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`${env} Server running on port ${PORT}`);
});
