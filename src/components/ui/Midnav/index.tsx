import { Button } from '../Button';
interface TopNavProps {
	isAdmin: boolean;
	sessionName: string | null;
	sessionTitle: string | null;
	handleEndSession?: () => void; //(e: FormEvent<Element>) => Promise<void>;
}

export const MidNav = ({
	isAdmin,
	handleEndSession,
	sessionName,
	sessionTitle,
}: TopNavProps): JSX.Element => (
	<div className="card shadow-lg mx-4 card-profile-bottom">
		<div className="card-body p-3">
			<div className="row gx-4">
				<div className="col-auto">
					<div className="avatar avatar-xl position-relative">
						<img
							src="https://chibujax.com/logo_game_high_res.png"
							alt="profile_image"
							className="w-100 border-radius-lg shadow-sm"
						/>
					</div>
				</div>
				<div className="col-auto my-auto">
					<div className="h-100">
						<h5 id="sessionName" className="mb-1">
							Session:{sessionName}
						</h5>
						<p id="voteTitleDisplay" className="mb-0 font-weight-bold text-sm">
							Title: {sessionTitle}
						</p>
					</div>
				</div>
				<div className="col-lg-4 col-md-6 my-sm-auto ms-sm-auto me-sm-0 mx-auto mt-3">
					<div className="nav-wrapper position-relative end-0">
						{isAdmin && (
							<Button
								onClick={async () => {
									if (handleEndSession) {
										handleEndSession();
									}
								}}
								buttonClassName="btn btn-danger btn-sm ms-auto btn-sm float-end"
								fullWidth={false}
							>
								End Session
							</Button>
						)}
					</div>
				</div>
			</div>
		</div>
	</div>
);
