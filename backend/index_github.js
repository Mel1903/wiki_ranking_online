
const express = require('express');
const cors = require('cors');
const app = express();

//middlewares ??
app.use(cors());
app.use(express.json());

app.get
('/api/health', (req, res) => 
    {
      res.json({ status: 'ok' });
    }
);

//routes
app.use('/api/session', require('./routes/UserSession_github'));

app.use('/api/matchup', require('./routes/matchup_github'));

app.use('/api/vote', require('./routes/vote_github'));

app.use('/api/ranking', require('./routes/ranking_github'));

/*das war Serverstart und von 4.2 Version, aber für lokal! */
//Server start
app.listen
(3000, () => 
    {
        console.log('Server läuft auf http://localhost:3000');
    }
);
/**/

/*
//folgende ist für Serverstart nicht lokal!
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});
*/








/*erster Prototyp zum Testen??
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/db-test', async (req, res) => 
{
    try 
    {
        const [rows] = await db.execute('SELECT 1');
        res.json({ db: 'connected' });
    } 
    catch (err) 
    {
        res.status(500).json({ error: err.message });
    }
});
app.listen(3000, () => 
{
    console.log('Server läuft auf http://localhost:3000');    
});
*/