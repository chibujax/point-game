import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

interface UserState {
	userId: string | null;
	displayName: string | null;
	currentSession: string | null;
	isOwner: boolean;
	setUser: (displayName: string) => void;
	setSession: (sessionId: string, isOwner: boolean) => void;
	clear: () => void;
}

const generateUserId = (): string => {
	const existingId = localStorage.getItem('userId');
	if (existingId) return existingId;
	const newId = uuidv4();
	localStorage.setItem('userId', newId);
	return newId;
};

export const useUserStore = create<UserState>()(
	persist(
		(set) => ({
			userId: generateUserId(),
			displayName: localStorage.getItem('displayName'),
			currentSession: null,
			isOwner: false,
			setUser: (displayName: string) => set({ displayName }),
			setSession: (sessionId: string, isOwner: boolean) =>
				set({ currentSession: sessionId, isOwner }),
			clear: () => set({ currentSession: null, isOwner: false }),
		}),
		{
			name: 'user-storage',
		},
	),
);
