const { Sequelize } = require('sequelize');
const { Pool } = require('pg')

// pool para queries normales
const pool = new Pool()
module.exports = {
  query: (text, params) => pool.query(text, params),
}

// usando sequelize como ORM
var sequelize = new Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASSWORD, {
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  dialect: 'postgres',
  minifyAliases: true, // esto es clave si no trunca los atributos.
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },

  // SQLite only
  // storage: 'path/to/database.sqlite'
});

sequelize
  .authenticate()
  .then(function (err) {
    console.log('Connection has been established successfully.');
  })
  .catch(function (err) {
    console.log('Unable to connect to the database:', err);
  });

// Or you can simply use a connection uri
// var sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname');

// sequelize.sync({ alter: true })
//   .then(() => { console.log('DB sync success') })
//   .catch((err) => { console.log('Error syncing DB', err) })

module.exports.sequelize = sequelize