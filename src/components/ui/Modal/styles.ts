import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideIn = keyframes`
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

export const Overlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
	animation: ${fadeIn} 0.2s ease-out;
`;

export const ModalContainer = styled.div`
	background: white;
	border-radius: 8px;
	padding: 24px;
	max-width: 90%;
	width: 500px;
	max-height: 90vh;
	overflow-y: auto;
	position: relative;
	animation: ${slideIn} 0.3s ease-out;
`;

export const ModalHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20px;
`;

export const ModalTitle = styled.h2`
	margin: 0;
	font-size: 1.5rem;
	font-weight: 500;
`;

export const CloseButton = styled.button`
	background: none;
	border: none;
	font-size: 1.5rem;
	cursor: pointer;
	padding: 4px;
	color: var(--text-color);
	opacity: 0.6;
	transition: opacity 0.2s;

	&:hover {
		opacity: 1;
	}
`;

export const ModalContent = styled.div`
	margin-bottom: 24px;
`;

export const ModalFooter = styled.div`
	display: flex;
	justify-content: flex-end;
	gap: 12px;
`;
