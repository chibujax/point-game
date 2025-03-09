
Attach users to vote result so that after a wile, it should persist
after vote,
when admin refreshes, he should still see results
same as users


after reveal, voting is ignored at that point until restart


Enter on join does not work

test title
Change session header image

add millewares for server requests
What happens when session is not found

Update readme with readme
Add test

# BBC Pointing Tool	


An anonymous voting tool designed for agile story point estimation and interview scoring at the BBC. This tool helps teams make unbiased decisions by allowing participants to vote independently before revealing collective results.	Attach users to vote result so that after a wile, it should persist
after vote,
when admin refreshes, he should still see results
same as users


## Features	


- **Anonymous Voting**: Participants can submit their votes without seeing others' choices	after reveal, voting is ignored at that point until restart
- **Real-time Updates**: Built with Socket.IO for immediate vote registration	
- **Majority-based Results**: Final point value is determined by the most common vote	
- **Session Management**: Supports multiple concurrent voting sessions	
- **Role-based Access**: Separate controls for admin and participants	
- **Flexible Use Cases**: 	
  - Agile story point estimation	
  - Interview candidate scoring	
  - Team decision making	
  - Any scenario requiring anonymous voting	


## Use Cases	


### Story Point Estimation	Enter on join does not work
- Create a session for each JIRA ticket	
- Team members vote independently on story points	
- Admin reveals votes when everyone has submitted	
- Most common point value is automatically selected	
- Reduces influence bias in estimation meetings	


### Interview Scoring	test title
- Interviewers can score candidates anonymously	Change session header image
- Prevents scoring bias from senior team members	
- Enables more honest and independent assessments	
- Facilitates fair and transparent evaluation process	


## Getting Started	add millewares for server requests
What happens when session is not found


### Prerequisites	Update readme with readme
- Node.js 16.x	Add test
- npm	

### Installation	
```bash	
# Clone the repository	
git clone [repository-url]	

# Install dependencies	
npm install	

# Start the server	
npm start	
```	

### Usage	

1. **Create a Session**	
   - Admin creates a new voting session	
   - Gets a unique session ID to share with participants	

2. **Join Session**	
   - Participants join using the session ID	
   - Each participant gets a unique anonymous identifier	

3. **Voting Process**	
   - Participants submit their votes	
   - Admin can see how many have voted (without seeing individual votes)	
   - Admin reveals results when ready	
   - Final score is automatically calculated based on majority	

## Technical Stack	

- **Backend**: Node.js with Express	
- **Real-time Communication**: Socket.IO	
- **Session Management**: UUID for unique session IDs	
- **Security**: Cookie-based authentication	

## Contributing	

This tool is currently used by UAP and is open for contributions from across the BBC. To contribute:	

1. Fork the repository	
2. Create a feature branch	
3. Submit a pull request with your changes	
4. Ensure your code follows existing patterns	

## License	

ISC License - See LICENSE file for details	

## Support	

For support or feature requests, please raise an issue in the repository or contact the UAP team.	

---	

*This tool is maintained by the BBC UAP team and is available for use across BBC departments.*	
