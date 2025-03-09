import React from 'react';
import styled from 'styled-components';
import { Button } from '../../ui/Button';
import { User, Vote } from '@/types';

interface UserBoardProps {
	points: number[];
	users: User[];
	votes?: Vote;
	isRevealed: boolean;
	currentUserId: string;
	selectedVote: number | null;
	onVote: (point: number) => void;
	votedUsers: string[];
}

const VotingArea = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
	margin-bottom: 20px;
`;

export const UserBoard: React.FC<UserBoardProps> = ({
	points,
	users,
	selectedVote,
	onVote,
	votedUsers,
}) => {
	return (
		<div className="col-md-8">
			<div className="card" style={{ minHeight: '30vh' }}>
				<div className="card-body">
					<VotingArea>
						{points.map((point) => (
							<Button
								key={point}
								onClick={async () => onVote(point)}
								variant={selectedVote === point ? 'primary' : 'secondary'}
								buttonClassName={`btn ${
									selectedVote === point
										? 'bg-gradient-success'
										: 'bg-gradient-secondary'
								} btn-sm`}
							>
								{point}
							</Button>
						))}
					</VotingArea>

					<div className="row" id="users">
						{users.map((user) => (
							<div key={user.id} className="col-xl-3 col-sm-6 mb-4">
								<div
									className={`card ${votedUsers.includes(user.id) ? 'bg-gradient-success' : 'bg-gradient-info'} move-on-hover`}
									id={`${user.id}`}
								>
									<div className="card-body">
										<div className="d-flex">
											<h5 className="mb-0 text-white" id={`${user.id}name`}>
												{user.name}
											</h5>
											<div className="ms-auto">
												<h6 className="text-white text-end mb-0 mt-n2"></h6>
											</div>
										</div>
										<p className="text-white mb-0" id={`${user.id}score`}></p>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

UserBoard.displayName = 'UserBoard';
