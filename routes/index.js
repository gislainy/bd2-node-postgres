const express = require('express');
const router = express.Router();
const pg = require('pg');
const path = require('path');
const connectionString = process.env.DATABASE_URL || "postgres://postgres:1234@localhost/bd2companhia";
router.get('/', (req, res, next) => {
  res.sendFile(path.join(
    __dirname, '..', 'client', 'views', 'index.html'));
});

router.get('/api/v1/funcionario/all', (req, res, next) => {
  const results = [];
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if (err) {
      done();
      console.log(err);
      return res.status(500).json({ success: false, data: err });
    }
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM funcionario');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});
router.get('/api/v1/departamento/all', (req, res, next) => {
  const results = [];
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if (err) {
      done();
      console.log(err);
      return res.status(500).json({ success: false, data: err });
    }
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM departamento ORDER BY dnumero ASC');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});
router.get('/api/v1/dependente/all', (req, res, next) => {
  const results = [];
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if (err) {
      done();
      console.log(err);
      return res.status(500).json({ success: false, data: err });
    }
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM dependente ORDER BY cpf ASC');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});
router.get('/api/v1/gerentes_departamentos/all', (req, res, next) => {
  const results = [];
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if (err) {
      done();
      console.log(err);
      return res.status(500).json({ success: false, data: err });
    }
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM v_gerentes_departamentos');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

router.post('/api/v1/gerentes_departamentos/new', (req, res, next) => {
  const results = [];
  // Grab data from http request
  var departamento = req.body.departamento || {};
  console.dir({ departamento })
  const data = {
    dnome: departamento.dnome,
    dnumero: departamento.dnumero,
    ger_cpf: departamento.ger_cpf,
    ger_inicio_data: new Date()
  };
  console.dir({ data })
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if (err) {
      done();
      console.log(err);
      return res.status(500).json({ success: false, data: err });
    }
    // SQL Query > Insert Data
    client.query('INSERT INTO v_gerentes_departamentos(dnome, dnumero, ger_cpf, ger_inicio_data) values($1, $2, $3, $4)',
      [data.dnome, data.dnumero, data.ger_cpf, data.ger_inicio_data]);
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM v_gerentes_departamentos');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});
router.post('/api/v1/dependente/new', (req, res, next) => {
  const results = [];
  // Grab data from http request
  var dependente = req.body.dependente || {};
  console.dir({ dependente })
  const data = {
    nome: dependente.nome,
    gen: dependente.gen,
    cpf: dependente.cpf,
    data_nasc: new Date()
  };
  console.dir({ data })
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if (err) {
      done();
      console.log(err);
      return res.status(500).json({ success: false, data: err });
    }
    // SQL Query > Insert Data
    client.query('INSERT INTO dependente(nome, cpf, gen, relacionamento, data_nasc) values($1, $2, $3, $4)',
      [data.nome, data.cpf, data.gen, data.relacionamento, data.data_nasc]);
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM dependente');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

module.exports = router;
