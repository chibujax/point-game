export const theme = {
	colors: {
		primary: '#28a745',
		primaryHover: '#218838',
		secondary: '#6c757d',
		danger: '#e74c3c',
		warning: '#ffc107',
		success: '#28a745',
		background: '#f4f5f7',
		text: '#333',
		textLight: '#666',
		border: '#ddd',
		shadow: 'rgba(0, 0, 0, 0.2)',
	},
	spacing: {
		xs: '0.25rem',
		sm: '0.5rem',
		md: '1rem',
		lg: '1.5rem',
		xl: '2rem',
	},
	breakpoints: {
		mobile: '320px',
		tablet: '768px',
		desktop: '1024px',
		wide: '1280px',
	},
	typography: {
		fontFamily: "'Roboto', -apple-system, sans-serif",
		sizes: {
			xs: '0.75rem',
			sm: '0.875rem',
			base: '1rem',
			lg: '1.125rem',
			xl: '1.25rem',
			'2xl': '1.5rem',
		},
		weights: {
			normal: 400,
			medium: 500,
			bold: 700,
		},
	},
	animation: {
		duration: '0.2s',
		timing: 'ease-in-out',
	},
	borderRadius: {
		sm: '4px',
		md: '8px',
		lg: '12px',
		full: '9999px',
	},
} as const;
