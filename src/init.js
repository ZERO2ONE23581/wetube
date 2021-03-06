import 'regenerator-runtime';
import 'dotenv/config'; //you should import dotenv to activate on top of your code!
import './db'; // server import this file to connect the server to mongodb

//This connects db file to mongoose => let db to notice there's a Model!
///When this line is created, you can see you have wetube db on mongodb!!
import './models/Video';
import './models/User';
import './models/Comment';

//SERVER LISTENING
import app from './server';
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(
    `✅ Aiden's server listening on the port http://localhost:${PORT} 🔥`
  );
});
