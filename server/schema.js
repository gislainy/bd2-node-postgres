var schema = `CREATE TABLE funcionario (
    nome character varying(15) not null,
    inicial char,
    sobrenome character varying(15) not null,
    cpf character(9) not null,
    data_nasc date,
    endereco character varying(33),
    gen character(1),
    salario numeric(10,2),
    super_cpf character(9),
    dno integer not null,
    primary key (cpf),
    foreign key (super_cpf) references funcionario(cpf)
);
CREATE TABLE departamento (
    dnome character varying(15) not null unique,
    dnumero integer not null primary key,
    ger_cpf character(9) not null,
    ger_inicio_data date,
    foreign key (ger_cpf) references funcionario(cpf)
);
alter table funcionario add constraint func_depart_fkey foreign key (super_cpf) references funcionario(cpf);
CREATE TABLE dept_locais (
    dnumero integer not null,
    dlocal character varying(15) not null,
    constraint dept_locais_pkey primary key (dnumero, dlocal),
    constraint dept_locais_fkey foreign key (dnumero) references departamento(dnumero)
);
CREATE TABLE projeto (
    pnome character varying(18) not null,
    pnumero integer not null primary key,
    plocal character varying(15),
    dnum integer not null references departamento(dnumero),
    unique (pnome)
);
CREATE TABLE func_proj (
    cpf character(9) not null references funcionario(cpf),
    pno integer not null references projeto(pnumero),
    hours numeric(3,1) not null,
    primary key (cpf, pno)
);
CREATE TABLE dependente (
    cpf character(9) NOT NULL references funcionario(cpf),
   nome character varying(15) NOT NULL,
    gen character(1),
    data_nasc date,
    relacionamento varchar(8),
    primary key (cpf, nome)
);
CREATE OR REPLACE VIEW v_gerentes_departamentos AS(
	SELECT  dp.dnumero, 
			dp.dnome, 
			dp.ger_inicio_data,
			func.nome, 
			func.sobrenome, 
			func.inicial, 
			func.cpf, 
			func.data_nasc, 
			func.endereco, 
			func.gen, 
			func.salario, 
			func.super_cpf
	FROM departamento dp 
			INNER JOIN funcionario func ON
						dp.ger_cpf = func.cpf
	ORDER BY dp.dnumero
);
CREATE OR REPLACE FUNCTION operacoes_em_gerentes_departamentos() RETURNS TRIGGER 
AS $$
    BEGIN
        --
        -- Está função será responsável por iterceptar qual a operação realizada na visão v_gerentes_departamentos
        -- e refletir as alterações nas devidas tabelas (departamento e funcionário)
        --
        IF (TG_OP = 'DELETE') THEN
            DELETE FROM departamento WHERE departamento.dnumero = OLD.dnumero;
            IF (NOT FOUND) THEN 
            	RETURN NULL; 
            END IF;
            
            RETURN NEW;

        ELSIF (TG_OP = 'UPDATE') THEN
            UPDATE departamento 
            SET dnome = NEW.dnome, 
            	ger_cpf = NEW.cpf,
            	ger_inicio_data = NEW.ger_inicio_data
            WHERE departamento.dnumero = OLD.dnumero;
            
            IF (TRIM(NEW.cpf) <> '') THEN
	            UPDATE funcionario 
	            SET nome = NEW.nome, 
	            	inicial = NEW.inicial,
	            	sobrenome = NEW.sobrenome,
	            	cpf = NEW.cpf,
	            	data_nasc = NEW.data_nasc,
	            	salario = NEW.salario,
	            	super_cpf = NEW.super_cpf,
	            	dno = NEW.dnumero
	            WHERE funcionario.cpf = OLD.cpf;
            END IF;
			
            IF (NOT FOUND) THEN 
            	RETURN NULL; 
            END IF;
            
            RETURN NEW;

        ELSIF (TG_OP = 'INSERT') THEN
            
        	INSERT INTO departamento 
            		VALUES(NEW.dnome,
            			   NEW.dnumero,
            			   NEW.cpf,
            			   NEW.ger_inicio_data);
            
            IF (TRIM(NEW.cpf) <> '') THEN
	            INSERT INTO funcionario
	            		VALUES (NEW.nome,
								substring(new.nome,1,1), -- Para obter a inicial do funcionário
								NEW.sobrenome,
								NEW.cpf,
								NEW.data_nasc,
								NEW.endereco,
								NEW.gen,
								NEW.salario,
								NEW.super_cpf,
								NEW.dno);
			END IF;
			RETURN NEW;
        END IF;
    END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER intercepta_alteracao_v_gerentes_departamentos
	INSTEAD OF INSERT OR UPDATE OR DELETE ON v_gerentes_departamentos
		FOR EACH ROW EXECUTE PROCEDURE operacoes_em_gerentes_departamentos();

`


var pg = require('pg');
var conString = "postgres://postgres:123@localhost/bd2companhia";

pg.connect(conString, function(err, client, done) {
  if (err) {
    return console.error('error fetching client from pool', err);
  }
  client.query(schema, function(err, result) {
    done();
    if (err) {
      return console.error('error running query', err);
    }
    console.log(result.rows);
  });

});