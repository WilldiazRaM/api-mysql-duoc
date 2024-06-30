-- Tabla Usuarios
CREATE TABLE "Usuarios" (
  "id" SERIAL PRIMARY KEY,
  "nombre" VARCHAR(120) NOT NULL,
  "email" VARCHAR(120) NOT NULL UNIQUE,
  "password" VARCHAR(120) NOT NULL,
  "role" VARCHAR(120) NOT NULL,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_usuarios_email ON "Usuarios" ("email");

-- Tabla CategoriasProductos
CREATE TABLE "CategoriasProductos" (
  "id" SERIAL PRIMARY KEY,
  "nombre" VARCHAR(120) NOT NULL
);

-- Tabla Productos
CREATE TABLE "Productos" (
  "id" SERIAL PRIMARY KEY,
  "nombre" VARCHAR(120) NOT NULL,
  "precio" INT NOT NULL,
  "descripcion" VARCHAR(250),
  "stock" INT NOT NULL,
  "categoria_id" INT NOT NULL,
  FOREIGN KEY ("categoria_id") REFERENCES "CategoriasProductos" ("id") ON DELETE CASCADE
);

-- Tabla Ventas
CREATE TABLE "Ventas" (
  "id" SERIAL PRIMARY KEY,
  "id_usuario" INT NOT NULL,
  "monto" INT NOT NULL,
  FOREIGN KEY ("id_usuario") REFERENCES "Usuarios" ("id") ON DELETE CASCADE
);

-- Tabla DetalleVenta
CREATE TABLE "DetalleVenta" (
  "id" SERIAL PRIMARY KEY,
  "id_venta" INT NOT NULL,
  "id_producto" INT NOT NULL,
  "id_usuario" INT NOT NULL,
  "cantidad" INT NOT NULL,
  "precio_unitario" INT NOT NULL,
  FOREIGN KEY ("id_venta") REFERENCES "Ventas" ("id") ON DELETE CASCADE,
  FOREIGN KEY ("id_producto") REFERENCES "Productos" ("id") ON DELETE CASCADE,
  FOREIGN KEY ("id_usuario") REFERENCES "Usuarios" ("id") ON DELETE CASCADE
);

-- Tabla Pagos
CREATE TABLE "Pagos" (
  "id" SERIAL PRIMARY KEY,
  "id_venta" INT NOT NULL,
  "monto" INT NOT NULL,
  "metodo_pago" VARCHAR(255) NOT NULL,
  "estado_pago" VARCHAR(255) NOT NULL,
  "token" VARCHAR(255) NOT NULL,
  FOREIGN KEY ("id_venta") REFERENCES "Ventas" ("id") ON DELETE CASCADE
);

-- Tabla Logs
CREATE TABLE "Logs" (
  "id" SERIAL PRIMARY KEY,
  "tipo" VARCHAR(120) NOT NULL,
  "descripcion" VARCHAR(255) NOT NULL,
  "fecha" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla session
CREATE TABLE "session" (
  "sid" VARCHAR(255) PRIMARY KEY,
  "sess" JSON NOT NULL,
  "expire" TIMESTAMP NOT NULL
);

-- Tabla Pedidos
CREATE TABLE "Pedidos" (
  "id" SERIAL PRIMARY KEY,
  "id_venta" INT NOT NULL,
  "metodo_entrega" VARCHAR(50) NOT NULL CHECK (metodo_entrega IN ('retiro', 'envio')),
  "direccion_id" INT,
  "estado" VARCHAR(50) NOT NULL DEFAULT 'pendiente',
  FOREIGN KEY ("id_venta") REFERENCES "Ventas" ("id") ON DELETE CASCADE,
  FOREIGN KEY ("direccion_id") REFERENCES "Direcciones" ("id") ON DELETE CASCADE
);

-- Tabla Direcciones
CREATE TABLE "Direcciones" (
  "id" SERIAL PRIMARY KEY,
  "id_usuario" INT NOT NULL,
  "direccion" VARCHAR(255) NOT NULL,
  "ciudad" VARCHAR(100) NOT NULL,
  "codigo_postal" VARCHAR(20) NOT NULL,
  FOREIGN KEY ("id_usuario") REFERENCES "Usuarios" ("id") ON DELETE CASCADE
);

-- Tabla Reviews
CREATE TABLE "Reviews" (
  "id" SERIAL PRIMARY KEY,
  "id_usuario" INT NOT NULL,
  "id_producto" INT NOT NULL,
  "rating" INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  "comentario" TEXT,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("id_usuario") REFERENCES "Usuarios" ("id") ON DELETE CASCADE,
  FOREIGN KEY ("id_producto") REFERENCES "Productos" ("id") ON DELETE CASCADE
);

-- Tabla Wishlists
CREATE TABLE "Wishlists" (
  "id" SERIAL PRIMARY KEY,
  "id_usuario" INT NOT NULL,
  "id_producto" INT NOT NULL,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("id_usuario") REFERENCES "Usuarios" ("id") ON DELETE CASCADE,
  FOREIGN KEY ("id_producto") REFERENCES "Productos" ("id") ON DELETE CASCADE
);


-- Tabla Coupons
CREATE TABLE "Coupons" (
  "id" SERIAL PRIMARY KEY,
  "codigo" VARCHAR(50) NOT NULL UNIQUE,
  "descuento" DECIMAL(5, 2) NOT NULL,
  "fecha_expiracion" TIMESTAMP NOT NULL,
  "usos_restantes" INT NOT NULL,
  "id_usuario" INT NOT NULL,
  "id_producto" INT NOT NULL,
  FOREIGN KEY ("id_usuario") REFERENCES "Usuarios" ("id") ON DELETE CASCADE,
  FOREIGN KEY ("id_producto") REFERENCES "Productos" ("id") ON DELETE CASCADE
);

-- Añadir las constraints ON DELETE CASCADE
ALTER TABLE "Productos"
  DROP CONSTRAINT "Productos_categoria_id_fkey",
  ADD CONSTRAINT "Productos_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "CategoriasProductos" ("id") ON DELETE CASCADE;

ALTER TABLE "Ventas"
  DROP CONSTRAINT "Ventas_id_usuario_fkey",
  ADD CONSTRAINT "Ventas_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuarios" ("id") ON DELETE CASCADE;

ALTER TABLE "DetalleVenta"
  DROP CONSTRAINT "DetalleVenta_id_venta_fkey",
  ADD CONSTRAINT "DetalleVenta_id_venta_fkey" FOREIGN KEY ("id_venta") REFERENCES "Ventas" ("id") ON DELETE CASCADE,
  DROP CONSTRAINT "DetalleVenta_id_producto_fkey",
  ADD CONSTRAINT "DetalleVenta_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "Productos" ("id") ON DELETE CASCADE,
  DROP CONSTRAINT "DetalleVenta_id_usuario_fkey",
  ADD CONSTRAINT "DetalleVenta_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuarios" ("id") ON DELETE CASCADE;

ALTER TABLE "Pagos"
  DROP CONSTRAINT "Pagos_id_venta_fkey",
  ADD CONSTRAINT "Pagos_id_venta_fkey" FOREIGN KEY ("id_venta") REFERENCES "Ventas" ("id") ON DELETE CASCADE;

ALTER TABLE "Pedidos"
  DROP CONSTRAINT "Pedidos_id_venta_fkey",
  ADD CONSTRAINT "Pedidos_id_venta_fkey" FOREIGN KEY ("id_venta") REFERENCES "Ventas" ("id") ON DELETE CASCADE,
  DROP CONSTRAINT "Pedidos_direccion_id_fkey",
  ADD CONSTRAINT "Pedidos_direccion_id_fkey" FOREIGN KEY ("direccion_id") REFERENCES "Direcciones" ("id") ON DELETE CASCADE;

ALTER TABLE "Direcciones"
  DROP CONSTRAINT "Direcciones_id_usuario_fkey",
  ADD CONSTRAINT "Direcciones_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuarios" ("id") ON DELETE CASCADE;

ALTER TABLE "Reviews"
  DROP CONSTRAINT "Reviews_id_usuario_fkey",
  ADD CONSTRAINT "Reviews_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuarios" ("id") ON DELETE CASCADE,
  DROP CONSTRAINT "Reviews_id_producto_fkey",
  ADD CONSTRAINT "Reviews_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "Productos" ("id") ON DELETE CASCADE;

ALTER TABLE "Wishlists"
  DROP CONSTRAINT "Wishlists_id_usuario_fkey",
  ADD CONSTRAINT "Wishlists_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuarios" ("id") ON DELETE CASCADE,
  DROP CONSTRAINT "Wishlists_id_producto_fkey",
  ADD CONSTRAINT "Wishlists_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "Productos" ("id") ON DELETE CASCADE;

-- Agregar CHECK a la columna email en la tabla Usuarios
ALTER TABLE "Usuarios"
ADD CONSTRAINT check_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Agregar CHECK a la columna role en la tabla Usuarios
ALTER TABLE "Usuarios"
ADD CONSTRAINT check_role_values CHECK (role IN ('admin', 'user'));

-- Agregar CHECK a la columna precio en la tabla Productos
ALTER TABLE "Productos"
ADD CONSTRAINT check_precio_positive CHECK (precio > 0);

-- Agregar CHECK a la columna stock en la tabla Productos
ALTER TABLE "Productos"
ADD CONSTRAINT check_stock_non_negative CHECK (stock >= 0);

-- Agregar CHECK a la columna monto en la tabla Ventas
ALTER TABLE "Ventas"
ADD CONSTRAINT check_monto_positive CHECK (monto > 0);

-- Agregar CHECK a la columna cantidad en la tabla DetalleVenta
ALTER TABLE "DetalleVenta"
ADD CONSTRAINT check_cantidad_positive CHECK (cantidad > 0);

-- Agregar CHECK a la columna precio_unitario en la tabla DetalleVenta
ALTER TABLE "DetalleVenta"
ADD CONSTRAINT check_precio_unitario_positive CHECK (precio_unitario > 0);

-- Agregar CHECK a la columna monto en la tabla Pagos
ALTER TABLE "Pagos"
ADD CONSTRAINT check_monto_positive CHECK (monto > 0);

-- Agregar CHECK a la columna estado_pago en la tabla Pagos
ALTER TABLE "Pagos"
ADD CONSTRAINT check_estado_pago_values CHECK (estado_pago IN ('pendiente', 'completado', 'fallido'));

-- Agregar CHECK a la columna estado en la tabla Pedidos
ALTER TABLE "Pedidos"
ADD CONSTRAINT check_estado_values CHECK (estado IN ('pendiente', 'enviado', 'entregado'));

-- Agregar CHECK a la columna descuento en la tabla Coupons
ALTER TABLE "Coupons"
ADD CONSTRAINT check_descuento_range CHECK (descuento BETWEEN 0 AND 100);

-- Agregar CHECK a la columna usos_restantes en la tabla Coupons
ALTER TABLE "Coupons"
ADD CONSTRAINT check_usos_restantes_non_negative CHECK (usos_restantes >= 0);




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

INSERT INTO "CategoriasProductos" (nombre) VALUES
('Herramientas Manuales'),
('Herramientas Eléctricas'),
('Materiales de Construcción'),
('Pinturas y Accesorios'),
('Fontanería'),
('Electricidad'),
('Jardinería'),
('Ferretería General'),
('Adhesivos y Selladores'),
('Protección y Seguridad');
