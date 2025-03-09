import React from 'react';

interface ButtonProps {
	onClick?: (e: React.FormEvent) => Promise<void>;
	children: React.ReactNode;
	variant?: 'primary' | 'secondary' | 'close';
	type?: 'button' | 'submit';
	wrapperClassName?: string;
	buttonClassName?: string;
	fullWidth?: boolean;
}

export const Button = ({
	onClick,
	children,
	variant = 'primary',
	type = 'button',
	wrapperClassName = 'text-center',
	buttonClassName = '',
	fullWidth = true,
}: ButtonProps): JSX.Element => (
	<div className={wrapperClassName}>
		<button
			onClick={onClick}
			type={type}
			className={`btn btn-${variant} ${fullWidth ? 'w-100' : ''} ${variant === 'close' ? '' : 'my-4'}  mb-2 ${buttonClassName}`.trim()}
		>
			{children}
		</button>
	</div>
);

Button.displayName = 'Button';
