import React from 'react';
import { VotingType } from '@/types';

interface VotingTypeSelectorProps {
	value: VotingType;
	onChange: (votingType: VotingType) => void;
	disabled?: boolean;
	className?: string;
}

const votingTypeOptions = [
	{ value: VotingType.NUMERICAL, label: 'Numerical (1,2,3)', description: 'Whole numbers only' },
	{ value: VotingType.DECIMAL, label: 'Decimal (1.0,2.5,3.0)', description: 'Decimal numbers' },
	{ value: VotingType.ALPHABETICAL, label: 'Alphabetical (A,B,C)', description: 'Letters only' },
	{ value: VotingType.ALPHANUMERICAL, label: 'Alphanumerical (4,S,M,L)', description: 'Letters and numbers' },
];

export const VotingTypeSelector: React.FC<VotingTypeSelectorProps> = ({
	value,
	onChange,
	disabled = false,
	className = 'form-control',
}) => {
	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		onChange(e.target.value as VotingType);
	};

	return (
		<div className="mb-3">
			<label className="form-label">Voting Type</label>
			<select
				className={className}
				value={value}
				onChange={handleChange}
				disabled={disabled}
			>
				{votingTypeOptions.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
			<div className="form-text">
				{votingTypeOptions.find(opt => opt.value === value)?.description}
			</div>
		</div>
	);
};

export default VotingTypeSelector;
