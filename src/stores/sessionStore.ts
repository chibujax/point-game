import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface User {
	id: string;
	name: string;
}

interface SessionState {
	id: string | null;
	name: string | null;
	users: User[];
	isOwner: boolean;
	points: number[];
	votes: Record<string, number>;
	errorMessage: string | null;
	setSession: (
		id: string,
		name: string,
		points: number[],
		userId: string,
		displayName: string,
		isOwner?: boolean,
	) => void;
	setOwner: (isOwner: boolean) => void;
	addUser: (user: User) => void;
	setUsers: (users: User[]) => void;
	removeUser: (userId: string) => void;
	setVote: (userId: string, vote: number) => void;
	setErrorMessage: (message: string | null) => void;
	clearVotes: () => void;
	reset: () => void;
}

const initialState = {
	id: null,
	name: null,
	users: [],
	isOwner: false,
	points: [],
	votes: {},
	errorMessage: null,
};

export const useSessionStore = create<SessionState>()(
	devtools(
		persist(
			(set) => ({
				...initialState,
				setSession: (id, displayName, points, userId, sessionName, isOwner = false) =>
					set(() => ({
						id,
						name: sessionName,
						points,
						users: [{ id: userId, name: displayName }],
						votes: {},
						isOwner: isOwner,
					})),
				setOwner: (isOwner: boolean) =>
					set((state) => ({
						...state,
						isOwner,
					})),
				setUsers: (users) => set({ users }),
				addUser: (user) =>
					set((state) => ({
						users: [...state.users, user],
					})),
				removeUser: (userId) =>
					set((state) => ({
						users: state.users.filter((u) => u.id !== userId),
						votes: Object.fromEntries(
							Object.entries(state.votes).filter(([id]) => id !== userId),
						),
					})),
				setErrorMessage: (errorMessage) => set((state) => ({ ...state, errorMessage })),
				setVote: (userId, vote) =>
					set((state) => ({
						votes: { ...state.votes, [userId]: vote },
					})),
				clearVotes: () => set((_state) => ({ votes: {} })),
				reset: () => set(initialState),
			}),
			{
				name: 'session-storage',
			},
		),
	),
);
