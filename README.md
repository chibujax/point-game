# BBC Pointing Tool

An anonymous voting tool designed for agile story point estimation and interview scoring at the BBC. This tool helps teams make unbiased decisions by allowing participants to vote independently before revealing collective results.

## Features

- **Anonymous Voting**: Participants can submit their votes without seeing others' choices. After reveal, voting is ignored until restart
- **Real-time Updates**: Built with Socket.IO for immediate vote registration
- **Majority-based Results**: Final point value is determined by the most common vote
- **Session Management**: Supports multiple concurrent voting sessions with persistent results
- **Role-based Access**: Separate controls for admin and participants
- **User Persistence**: Attaches users to vote results for persistence across sessions
- **Flexible Use Cases**:
  - Agile story point estimation
  - Interview candidate scoring
  - Team decision making
  - Any scenario requiring anonymous voting

## Use Cases

### Story Point Estimation
- Create a session for each JIRA ticket
- Team members vote independently on story points
- Admin reveals votes when everyone has submitted
- Most common point value is automatically selected
- Reduces influence bias in estimation meetings
- Results persist even when admin refreshes the page

### Interview Scoring
- Interviewers can score candidates anonymously
- Prevents scoring bias from senior team members
- Enables more honest and independent assessments
- Facilitates fair and transparent evaluation process
- Supports custom session header images

## Technical Stack

- **Frontend**: React with Vite for fast development and building
- **Styling**: Styled-components for component-based CSS
- **State Management**: Zustand
- **Backend**: Node.js with Express
- **Real-time Communication**: Socket.IO
- **Session Management**: UUID for unique session IDs
- **Security**: Cookie-based authentication

## Getting Started

### Prerequisites
- Node.js 16.x
- npm

### Installation
```bash
# Clone the repository
git clone [repository-url]

# Install dependencies
npm install
```

### Development
```bash
# Run frontend and backend concurrently (for local development)
npx concurrently "npm run server:dev" "npm run dev"

# Or run them separately:
# Frontend only
npm run dev

# Backend only
npm run server:dev

# Clean and build everything
npm run clean && npm run build && npm run server:build
```

### Production Build
```bash
# Build for production
npm run build:prod

# Start production server
npm run start
```

### Deployment to Glitch
The application is currently hosted on Glitch. The repository includes a simplified `package.json` for Glitch deployment:

```json
{
    "name": "pointing-game-react",
    "version": "1.0.0",
    "scripts": {
        "start": "npm install && NODE_ENV=production node server/index.js"
    },
    "dependencies": {
        "cookie": "^1.0.2",
        "cookie-parser": "^1.4.7",
        "cors": "^2.8.5",
        "express": "^4.21.2",
        "http": "^0.0.1-security",
        "socket.io": "^4.8.1",
        "socket.io-client": "^4.7.5"
    },
    "engines": {
        "node": "16.x"
    }
}
```

### Usage

1. **Create a Session**
   - Admin creates a new voting session
   - Gets a unique session ID to share with participants

2. **Join Session**
   - Participants join using the session ID
   - Each participant gets a unique anonymous identifier
   - Pressing Enter on the join screen now works correctly

3. **Voting Process**
   - Participants submit their votes
   - Admin can see how many have voted (without seeing individual votes)
   - Admin reveals results when ready
   - Final score is automatically calculated based on majority
   - Results persist even after page refreshes

## Future Improvements

- **Database Integration**: Add a database to store and manage sessions for better persistence
- **AI Analytics**: Integrate AI to analyze voting behavior and provide statistics
- **CSS Refactoring**: Replace className-based styling with styled-components:

```tsx
// Instead of this:
import React from 'react';
interface CardProps {
  children: React.ReactNode;
  cardClassName?: string;
  bodyClassName?: string;
}

export const Card = ({
  children,
  cardClassName = 'card z-index-0',
  bodyClassName = 'card-body',
}: CardProps): JSX.Element => (
  <div className={cardClassName}>
    <div className={bodyClassName}>{children}</div>
  </div>
);

// Use styled-components approach:
import styled from 'styled-components';

const CardContainer = styled.div`
  /* Card styles */
  z-index: 0;
`;

const CardBody = styled.div`
  /* Card body styles */
`;

export const Card = ({ children }): JSX.Element => (
  <CardContainer>
    <CardBody>{children}</CardBody>
  </CardContainer>
);
```

- **Error Handling**: Improve handling for scenarios like "session not found"
- **Comprehensive Testing**: Add more test coverage for all components and features

## Contributing

This tool is currently used by UAP and is open for contributions from across the BBC. To contribute:

1. Fork the repository
2. Create a feature branch
3. Submit a pull request with your changes
4. Ensure your code follows existing patterns and passes all tests

## Testing

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage
```

## License

ISC License - See LICENSE file for details

## Support

For support or feature requests, please raise an issue in the repository or contact the UAP team.

---

*This tool is maintained by the BBC UAP team and is available for use across BBC departments.*
