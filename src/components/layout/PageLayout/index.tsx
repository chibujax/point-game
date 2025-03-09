import React from 'react';
import Footer from '../Footer';

interface PageLayoutProps {
	children: React.ReactNode;
	sessionId?: string;
	sessionName?: string;
	onLeave?: () => void;
}

export const PageLayout = React.memo(({ children }: PageLayoutProps) => {
	return (
		<main>
			{children}
			<Footer />
		</main>
	);
});

PageLayout.displayName = 'PageLayout';
