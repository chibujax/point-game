import { useCallback } from 'react';
import { useSocket } from '../context/SocketContext';
import { useSessionStore } from '../stores/sessionStore';
import { User, VotingType } from '@/types';

interface SessionValue {
	session: {
		id: string | null;
		name: string | null;
		users: User[];
		isOwner: boolean;
		points: string[];
		votingType: VotingType;
	};
	start: (
		sessionId: string,
		displayName: string,
		points: string[],
		userId: string,
		sessionName: string,
		isOwner?: boolean,
		votingType?: VotingType,
	) => void;
	leave: () => void;
	end: () => void;
	updateUsers: (users: Array<[string, string]>) => void;
	setOwner: (isOwner: boolean) => void;
}

export const useSession = (): SessionValue => {
	const { joinSession, leaveSession, endSession } = useSocket();
	const sessionStore = useSessionStore();

	const start = useCallback(
		(
			sessionId: string,
			displayName: string,
			points: string[],
			userId: string,
			sessionName: string,
			isOwner?: boolean,
			votingType?: VotingType,
		) => {
			sessionStore.setSession(sessionId, displayName, points, userId, sessionName, isOwner, votingType);
			joinSession(sessionId, displayName);
		},
		[joinSession, sessionStore],
	);

	const leave = useCallback(() => {
		leaveSession();
		sessionStore.reset();
	}, [leaveSession, sessionStore]);

	const end = useCallback(() => {
		if (sessionStore.isOwner) {
			endSession();
		}
	}, [endSession, sessionStore.isOwner]);

	const updateUsers = useCallback(
		(users: Array<[string, string]>) => {
			users.forEach(([id, name]) => {
				sessionStore.addUser({ id, name });
			});
		},
		[sessionStore],
	);

	const setOwner = useCallback(
		(isOwner: boolean) => {
			sessionStore.setOwner(isOwner);
		},
		[sessionStore],
	);

	return {
		session: {
			id: sessionStore.id,
			name: sessionStore.name,
			users: sessionStore.users,
			isOwner: sessionStore.isOwner,
			points: sessionStore.points,
			votingType: sessionStore.votingType,
		},
		start,
		leave,
		end,
		updateUsers,
		setOwner,
	};
};
