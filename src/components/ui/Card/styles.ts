import styled, { css } from 'styled-components';

interface CardProps {
	elevation?: 'low' | 'medium' | 'high';
	padding?: 'none' | 'small' | 'medium' | 'large';
	interactive?: boolean;
}

const elevationStyles = {
	low: css`
		box-shadow: 0 2px 4px var(--shadow-color);
	`,
	medium: css`
		box-shadow: 0 4px 8px var(--shadow-color);
	`,
	high: css`
		box-shadow: 0 8px 16px var(--shadow-color);
	`,
};

const paddingStyles = {
	none: css`
		padding: 0;
	`,
	small: css`
		padding: 12px;
	`,
	medium: css`
		padding: 20px;
	`,
	large: css`
		padding: 32px;
	`,
};

export const StyledCard = styled.div<CardProps>`
	background: white;
	border-radius: 8px;
	transition:
		transform 0.2s ease,
		box-shadow 0.2s ease;

	${({ elevation = 'low' }) => elevationStyles[elevation]}
	${({ padding = 'medium' }) => paddingStyles[padding]}
  
  ${({ interactive }) =>
		interactive &&
		css`
			cursor: pointer;
			&:hover {
				transform: translateY(-2px);
				${elevationStyles.medium}
			}
		`}
`;

export const CardHeader = styled.div`
	margin-bottom: 16px;
`;

export const CardTitle = styled.h3`
	margin: 0;
	color: var(--text-color);
	font-size: 1.25rem;
	font-weight: 500;
`;

export const CardContent = styled.div``;
