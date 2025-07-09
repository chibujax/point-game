const DEFAULT_API_URL = 'http://localhost:3000';
const DEFAULT_WS_URL = 'http://localhost:3000';

export const config = {
	apiUrl:
		process.env.NODE_ENV === 'production'
			? window.location.origin
			: DEFAULT_API_URL,

	wsUrl:
		process.env.NODE_ENV === 'production'
			? window.location.origin
			: DEFAULT_WS_URL,
} as const;