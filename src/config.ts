const DEFAULT_API_URL = 'http://localhost:3000';
const DEFAULT_WS_URL = 'http://localhost:3000';

export const config = {
	apiUrl:
		process.env.NODE_ENV === 'production'
			? import.meta.env.VITE_API_URL || DEFAULT_API_URL
			: DEFAULT_API_URL,

	wsUrl:
		process.env.NODE_ENV === 'production'
			? import.meta.env.VITE_WS_URL || DEFAULT_WS_URL
			: DEFAULT_WS_URL,
} as const;

export type Config = typeof config;
