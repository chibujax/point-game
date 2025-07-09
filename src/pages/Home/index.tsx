import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Card, FormInput, CenteredContainer } from '@/components/ui/';
import { PageLayout } from '@/components/layout/PageLayout';
import { HomeHeader } from '@/components/layout/Header';
import { useUserStore } from '@/stores/userStore';
import { useSessionStore } from '@/stores/sessionStore';
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

const validatePoints = (value: string): ValidationType => {
	if (!value) return 'Points are required';
	if (!/^\d+(?:,\d+)*$/.test(value)) {
		return 'Points must be numbers separated by commas (e.g., 1,2,3)';
	}
	const points = value.split(',').map((p) => p.trim());
	const isValid = points.every((p) => /^\d+$/.test(p));
	if (!isValid) return 'Points must be single letters separated by commas';
	return undefined;
};

const inputValidator: Record<FormField, (value: string) => ValidationType> = {
	sessionName: validateSessionName,
	displayName: validateDisplayName,
	points: validatePoints,
};

interface FormData {
	sessionName: string;
	displayName: string;
	points: string;
}

type FormErrors = Partial<Record<FormField, string>>;

const HomePage = (): JSX.Element => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState<FormData>({
		sessionName: '',
		displayName: '',
		points: '',
	});
	const [errors, setErrors] = useState<FormErrors>({});
	const [submitError, setSubmitError] = useState('');
	const { setUser, userId } = useUserStore();
	const sessionStore = useSessionStore();

	const validateForm = (): boolean => {
		const newErrors: FormErrors = {
			sessionName: validateSessionName(formData.sessionName),
			displayName: validateDisplayName(formData.displayName),
			points: validatePoints(formData.points),
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
			const pointsArray = formData.points.split(',').map((p) => parseInt(p.trim()));
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
			setErrors((prev) => ({ ...prev, [id]: inputValidator[id](value) }));
		}
	};

	// Type guard to ensure id is a valid form field
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
								<FormInput
									type="text"
									id="points"
									placeholder="Enter voting points (comma separated)"
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
