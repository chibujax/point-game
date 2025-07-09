import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GlobalStyles } from './styles/GlobalStyles';
import HomePage from './pages/Home';
import './assets/css/custom.css';
import SessionPageWrapper from './pages/Session/SessionPageWrapper';

const App = (): JSX.Element => {
	return (
		<Router>
			<GlobalStyles />
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/:sessionId" element={<SessionPageWrapper />} />
			</Routes>
		</Router>
	);
};

export default App;
