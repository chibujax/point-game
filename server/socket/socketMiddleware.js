"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireSessionOwnership = exports.requireSessionMembership = exports.verifySessionOwnership = exports.verifySessionMembership = exports.socketAuth = void 0;
const socketAuth = (socket, next) => {
    const userId = socket.handshake.query.userId;
    if (!userId || typeof userId !== 'string') {
        return next(new Error('Authentication error: Missing or invalid userId'));
    }
    socket.data.userId = userId;
    next();
};
exports.socketAuth = socketAuth;
const verifySessionMembership = (sessionService, userId, sessionId) => {
    const session = sessionService.getSession(sessionId);
    return !!session?.users[userId];
};
exports.verifySessionMembership = verifySessionMembership;
const verifySessionOwnership = (sessionService, userId, sessionId) => {
    const session = sessionService.getSession(sessionId);
    return session?.owner === userId;
};
exports.verifySessionOwnership = verifySessionOwnership;
const requireSessionMembership = (sessionService, socket, handler) => {
    return (...args) => {
        const userId = socket.data.userId;
        const sessionId = findSessionForUser(sessionService, userId);
        if (!sessionId || !(0, exports.verifySessionMembership)(sessionService, userId, sessionId)) {
            socket.emit('error', 'Access denied: You are not a member of this session');
            return;
        }
        handler(...args);
    };
};
exports.requireSessionMembership = requireSessionMembership;
const requireSessionOwnership = (sessionService, socket, handler) => {
    return (...args) => {
        const userId = socket.data.userId;
        const sessionId = findSessionForUser(sessionService, userId);
        if (!sessionId || !(0, exports.verifySessionOwnership)(sessionService, userId, sessionId)) {
            socket.emit('error', 'Access denied: You are not the owner of this session');
            return;
        }
        handler(...args);
    };
};
exports.requireSessionOwnership = requireSessionOwnership;
const findSessionForUser = (sessionService, userId) => {
    for (const [sessionId, session] of sessionService.allSessions.entries()) {
        if (session.users[userId]) {
            return sessionId;
        }
    }
    return null;
};
