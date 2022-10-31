const express = require('express');
const app = express();
const connection = require('./database');

const port = process.env.PORT || 9000;

app.get('/', async (req, res) => {
  let name = '';
  connection.execute('SELECT * FROM fullcycledb.people', (_, result) => {
    console.log(result);
    name = result[0].name;
    res.status(200).send(`
      <h1>Full Cycle Rocks!</h1>
      <li>${name}</li>
    `);
  })
});

app.listen(port, () => {
  console.log(`Escutando a porta ${port}`);
})