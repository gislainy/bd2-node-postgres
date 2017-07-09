# bd2-node-postgres
Trabalho de Banco de Dados 2 implementado com node + postgres
Pelo alunos: [@fjcs7](https://github.com/fjcs7) e [@gislainy](https://github.com/gislainy)
## Executar

Realizar clone do projeto 
`git clone https://github.com/gislainy/bd2-node-postgres.git`

Entrar na pasta 

```
cd bd2-node-postgres
```

Executar `npm install` para baixar as dependência (lembrando que a máquina tem que ter o node instalado)

Criar no PostgreSQL o banco `bd2companhia`.

Procurar pela string no projeto e alterar o usuario e a senha de acesso.
``` 
postgres://postgres:1234@localhost/bd2companhia
```

Após isso, 

Rodar os arquivos: 

```
  node ./server/schema.js //este cria a estrutura do banco
  node ./server/data.js //insere a base
```

Após, pode executar o projeto por `npm start`
O projeto está rodando em: `localhost:3000`