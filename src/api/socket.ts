import { Session } from '../types';

const API_BASE = '/api';

interface CreateSessionParams {
	sessionName: string;
	displayName: string;
	points: number[];
	userId: string;
}

interface CreateSessionResponse {
	sessionId: string;
	userId: string;
	session: Session;
}

interface APIError {
	message: string;
	status: number;
}

async function handleResponse<T>(response: Response): Promise<T> {
	if (!response.ok) {
		const error = (await response.json().catch(() => null)) as Partial<APIError>;
		throw new Error(error?.message ?? 'An unknown error occurred');
	}

	return response.json() as Promise<T>;
}

export async function createSession(params: CreateSessionParams): Promise<CreateSessionResponse> {
	const response = await fetch(`${API_BASE}/create-session`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(params),
	});

	return handleResponse<CreateSessionResponse>(response);
}

export async function getSession(sessionId: string): Promise<Session> {
	const response = await fetch(`${API_BASE}/sessions/${sessionId}`);
	return handleResponse<Session>(response);
}

export async function updateVoteTitle(sessionId: string, title: string): Promise<void> {
	const response = await fetch(`${API_BASE}/sessions/${sessionId}/title`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ title }),
	});

	await handleResponse<void>(response);
}
