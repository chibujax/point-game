import { memo } from 'react';

export interface AdminControlProps {
	handleReveal: () => void;
	handleRestart: () => void;
	isRevealed: boolean;
	hasVote: boolean;
}

export const AdminControls = memo(
	({ handleReveal, handleRestart, isRevealed, hasVote }: AdminControlProps): JSX.Element => {
		return (
			<div className="d-flex justify-content-between">
				{!isRevealed && (
					<div id="revealBtn">
						<a href="#" onClick={handleReveal} className="btn btn-sm btn-info mb-0">
							Reveal
						</a>
					</div>
				)}
				{hasVote && (
					<a
						href="#"
						id="restart"
						onClick={handleRestart}
						className="btn btn-sm btn-dark float-right mb-0"
					>
						Restart
					</a>
				)}
			</div>
		);
	},
);

AdminControls.displayName = 'AdminControls';
