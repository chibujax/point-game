import styled, { css } from 'styled-components';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
	variant: ButtonVariant;
	size: ButtonSize;
	fullWidth?: boolean;
	disabled?: boolean;
}

const sizeStyles = {
	small: css`
		padding: 8px 16px;
		font-size: 14px;
	`,
	medium: css`
		padding: 12px 20px;
		font-size: 16px;
	`,
	large: css`
		padding: 16px 24px;
		font-size: 18px;
	`,
};

const variantStyles = {
	primary: css`
		background: var(--primary-color);
		color: white;
		&:hover:not(:disabled) {
			background: var(--primary-hover);
		}
	`,
	secondary: css`
		background: transparent;
		border: 2px solid var(--primary-color);
		color: var(--primary-color);
		&:hover:not(:disabled) {
			background: var(--primary-color);
			color: white;
		}
	`,
	danger: css`
		background: var(--error-color);
		color: white;
		&:hover:not(:disabled) {
			opacity: 0.9;
		}
	`,
	ghost: css`
		background: transparent;
		color: var(--primary-color);
		&:hover:not(:disabled) {
			background: rgba(40, 167, 69, 0.1);
		}
	`,
};

export const StyledButton = styled.button<ButtonProps>`
	border: none;
	border-radius: 4px;
	font-weight: 500;
	transition: all 0.2s ease-in-out;
	cursor: pointer;
	outline: none;
	width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};

	${({ size }) => sizeStyles[size]}
	${({ variant }) => variantStyles[variant]}

  &:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	&:focus {
		box-shadow: 0 0 0 2px var(--primary-color);
	}
`;
