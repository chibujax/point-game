import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Card, FormInput, CenteredContainer } from '@/components/ui/';
import { PageLayout } from '@/components/layout/PageLayout';
import { HomeHeader } from '@/components/layout/Header';
import { useUserStore } from '@/stores/userStore';
import { useSessionStore } from '@/stores/sessionStore';
import { VotingType } from '@/types';
import mediacity from '@/assets/images/mediacity.jpg';

type ValidationType = string | undefined;
type FormField = 'sessionName' | 'displayName' | 'points';

const validateSessionName = (value: string): ValidationType => {
	if (!value || value.length < 3) return 'Session name must be at least 3 characters';
	if (!/^[a-zA-Z0-9\s]+$/.test(value)) return 'Only letters, numbers and spaces allowed';
	return undefined;
};

const validateDisplayName = (value: string): ValidationType => {
	if (!value || value.length < 3) return 'Display name must be at least 3 characters';
	if (!/^[a-zA-Z0-9]+$/.test(value)) return 'Only letters and numbers allowed';
	return undefined;
};

const validatePoints = (value: string, votingType: VotingType): ValidationType => {
	if (!value) return 'Points are required';
	
	const points = value.split(',').map(p => p.trim()).filter(p => p);
	if (points.length === 0) return 'At least one point is required';
	
	const isValid = points.every(p => {
		switch (votingType) {
			case VotingType.NUMERICAL:
				return /^[0-9]+$/.test(p);
			case VotingType.DECIMAL:
				return /^[0-9]+(\.[0-9]+)?$/.test(p);
			case VotingType.ALPHABETICAL:
				return /^[a-zA-Z]+$/.test(p);
			case VotingType.ALPHANUMERICAL:
				return /^[a-zA-Z0-9]+$/.test(p);
			default:
				return false;
		}
	});
	
	if (!isValid) {
		switch (votingType) {
			case VotingType.NUMERICAL:
				return 'Points must be whole numbers (e.g., 1,2,3)';
			case VotingType.DECIMAL:
				return 'Points must be decimal numbers (e.g., 1.0,2.5,3.0)';
			case VotingType.ALPHABETICAL:
				return 'Points must be letters only (e.g., A,B,C)';
			case VotingType.ALPHANUMERICAL:
				return 'Points must be letters and numbers (e.g., A1,B2,C3)';
		}
	}
	
	return undefined;
};

const inputValidator: Record<FormField, (value: string, votingType?: VotingType) => ValidationType> = {
	sessionName: validateSessionName,
	displayName: validateDisplayName,
	points: (value: string, votingType: VotingType = VotingType.NUMERICAL) => validatePoints(value, votingType),
};

interface FormData {
	sessionName: string;
	displayName: string;
	points: string;
	votingType: VotingType;
}

type FormErrors = Partial<Record<FormField, string>>;

const getPlaceholderText = (votingType: VotingType): string => {
	switch (votingType) {
		case VotingType.NUMERICAL:
			return 'Enter voting points (e.g., 1,2,3,5,8)';
		case VotingType.DECIMAL:
			return 'Enter voting points (e.g., 1.0,2.5,3.0,5.5)';
		case VotingType.ALPHABETICAL:
			return 'Enter voting points (e.g., A,B,C,D)';
		case VotingType.ALPHANUMERICAL:
			return 'Enter voting points (4,S,M,L,XL)';
	}
};

const HomePage = (): JSX.Element => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState<FormData>({
		sessionName: '',
		displayName: '',
		points: '',
		votingType: VotingType.NUMERICAL,
	});
	const [errors, setErrors] = useState<FormErrors>({});
	const [submitError, setSubmitError] = useState('');
	const { setUser, userId } = useUserStore();
	const sessionStore = useSessionStore();

	const validateForm = (): boolean => {
		const newErrors: FormErrors = {
			sessionName: validateSessionName(formData.sessionName),
			displayName: validateDisplayName(formData.displayName),
			points: validatePoints(formData.points, formData.votingType),
		};

		setErrors(newErrors);
		return !Object.values(newErrors).some((error) => error !== undefined);
	};

	const handleSubmit = async (e: React.FormEvent): Promise<void> => {
		e.preventDefault();
		setSubmitError('');

		if (!validateForm()) {
			setSubmitError('Error Submitting form.');
			return;
		}

		try {
			const pointsArray = formData.points.split(',').map((p) => p.trim());
			sessionStore.reset();
			setUser(formData.displayName);
			const response = await fetch('/api/create-session', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					...formData,
					points: pointsArray,
					userId: userId,
				}),
			});

			if (!response.ok) {
				throw new Error('Failed to create session');
			}

			const data = await response.json();
			sessionStore.setSession(
				data.sessionId,
				formData.sessionName,
				pointsArray,
				userId || '',
				formData.displayName,
				true,
				formData.votingType,
			);
			navigate(`/${data.sessionId}`);
		} catch (error) {
			setSubmitError('Failed to create session. Please try again.');
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const { id, value } = e.target;
		if (isFormField(id)) {
			setFormData((prev) => ({ ...prev, [id]: value }));
			setErrors((prev) => ({ ...prev, [id]: inputValidator[id](value, formData.votingType) }));
		}
	};

	const handleVotingTypeChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
		const newVotingType = e.target.value as VotingType;
		setFormData((prev) => ({ ...prev, votingType: newVotingType, points: '' }));
		setErrors((prev) => ({ ...prev, points: undefined }));
	};

	const isFormField = (id: string): id is FormField => {
		return id in inputValidator;
	};

	return (
		<PageLayout>
			<main className="main-content mt-0">
				<HomeHeader backgroundImage={mediacity} />
				<div className="container">
					<CenteredContainer>
						<Card>
							<form>
								<FormInput
									type="text"
									id="sessionName"
									placeholder="Enter session name"
									value={formData.sessionName}
									onChange={handleChange}
									inputClassName={`form-control ${errors.sessionName ? 'is-invalid' : ''}`}
									wrapperClassName={`mb-3 ${errors.sessionName ? 'has-danger' : ''}`}
								/>
								<FormInput
									type="text"
									id="displayName"
									placeholder="Enter your name"
									value={formData.displayName}
									onChange={handleChange}
									inputClassName={`form-control ${errors.displayName ? 'is-invalid' : ''}`}
									wrapperClassName={`mb-3 ${errors.displayName ? 'has-danger' : ''}`}
								/>
								<div className="mb-3">
									<select
										className="form-control"
										value={formData.votingType}
										onChange={handleVotingTypeChange}
									>
										<option value={VotingType.NUMERICAL}>Numerical (1,2,3)</option>
										<option value={VotingType.DECIMAL}>Decimal (1.0,2.5,3.0)</option>
										<option value={VotingType.ALPHABETICAL}>Alphabetical (A,B,C)</option>
										<option value={VotingType.ALPHANUMERICAL}>Alphanumerical (4,S,M,L)</option>
									</select>
								</div>
								<FormInput
									type="text"
									id="points"
									placeholder={getPlaceholderText(formData.votingType)}
									value={formData.points}
									onChange={handleChange}
									inputClassName={`form-control ${errors.points ? 'is-invalid' : ''}`}
									wrapperClassName={`mb-3 ${errors.points ? 'has-danger' : ''}`}
								/>
								{submitError && (
									<Alert variant="danger" title="Error!" message={submitError} />
								)}
								<Button onClick={handleSubmit}>Submit</Button>
							</form>
						</Card>
					</CenteredContainer>
				</div>
			</main>
		</PageLayout>
	);
};

export default HomePage;
