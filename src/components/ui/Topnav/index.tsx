import { useSessionStore } from '@/stores/sessionStore';
import React, { useState, KeyboardEvent } from 'react';
interface TopNavProps {
	isAdmin: boolean;
	handleExit: () => void;
	handleTitleChange: (title: string) => void;
}

export const TopNav = ({ isAdmin, handleExit, handleTitleChange }: TopNavProps): JSX.Element => {
	const sessionStore = useSessionStore();
	const [titleInput, setTitleInput] = useState('');

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTitleInput(e.target.value);
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			submitTitle();
		}
	};

	const validateTitle = (title: string): { isValid: boolean; errorMessage: string | null } => {
		const trimmedTitle = title.trim();
		const validPattern = /^[a-zA-Z0-9_\-\.\s]+$/;
		const isValidLength = trimmedTitle.length >= 2 && trimmedTitle.length <= 30;
		
		if (!isValidLength) {
			return { 
				isValid: false, 
				errorMessage: "Title must be between 2 and 30 characters long" 
			};
		}
		
		if (!validPattern.test(trimmedTitle)) {
			return { 
				isValid: false, 
				errorMessage: "Title can only contain letters, numbers, underscores, hyphens, periods, and spaces" 
			};
		}
		
		return { isValid: true, errorMessage: null };
	};

	const submitTitle = () => {
		const trimmedTitle = titleInput.trim();
		const { isValid, errorMessage } = validateTitle(trimmedTitle);
		
		if (isValid && handleTitleChange) {
			handleTitleChange(trimmedTitle);
			setTitleInput('');
		} else if (errorMessage) {
			sessionStore.setErrorMessage(errorMessage);
		}
	};

	return (
		<nav className="navbar navbar-main navbar-expand-lg bg-transparent shadow-none position-absolute px-4 w-100 z-index-2 mt-n11">
			<div className="container-fluid py-1">
				<div className="collapse navbar-collapse me-md-0 me-sm-4 mt-sm-0 mt-2" id="navbar">
					{isAdmin && (
						<div className="ms-md-auto pe-md-3 d-flex align-items-center">
							<div id="titleChange" className="input-group">
								<span className="input-group-text text-body">
									<i className="fas fa-edit" aria-hidden="true"></i>
								</span>
								<input
									type="text"
									id="voteTitle"
									className="form-control"
									placeholder="Change title..."
									value={titleInput}
									onChange={handleInputChange}
									onKeyDown={handleKeyDown}
								/>
							</div>
						</div>
					)}
					<ul className={`navbar-nav ${isAdmin ? 'justify-content-end' : 'ms-auto'}`}>
						<li className="nav-item d-flex align-items-center">
							<a
								href="#"
								onClick={handleExit}
								className="nav-link text-white font-weight-bold px-0"
							>
								<i className="fa fa-user me-sm-1"></i>
								<span className="d-sm-inline">Leave</span>
							</a>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	);
};