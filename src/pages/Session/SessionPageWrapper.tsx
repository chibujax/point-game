import { SocketProvider } from '@/context/SocketContext';
import SessionPage from '.';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/stores/userStore';
import { useSessionStore } from '@/stores/sessionStore';
import { useVoteStore } from '@/stores/voteStore';
import { VoteResults } from '@/types';

const SessionPageWrapper = (): JSX.Element => {
	const navigate = useNavigate();
	const clearUser = useUserStore((state) => state.clear);
	const resetSession = useSessionStore((state) => state.reset);
	const setErrorMessage = useSessionStore((state) => state.setErrorMessage);
	const setVoteTitle = useSessionStore((state) => state.setVoteTitle);
	const resetVote = useVoteStore((state) => state.reset);
	const setUsers = useSessionStore((state) => state.setUsers);

	const handleSessionEnd = (): void => {
		clearUser();
		resetSession();
		resetVote();
		localStorage.removeItem('session-storage');
		localStorage.removeItem('user-storage');
		navigate('/');
	};

	const handleUserUpdate = (users: Array<[string, string]>): void => {
		const userObjects = users.map(([id, name]) => ({ id, name }));
		setUsers(userObjects);
	};

	const handleVoteUpdate = (votedUsers: string[]): void => {
		useVoteStore.getState().setVotedUsers(votedUsers);
	};

	const handleVoteReveal = (results: VoteResults): void => {
		useVoteStore.getState().setResults(results);
	};

	const handleVoteTitleChange = (title: string): void => {
		setVoteTitle(title);
	};

	return (
		<SocketProvider
			onSessionEnd={handleSessionEnd}
			onVoteUpdate={handleVoteUpdate}
			onUserUpdate={handleUserUpdate}
			onVoteReveal={handleVoteReveal}
			onVoteTitleChange={handleVoteTitleChange}
			onError={setErrorMessage}
		>
			<SessionPage />
		</SocketProvider>
	);
};

export default SessionPageWrapper;