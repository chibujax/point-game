export enum VotingType {
	NUMERICAL = 'numerical',
	ALPHABETICAL = 'alphabetical', 
	DECIMAL = 'decimal',
	ALPHANUMERICAL = 'alphanumerical'
}

export interface User {
	id: string;
	name: string;
}

export interface Vote {
	[userId: string]: string; 
}

export interface Session {
	id: string;
	name: string;
	users: { [userId: string]: string };
	votes: Vote;
	points: string[];
	votingType: VotingType;
	owner: string;
	voteTitle?: string;
	storedResult: VoteResults | null;
}

export interface VoteResults {
	votes: Vote;
	average: number | null;
	averageDisplay: string;
	highestVotes: {
		value: string[];
		voters: Array<{ [userId: string]: string }>;
	};
	lowestVotes: {
		value: string[];
		voters: Array<{ [userId: string]: string }>;
	};
	otherVotes: Array<{ [userId: string]: string }>;
	totalVoters: number;
}

export interface SocketEvents {
	setUserId: (userId: string) => void;
	sessionError: (message: string) => void;
	userList: (users: [string, string][]) => void;
	updatePoints: (points: string[]) => void;
	voteReceived: (userId: string) => void;
	revealVotes: (results: VoteResults) => void;
	sessionEnded: () => void;
	sessionName: (name: string) => void;
	updateOwner: (owner: string) => void;
	updateVoteTitle: (title: string) => void;
}
