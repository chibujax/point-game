import React, { useState } from 'react';
import { Button, Card, FormInput, CenteredContainer } from '@/components/ui/';
import { PageLayout } from '@/components/layout/PageLayout';
import { HomeHeader } from '@/components/layout/Header';
import mediacity from '@/assets/images/mediacity.jpg';

interface JoinSessionProps {
	onJoin: (name: string) => void;
}

type FormError = string | undefined;

const validateDisplayName = (value: string): FormError => {
	if (!value || value.length < 3) return 'Display name must be at least 3 characters';
	if (!/^[a-zA-Z0-9]+$/.test(value)) return 'Only letters and numbers allowed';
	return undefined;
};

export const JoinSession = React.memo(({ onJoin }: JoinSessionProps) => {
	const [name, setName] = useState('');
	const [error, setError] = useState<FormError>('');

	const handleSubmit = async (e: React.FormEvent): Promise<void> => {
		e.preventDefault();
		const validationError = validateDisplayName(name);
		if (validationError === undefined) {
			onJoin(name.trim());
		} else {
			setError(validationError);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const { value } = e.target;
		setName(value);
		setError(validateDisplayName(value));
	};

	return (
		<PageLayout>
			<main className="main-content mt-0">
				<HomeHeader
					backgroundImage={mediacity}
					description="Enter display name to continue"
				/>
				<div className="container mt-7">
					<CenteredContainer>
						<Card>
							<form onSubmit={handleSubmit}>
								<FormInput
									type="text"
									id="displayName"
									placeholder="Enter your name"
									value={name}
									onChange={handleChange}
									inputClassName={`form-control ${error ? 'is-invalid' : ''}`}
									wrapperClassName={`mb-3 ${error ? 'has-danger' : ''}`}
								/>
								<Button buttonClassName="my-4 mb-2" fullWidth={false} type="submit">
									Submit
								</Button>
							</form>
						</Card>
					</CenteredContainer>
				</div>
			</main>
		</PageLayout>
	);
});

JoinSession.displayName = 'JoinSession';
