interface CenteredContainerProps {
	children: React.ReactNode;
}

export const CenteredContainer = ({ children }: CenteredContainerProps): JSX.Element => (
	<div className="row mt-lg-n10 mt-md-n11 mt-n10 justify-content-center">
		<div className="col-xl-4 col-lg-5 col-md-7 mx-auto">{children}</div>
	</div>
);
