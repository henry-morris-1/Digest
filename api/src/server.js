/** Import express */
const express = require('express');
const app = express();

/** Use router */
const router = express.Router();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);
const PORT = process.env.PORT || 3000;

////////////////////
/** API ENDPOINTS */
////////////////////
const routes = require('./routes/routes');
app.use('/users', routes);

// Ask our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));