# bd2-node-postgres
Trabalho de Banco de Dados 2 implementado com node + postgres. Por: [@fjcs7](https://github.com/fjcs7) e [@gislainy](https://github.com/gislainy)

Está disponível nesta url http://bd2-node-postgres.herokuapp.com/

## Executar

Realizar clone do projeto 
`git clone https://github.com/gislainy/bd2-node-postgres.git`

Entrar na pasta 

```
cd bd2-node-postgres
```

Executar `npm install` para baixar as dependência (lembrando que a máquina tem que ter o node instalado)

Após, pode executar o projeto por `npm start`
O projeto está rodando em: `localhost:3000`

Obs: A string de conexão com o banco está sendo feita em `routes/index.js` na linha

``` javascript

const connectionString = process.env.DATABASE_URL || "postgres://ddphphss:FlbvOx3zbM6-gEObIs4IZUpAE0I90q8E@pellefant.db.elephantsql.com:5432/ddphphss";

```

O banco utilizado neste trabalho se encontra online nessa plataforma: `https://www.elephantsql.com/`

Caso queria utilizar um banco local, basta alterar essa string de conexão e criar os banco com os dados que estão na pasta `bd`