import React, { useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
	Overlay,
	ModalContainer,
	ModalHeader,
	ModalTitle,
	CloseButton,
	ModalContent,
	ModalFooter,
} from './styles';

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	children: React.ReactNode;
	footer?: React.ReactNode;
}

export const Modal = React.memo(({ isOpen, onClose, title, children, footer }: ModalProps) => {
	const handleEscape = useCallback(
		(event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose();
			}
		},
		[onClose],
	);

	useEffect(() => {
		if (isOpen) {
			document.addEventListener('keydown', handleEscape);
			document.body.style.overflow = 'hidden';
		}

		return () => {
			document.removeEventListener('keydown', handleEscape);
			document.body.style.overflow = 'unset';
		};
	}, [isOpen, handleEscape]);

	if (!isOpen) return null;

	return createPortal(
		<Overlay onClick={onClose}>
			<ModalContainer onClick={(e) => e.stopPropagation()}>
				<ModalHeader>
					{title && <ModalTitle>{title}</ModalTitle>}
					<CloseButton onClick={onClose}>&times;</CloseButton>
				</ModalHeader>
				<ModalContent>{children}</ModalContent>
				{footer && <ModalFooter>{footer}</ModalFooter>}
			</ModalContainer>
		</Overlay>,
		document.body,
	);
});
