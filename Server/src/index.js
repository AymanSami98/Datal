// index.js
import app from './app.js';
import sequelize from './config/database.js';
import 'dotenv/config';
const PORT = process.env.PORT || 3000;

// Sync the database and start the server
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
