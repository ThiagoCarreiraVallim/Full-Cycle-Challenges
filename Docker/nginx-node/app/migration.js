const connection = require('./database');

const migration = 'CREATE TABLE IF NOT EXISTS fullcycledb.people(id INT NOT NULL auto_increment primary key, name VARCHAR(255));'

const seed = 'INSERT INTO fullcycledb.people(name) VALUES("Thiago")'

connection.query(migration);
connection.query(seed);

connection.end();