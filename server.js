const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
const port = 4000||process.env.port;

const db = require('./models');

// Middleware
app.use(bodyParser.json());

// Route files
const userRoutes = require('./routes/userroutes');
const cityRoutes = require('./routes/cityroutes');
const regionRoutes = require('./routes/regionroutes');
const fieldRoutes = require('./routes/fieldroutes'); 
const reservationRoutes = require('./routes/reservationRoutes');
const fieldOwnerRoutes = require('./routes/fieldownerroutes'); 


// Route handling
app.use('/field_owners', fieldOwnerRoutes);
app.use('/users', userRoutes);
app.use('/cities', cityRoutes);
app.use('/regions', regionRoutes);
app.use('/fields', fieldRoutes);
app.use('/reservations', reservationRoutes);

// Sync database and start server
db.sequelize.sync().then(() => {
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
  });
});
