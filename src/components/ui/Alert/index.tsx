import { Button } from '../Button';
interface AlertProps {
	variant?:
		| 'primary'
		| 'secondary'
		| 'info'
		| 'success'
		| 'danger'
		| 'warning'
		| 'light'
		| 'dark';
	title?: string;
	message: string;
	dismissible?: boolean;
	icon?: string;
	show?: boolean;
	onDismiss?: () => void;
	className?: string;
}

export const Alert = ({
	variant = 'primary',
	title,
	message,
	dismissible = true,
	icon = 'ni ni-like-2',
	show = true,
	onDismiss,
	className = '',
}: AlertProps): JSX.Element => {
	if (!show) return <></>;

	const handleDismiss = async (): Promise<void> => {
		if (onDismiss) {
			onDismiss();
		} else {
			const alertElement = document.querySelector('.alert');
			alertElement?.classList.remove('show');
			alertElement?.remove();
		}
	};

	return (
		<div
			className={`alert text-white alert-${variant} ${dismissible ? 'alert-dismissible fade show' : ''} ${className}`.trim()}
			role="alert"
		>
			{icon && (
				<span className="alert-icon">
					<i className={icon}></i>
				</span>
			)}
			<span className="alert-text">
				{title && <strong>{title}</strong>} {message}
			</span>
			{dismissible && (
				<Button
					variant="close"
					onClick={handleDismiss}
					wrapperClassName=""
					buttonClassName="btn-close"
					aria-label="Close"
					fullWidth={false}
				>
					<span aria-hidden="true">&times;</span>
				</Button>
			)}
		</div>
	);
};
