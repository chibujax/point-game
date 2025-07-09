import React from 'react';

interface FormInputProps {
	type: string;
	id: string;
	placeholder: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	ariaLabel?: string;
	wrapperClassName?: string;
	inputClassName?: string;
}

export const FormInput = ({
	type,
	id,
	placeholder,
	value,
	onChange,
	ariaLabel,
	wrapperClassName = 'mb-3',
	inputClassName = 'form-control',
}: FormInputProps): JSX.Element => (
	<div className={wrapperClassName}>
		<input
			type={type}
			className={inputClassName}
			id={id}
			placeholder={placeholder}
			aria-label={ariaLabel || placeholder}
			value={value}
			onChange={onChange}
		/>
	</div>
);
