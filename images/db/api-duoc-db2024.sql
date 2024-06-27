CREATE TABLE "Usuarios" (
  "id" SERIAL PRIMARY KEY,
  "nombre" VARCHAR(120),
  "email" VARCHAR(120) UNIQUE,
  "password" VARCHAR(120),
  "role" VARCHAR(120),
  "created_at" TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "CategoriasProductos" (
  "id" SERIAL PRIMARY KEY,
  "nombre" VARCHAR(120)
);

CREATE TABLE "Productos" (
  "id" SERIAL PRIMARY KEY,
  "nombre" VARCHAR(120),
  "precio" INT,
  "descripcion" VARCHAR(250),
  "stock" INT,
  "categoria_id" INT
);

CREATE TABLE "Ventas" (
  "id" SERIAL PRIMARY KEY,
  "id_usuario" INT,
  "monto" INT
);

CREATE TABLE "DetalleVenta" (
  "id" SERIAL PRIMARY KEY,
  "id_venta" INT,
  "id_producto" INT,
  "id_usuario" INT,
  "cantidad" INT,
  "precio_unitario" INT
);

CREATE TABLE "Pagos" (
  "id" SERIAL PRIMARY KEY,
  "id_venta" INT,
  "monto" INT,
  "metodo_pago" VARCHAR(255),
  "estado_pago" VARCHAR(255),
  "token" VARCHAR(255)
);

CREATE TABLE "Logs" (
  "id" SERIAL PRIMARY KEY,
  "tipo" VARCHAR(120),
  "descripcion" VARCHAR(255),
  "fecha" TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "session" (
  "sid" VARCHAR(255) PRIMARY KEY,
  "sess" JSON,
  "expire" TIMESTAMP
);

CREATE TABLE "Pedidos" (
  "id" SERIAL PRIMARY KEY,
  "id_venta" INT,
  "metodo_entrega" VARCHAR(50),
  "direccion_id" INT,
  "estado" VARCHAR(50) DEFAULT 'pendiente'
);

CREATE TABLE "Direcciones" (
  "id" SERIAL PRIMARY KEY,
  "id_usuario" INT,
  "direccion" VARCHAR(255),
  "ciudad" VARCHAR(100),
  "codigo_postal" VARCHAR(20)
);

CREATE TABLE "Reviews" (
  "id" SERIAL PRIMARY KEY,
  "id_usuario" INT,
  "id_producto" INT,
  "rating" INT,
  "comentario" TEXT,
  "created_at" TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "Wishlists" (
  "id" SERIAL PRIMARY KEY,
  "id_usuario" INT,
  "id_producto" INT,
  "created_at" TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "Coupons" (
  "id" SERIAL PRIMARY KEY,
  "codigo" VARCHAR(50) UNIQUE,
  "descuento" DECIMAL(5,2),
  "fecha_expiracion" TIMESTAMP,
  "usos_restantes" INT
);

COMMENT ON COLUMN "Pedidos"."metodo_entrega" IS 'CHECK (metodo_entrega IN (''retiro'', ''envio''))';

COMMENT ON COLUMN "Reviews"."rating" IS 'CHECK (rating BETWEEN 1 AND 5)';

ALTER TABLE "Productos" ADD FOREIGN KEY ("categoria_id") REFERENCES "CategoriasProductos" ("id");

ALTER TABLE "Ventas" ADD FOREIGN KEY ("id_usuario") REFERENCES "Usuarios" ("id");

ALTER TABLE "DetalleVenta" ADD FOREIGN KEY ("id_venta") REFERENCES "Ventas" ("id");

ALTER TABLE "DetalleVenta" ADD FOREIGN KEY ("id_producto") REFERENCES "Productos" ("id");

ALTER TABLE "DetalleVenta" ADD FOREIGN KEY ("id_usuario") REFERENCES "Usuarios" ("id");

ALTER TABLE "Pagos" ADD FOREIGN KEY ("id_venta") REFERENCES "Ventas" ("id");

ALTER TABLE "Pedidos" ADD FOREIGN KEY ("id_venta") REFERENCES "Ventas" ("id");

ALTER TABLE "Pedidos" ADD FOREIGN KEY ("direccion_id") REFERENCES "Direcciones" ("id");

ALTER TABLE "Direcciones" ADD FOREIGN KEY ("id_usuario") REFERENCES "Usuarios" ("id");

ALTER TABLE "Reviews" ADD FOREIGN KEY ("id_usuario") REFERENCES "Usuarios" ("id");

ALTER TABLE "Reviews" ADD FOREIGN KEY ("id_producto") REFERENCES "Productos" ("id");

ALTER TABLE "Wishlists" ADD FOREIGN KEY ("id_usuario") REFERENCES "Usuarios" ("id");

ALTER TABLE "Wishlists" ADD FOREIGN KEY ("id_producto") REFERENCES "Productos" ("id");

-- Crear índice para la tabla Usuarios
CREATE INDEX idx_usuarios_email ON "Usuarios" ("email");

-- Crear índice para buscar productos por nombre
CREATE INDEX idx_productos_nombre ON "Productos" ("nombre");

-- Crear índice para buscar productos por categoría
CREATE INDEX idx_productos_categoria_id ON "Productos" ("categoria_id");

-- Crear índice para buscar logs por tipo
CREATE INDEX idx_logs_tipo ON "Logs" ("tipo");

-- Crear índice para buscar logs por fecha
CREATE INDEX idx_logs_fecha ON "Logs" ("fecha");
