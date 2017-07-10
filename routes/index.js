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
  pg.connect(connectionString, (err, client, done) => {
    if (err) {
      done();
      console.log(err);
      return res.status(500).json({ success: false, data: err });
    }
    const query = client.query('SELECT * FROM funcionario ORDER BY cpf ASC');
    query.on('row', (row) => {
      results.push(row);
    });
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});
router.get('/api/v1/departamento/all', (req, res, next) => {
  const results = [];
  pg.connect(connectionString, (err, client, done) => {
    if (err) {
      done();
      console.log(err);
      return res.status(500).json({ success: false, data: err });
    }

    const query = client.query('SELECT * FROM departamento ORDER BY dnumero ASC');

    query.on('row', (row) => {
      results.push(row);
    });

    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});
router.get('/api/v1/dependente/all', (req, res, next) => {
  const results = [];

  pg.connect(connectionString, (err, client, done) => {

    if (err) {
      done();
      console.log(err);
      return res.status(500).json({ success: false, data: err });
    }

    const query = client.query('SELECT * FROM dependente ORDER BY cpf ASC');

    query.on('row', (row) => {
      results.push(row);
    });

    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});
router.get('/api/v1/gerentes_departamentos/all', (req, res, next) => {
  const results = [];

  pg.connect(connectionString, (err, client, done) => {

    if (err) {
      done();
      console.log(err);
      return res.status(500).json({ success: false, data: err });
    }

    const query = client.query('SELECT * FROM v_gerentes_departamentos ');

    query.on('row', (row) => {
      results.push(row);
    });

    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

router.post('/api/v1/gerentes_departamentos/new', (req, res, next) => {
  const results = [];

  var departamento = req.body.departamento || {};
  console.dir({ departamento })
  const data = {
    dnome: departamento.dnome,
    dnumero: departamento.dnumero,
    ger_cpf: departamento.ger_cpf,
    ger_inicio_data: new Date()
  };
  console.dir({ data })

  pg.connect(connectionString, (err, client, done) => {

    if (err) {
      done();
      console.log(err);
      return res.status(500).json({ success: false, data: err });
    }

    client.query('INSERT INTO v_gerentes_departamentos(dnome, dnumero, cpf, ger_inicio_data) values($1, $2, $3, $4)',
      [data.dnome, data.dnumero, data.ger_cpf, data.ger_inicio_data]);

    const query = client.query('SELECT * FROM v_gerentes_departamentos');

    query.on('row', (row) => {
      results.push(row);
    });

    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});
router.post('/api/v1/dependente/new', (req, res, next) => {
  const results = [];

  var dependente = req.body.dependente || {};
  console.dir({ dependente })
  const data = {
    nome: dependente.nome,
    relacionamento: dependente.relacionamento,
    gen: dependente.gen,
    cpf: dependente.cpf,
    data_nasc: new Date(dependente.data_nasc),
  };
  console.dir({ data })

  pg.connect(connectionString, (err, client, done) => {

    if (err) {
      done();
      console.log(err);
      return res.status(500).json({ success: false, data: err });
    }

    client.query('INSERT INTO dependente(nome, cpf, gen, relacionamento, data_nasc) values($1, $2, $3, $4, $5)',
      [data.nome, data.cpf, data.gen, data.relacionamento, data.data_nasc]);

    const query = client.query('SELECT * FROM dependente');

    query.on('row', (row) => {
      results.push(row);
    });

    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});
router.post('/api/v1/funcionario/percentual', (req, res, next) => {
  const results = [];

  var data = req.body.funcionario || {};
  console.log({data})
  pg.connect(connectionString, (err, client, done) => {

    if (err) {
      done();
      console.log(err);
      return res.status(500).json({ success: false, data: err });
    }

    client.query('SELECT f_reajusta_salario($1, $2)',
      [data.cpf, data.percentual]);

    const query = client.query('SELECT * FROM funcionario ORDER BY cpf ASC');

    query.on('row', (row) => {
      results.push(row);
    });

    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

module.exports = router;
