export interface User {
	id: string;
	name: string;
}

export interface Vote {
	[userId: string]: number;
}

export interface Session {
	id: string;
	name: string;
	users: { [userId: string]: string };
	votes: Vote;
	points: number[];
	owner: string;
	voteTitle?: string;
	storedResult: VoteResults | null;
}

export interface VoteResults {
	votes: Vote;
	average: number;
	highestVotes: {
		value: number[];
		voters: Array<{ [userId: string]: number }>;
	};
	lowestVotes: {
		value: number[];
		voters: Array<{ [userId: string]: number }>;
	};
	otherVotes: Array<{ [userId: string]: number }>;
	totalVoters: number;
}

export interface SocketEvents {
	setUserId: (userId: string) => void;
	sessionError: (message: string) => void;
	userList: (users: [string, string][]) => void;
	updatePoints: (points: number[]) => void;
	voteReceived: (userId: string) => void;
	revealVotes: (results: VoteResults) => void;
	sessionEnded: () => void;
	sessionName: (name: string) => void;
	updateOwner: (owner: string) => void;
	updateVoteTitle: (title: string) => void;
}
