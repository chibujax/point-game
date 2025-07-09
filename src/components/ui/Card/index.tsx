import React from 'react';
interface CardProps {
	children: React.ReactNode;
	cardClassName?: string;
	bodyClassName?: string;
}

export const Card = ({
	children,
	cardClassName = 'card z-index-0',
	bodyClassName = 'card-body',
}: CardProps): JSX.Element => (
	<div className={cardClassName}>
		<div className={bodyClassName}>{children}</div>
	</div>
);
