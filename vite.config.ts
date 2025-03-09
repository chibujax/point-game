import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@components': path.resolve(__dirname, './src/components'),
			'@hooks': path.resolve(__dirname, './src/hooks'),
			'@pages': path.resolve(__dirname, './src/pages'),
			'@utils': path.resolve(__dirname, './src/utils'),
			'@types': path.resolve(__dirname, './src/types'),
			'@context': path.resolve(__dirname, './src/context'),
			'@stores': path.resolve(__dirname, './src/stores'),
			'@api': path.resolve(__dirname, './src/api'),
			'@assets': path.resolve(__dirname, './src/assets'),
		},
	},
	build: {
		outDir: 'dist',
		sourcemap: process.env.NODE_ENV !== 'production', // Only generate sourcemaps for development
		minify: 'terser', // Use terser for better minification (esbuild is the default)
		terserOptions: {
			compress: {
				drop_console: process.env.NODE_ENV === 'production', // Remove console.log in production
				drop_debugger: true,
			},
		},
		rollupOptions: {
			output: {
				manualChunks: {
					vendor: [
						'react',
						'react-dom',
						'react-router-dom',
						'socket.io-client',
						'zustand',
					],
				},
			},
		},
	},
	server: {
		proxy: {
			'/api': {
				target: 'http://localhost:3000',
				changeOrigin: true,
			},
			'/socket.io': {
				target: 'http://localhost:3000',
				ws: true,
			},
		},
	},
	test: {
		globals: true,
		environment: 'jsdom',
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			exclude: ['node_modules/', 'src/test/'],
		},
	},
});
