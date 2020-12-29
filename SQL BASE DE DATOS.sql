DROP TABLE salida;
DROP TABLE entrada;
DROP TABLE usuario;
DROP TABLE bajo_stock;
DROP TABLE producto;
DROP TABLE subcategoria;
DROP TABLE categoria;
DROP TABLE proveedor;


CREATE TABLE usuario 
(
rut int NOT NULL UNIQUE,
email varchar(50),
pass varchar(65) NOT NULL,
nombres varchar(100),
apellidos varchar(100),
rol varchar(20) NOT NULL,
estado varchar(10) NOT NULL
);

CREATE TABLE producto
(
id int AUTO_INCREMENT NOT NULL UNIQUE,
nombre varchar(20),
id_sub_cat int NOT NULL,
stock int NOT NULL,
marca varchar(20),
stock_min int NOT NULL,
CHECK (stock>=0)
);

CREATE TABLE proveedor
(
id int AUTO_INCREMENT NOT NULL UNIQUE,
nombre varchar(20),
direccion varchar(50),
telefono int
);

CREATE TABLE entrada
(
id int AUTO_INCREMENT NOT NULL UNIQUE,
id_usuario int NOT NULL,
orden int,
cantidad int,
id_producto int NOT NULL,
id_proveedor int NOT NULL,
fecha varchar(40)
);

CREATE TABLE salida
(
id int AUTO_INCREMENT NOT NULL UNIQUE,
id_usuario int NOT NULL UNIQUE,
id_producto int NOT NULL UNIQUE,
cantidad int,
fecha varchar(40)
);

CREATE TABLE subcategoria
(
id int AUTO_INCREMENT NOT NULL UNIQUE,
nombre varchar(20),
id_categoria int NOT NULL UNIQUE
);

CREATE TABLE categoria
(
id int AUTO_INCREMENT NOT NULL UNIQUE,
nombre varchar(20)
);

CREATE TABLE bajo_stock
(
id_producto int NOT NULL UNIQUE
);

ALTER TABLE usuario ADD CONSTRAINT pk_usuario PRIMARY KEY(rut);
ALTER TABLE producto ADD CONSTRAINT pk_producto PRIMARY KEY(id);
ALTER TABLE proveedor ADD CONSTRAINT pk_proveedor PRIMARY KEY(id);
ALTER TABlE entrada ADD CONSTRAINT pk_entrada PRIMARY KEY(id);
ALTER TABLE salida ADD CONSTRAINT pk_salida PRIMARY KEY(id);
ALTER TABLE subcategoria ADD CONSTRAINT pk_subcategoria PRIMARY KEY(id);
ALTER TABLE categoria ADD CONSTRAINT pk_categoria PRIMARY KEY(id);
ALTER TABLE bajo_stock ADD CONSTRAINT pk_bajo_stock PRIMARY KEY(id_producto);

ALTER TABLE producto ADD CONSTRAINT fk_producto FOREIGN KEY(id_sub_cat) REFERENCES subcategoria(id);
ALTER TABLE entrada ADD CONSTRAINT fk_entrada_us FOREIGN KEY(id_usuario) REFERENCES usuario(rut);
ALTER TABLE entrada ADD CONSTRAINT fk_entrada_prod FOREIGN KEY(id_producto) REFERENCES producto(id);
ALTER TABLE entrada ADD CONSTRAINT fk_entrada_prov FOREIGN KEY(id_proveedor) REFERENCES proveedor(id);
ALTER TABLE salida ADD CONSTRAINT fk_salida_us FOREIGN KEY(id_usuario) REFERENCES usuario(rut);
ALTER TABLE salida ADD CONSTRAINT fk_salida_prod FOREIGN KEY(id_producto) REFERENCES producto(id);
ALTER TABLE subcategoria ADD CONSTRAINT fk_subcategoria FOREIGN KEY(id_categoria) REFERENCES categoria(id);
ALTER TABLE bajo_stock ADD CONSTRAINT fk_bajo_stock FOREIGN KEY(id_producto) REFERENCES producto(id);


CREATE TRIGGER ingreso
	AFTER INSERT ON entrada
    FOR EACH ROW
		UPDATE producto SET stock = stock + NEW.cantidad WHERE id = NEW.id_producto;

CREATE TRIGGER retiro
	AFTER INSERT ON salida
    FOR EACH ROW
		UPDATE producto SET stock = stock - NEW.cantidad WHERE id = NEW.id_producto;
        
INSERT INTO categoria (nombre) VALUES ("Electronica");
INSERT INTO subcategoria (nombre, id_categoria) VALUES ("Laptop", 1);
INSERT INTO producto (nombre, id_sub_cat, stock, marca, stock_min) VALUES ("Gato cojo", 1, 0, "chayomi", 10);
INSERT INTO proveedor (nombre, direccion, telefono) VALUES ("Martuco", "Talca", 6969420);