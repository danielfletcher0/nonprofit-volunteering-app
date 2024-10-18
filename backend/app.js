const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();


app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());  // Parse incoming JSON data
app.use(bodyParser.json());

// Import your route files
const eventRouter = require('./routes/eventRouter');
const profileRouter = require('./routes/ProfileRouter');
//const historyRouter = require('./routes/historyRouter');
//const homeRouter = require('./routes/homeRouter');
//const loginRouter = require('./routes/LoginRouter');
//const matchRouter = require('./routes/matchRouter');
//const registerRouter = require('./routes/RegisterRouter');

// Use the routers and define their base paths
app.use('/events', eventRouter);  
app.use('/profile', profileRouter); 
//app.use('/history', historyRouter); 
//app.use('/home', homeRouter); 
//app.use('/login', loginRouter); 
//app.use('/match', matchRouter);
//app.use('/register', registerRouter); 

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});