import React from 'react';
import styled from 'styled-components';

interface VoteCardProps {
	value: number;
	isSelected?: boolean;
	onClick?: (value: number) => void;
	disabled?: boolean;
}

const Card = styled.button<{ isSelected: boolean }>`
	background: ${({ isSelected }) => (isSelected ? 'var(--primary-color)' : 'white')};
	color: ${({ isSelected }) => (isSelected ? 'white' : 'var(--text-color)')};
	border: 2px solid ${({ isSelected }) => (isSelected ? 'var(--primary-color)' : '#ddd')};
	border-radius: 8px;
	padding: 16px 24px;
	font-size: 1.5rem;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s ease;

	&:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 2px 8px var(--shadow-color);
	}

	&:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
`;

export const VoteCard = React.memo(
	({ value, isSelected = false, onClick, disabled = false }: VoteCardProps) => {
		const handleClick: React.MouseEventHandler<HTMLButtonElement> = () => {
			if (!disabled && onClick) {
				onClick(value);
			}
		};

		return (
			<Card isSelected={isSelected} onClick={handleClick} disabled={disabled} type="button">
				{value}
			</Card>
		);
	},
);

VoteCard.displayName = 'VoteCard';
