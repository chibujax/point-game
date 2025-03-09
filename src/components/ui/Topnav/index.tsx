interface TopNavProps {
	isAdmin: boolean;
	handleExit: () => void;
	handleTitleChange?: () => void;
}

export const TopNav = ({ isAdmin, handleExit }: TopNavProps): JSX.Element => (
	<nav className="navbar navbar-main navbar-expand-lg bg-transparent shadow-none position-absolute px-4 w-100 z-index-2 mt-n11">
		<div className="container-fluid py-1">
			<div className="collapse navbar-collapse me-md-0 me-sm-4 mt-sm-0 mt-2" id="navbar">
				{isAdmin && (
					<div className="ms-md-auto pe-md-3 d-flex align-items-center">
						<div id="titleChange" className="input-group">
							<span className="input-group-text text-body">
								<i className="fas fa-edit" aria-hidden="true"></i>
							</span>
							<input
								type="text"
								id="voteTitle"
								className="form-control"
								placeholder="Change title..."
							/>
						</div>
					</div>
				)}
				<ul className={`navbar-nav ${isAdmin ? 'justify-content-end' : 'ms-auto'}`}>
					<li className="nav-item d-flex align-items-center">
						<a
							href="#"
							onClick={handleExit}
							className="nav-link text-white font-weight-bold px-0"
						>
							<i className="fa fa-user me-sm-1"></i>
							<span className="d-sm-inline">Leave</span>
						</a>
					</li>
				</ul>
			</div>
		</div>
	</nav>
);
