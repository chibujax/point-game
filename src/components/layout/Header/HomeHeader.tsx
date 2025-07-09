import { Mask } from '@/components/ui';

interface PageHeaderProps {
	backgroundImage: string;
	description?: string;
}

export const HomeHeader = ({
	backgroundImage,
	description = 'Create a session to continue.',
}: PageHeaderProps): JSX.Element => (
	<div
		className="page-header align-items-start min-vh-50 pt-5 pb-11 m-3 border-radius-lg"
		style={{ backgroundImage: `url(${backgroundImage})`, backgroundPosition: 'top' }}
	>
		<Mask></Mask>
		<div className="container">
			<div className="row justify-content-center">
				<div className="col-lg-5 text-center mx-auto">
					<h1 className="text-white mb-2 mt-5">Welcome</h1>
					<p className="text-lead text-white">{description}</p>
				</div>
			</div>
		</div>
	</div>
);

HomeHeader.displayName = 'HomeHeader';
