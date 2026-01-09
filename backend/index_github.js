app.get('/', (req, res) => {
    res.send('OK');
});

const express = require('express');
const cors = require('cors');
const app = express();

//middlewares ??
app.use(cors());
app.use(express.json());

//routes
app.use('/api/session', require('./routes/UserSession_github'));

app.use('/api/matchup', require('./routes/matchup_github'));

app.use('/api/vote', require('./routes/vote_github'));

app.use('/api/ranking', require('./routes/ranking_github'));


//folgende ist für Serverstart nicht lokal!
const PORT = process.env.PORT || 3000;

app.get
('/api/health', (req, res) => 
    {
      res.json({ status: 'ok' });
    }
);

app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});