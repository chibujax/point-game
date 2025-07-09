import { Socket } from 'socket.io';
import { FileSessionService } from '../services/fileSessionService';

export interface SocketAuthData {
  userId: string;
  sessionId?: string;
}

export const socketAuth = (socket: Socket, next: (err?: Error) => void): void => {
  const userId = socket.handshake.query.userId as string;
  
  if (!userId || typeof userId !== 'string') {
    return next(new Error('Authentication error: Missing or invalid userId'));
  }
  socket.data.userId = userId;
  next();
};

export const verifySessionMembership = (
  sessionService: FileSessionService,
  userId: string,
  sessionId: string
): boolean => {
  const session = sessionService.getSession(sessionId);
  return !!session?.users[userId];
};

export const verifySessionOwnership = (
  sessionService: FileSessionService,
  userId: string,
  sessionId: string
): boolean => {
  const session = sessionService.getSession(sessionId);
  return session?.owner === userId;
};

export const requireSessionMembership = (
  sessionService: FileSessionService,
  socket: Socket,
  handler: (...args: any[]) => void
) => {
  return (...args: any[]) => {
    const userId = socket.data.userId;
    const sessionId = findSessionForUser(sessionService, userId);
    
    if (!sessionId || !verifySessionMembership(sessionService, userId, sessionId)) {
      socket.emit('error', 'Access denied: You are not a member of this session');
      return;
    }
    
    handler(...args);
  };
};

export const requireSessionOwnership = (
  sessionService: FileSessionService,
  socket: Socket,
  handler: (...args: any[]) => void
) => {
  return (...args: any[]) => {
    const userId = socket.data.userId;
    const sessionId = findSessionForUser(sessionService, userId);
    
    if (!sessionId || !verifySessionOwnership(sessionService, userId, sessionId)) {
      socket.emit('error', 'Access denied: You are not the owner of this session');
      return;
    }
    
    handler(...args);
  };
};

const findSessionForUser = (sessionService: FileSessionService, userId: string): string | null => {
  for (const [sessionId, session] of sessionService.allSessions.entries()) {
    if (session.users[userId]) {
      return sessionId;
    }
  }
  return null;
};
