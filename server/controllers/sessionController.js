"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionController = void 0;
class SessionController {
    constructor(sessionService) {
        Object.defineProperty(this, "sessionService", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: sessionService
        });
        Object.defineProperty(this, "createSession", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async (req, res) => {
                try {
                    const { sessionName, displayName, points, userId } = req.body;
                    if (!sessionName || !displayName || !points || !userId) {
                        res.status(400).json({ error: 'Missing required fields' });
                        return;
                    }
                    const sessionData = {
                        name: sessionName,
                        points: points,
                        users: { [userId]: displayName },
                        votes: {},
                        owner: userId,
                        storedResult: null,
                    };
                    const session = this.sessionService.createSession(sessionData);
                    res.status(201).json({
                        sessionId: session.id,
                        session,
                    });
                }
                catch (error) {
                    res.status(500).json({ error: 'Failed to create session' });
                }
            }
        });
        Object.defineProperty(this, "getSession", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async (req, res) => {
                try {
                    const { sessionId } = req.params;
                    const session = this.sessionService.getSession(sessionId);
                    if (!session) {
                        res.status(404).json({ error: 'Session not found' });
                        return;
                    }
                    res.json(session);
                }
                catch (error) {
                    res.status(500).json({ error: 'Failed to get session' });
                }
            }
        });
        Object.defineProperty(this, "joinSession", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async (req, res) => {
                try {
                    const { sessionId } = req.params;
                    const { userId, name } = req.body;
                    if (!userId || !name) {
                        res.status(400).json({ error: 'Missing required fields' });
                        return;
                    }
                    const success = this.sessionService.addUserToSession(sessionId, userId, name);
                    if (!success) {
                        res.status(404).json({ error: 'Session not found' });
                        return;
                    }
                    const session = this.sessionService.getSession(sessionId);
                    res.json(session);
                }
                catch (error) {
                    res.status(500).json({ error: 'Failed to join session' });
                }
            }
        });
        Object.defineProperty(this, "validateSession", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async (req, res) => {
                const { sessionId } = req.params;
                const session = this.sessionService.getSession(sessionId);
                if (!session) {
                    res.status(404).json({ error: 'Session not found' });
                }
                else {
                    res.json(session);
                }
            }
        });
    }
}
exports.SessionController = SessionController;
