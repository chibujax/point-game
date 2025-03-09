import { Mask } from '../../ui/Mask';

interface PageHeaderProps {
	backgroundImage: string;
}

export const SessionHeader = ({ backgroundImage }: PageHeaderProps): JSX.Element => (
	<div
		className="position-absolute w-100 min-height-300 top-0"
		style={{ backgroundImage: `url(${backgroundImage})`, backgroundPositionY: '50%' }}
	>
		<Mask></Mask>
	</div>
);

SessionHeader.displayName = 'SessionHeader';
