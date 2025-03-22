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
const sessionService_1 = require("./services/sessionService");
const voteService_1 = require("./services/voteService");
const sessionController_1 = require("./controllers/sessionController");
const socketHandler_1 = require("./socket/socketHandler");
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
const sessionService = new sessionService_1.SessionService();
const voteService = new voteService_1.VoteService();
const sessionController = new sessionController_1.SessionController(sessionService);
const socketHandler = new socketHandler_1.SocketHandler(io, sessionService, voteService);
app.use((0, cors_1.default)({
    origin: env === 'production' ? false : 'http://localhost:5173',
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
const router = express_1.default.Router();
router.post('/create-session', (req, res) => sessionController.createSession(req, res));
router.get('/sessions/:sessionId', (req, res) => sessionController.getSession(req, res));
router.post('/sessions/:sessionId/join', (req, res) => sessionController.joinSession(req, res));
router.get('/validate-session/:sessionId', (req, res) => sessionController.validateSession(req, res));
app.use('/api', router);
if (process.env.NODE_ENV === 'production') {
    app.use(express_1.default.static(path_1.default.join(__dirname, '../')));
    app.get('*', (_req, res) => {
        res.sendFile(path_1.default.join(__dirname, '../index.html'));
    });
}
io.on('connection', (socket) => socketHandler.handleConnection(socket));
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`${env} Server running on port ${PORT}`);
});
