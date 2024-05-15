CREATE TABLE `Usuarios` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `nombre` varchar(120),
  `email` varchar(120),
  `password` varchar(120),
  `role` varchar(120),
  `created_at` timestamp
);

CREATE TABLE `CategoriasProductos` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `nombre` varchar(120)
);

CREATE TABLE `Productos` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `nombre` varchar(120),
  `precio` int,
  `descripcion` varchar(250),
  `stock` int,
  `categoria_id` int
);

CREATE TABLE `Ventas` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `id_usuario` int,
  `monto` int
);

CREATE TABLE `DetalleVenta` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `id_venta` int,
  `id_producto` int,
  `id_usuario` int,
  `cantidad` int,
  `precio_unitario` int
);

CREATE TABLE `Pagos` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `id_venta` int,
  `monto` int,
  `metodo_pago` varchar(255),
  `estado_pago` varchar(255)
);

CREATE TABLE `Logs` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `tipo` varchar(120),
  `descripcion` varchar(255),
  `fecha` timestamp
);

ALTER TABLE `Productos` ADD FOREIGN KEY (`categoria_id`) REFERENCES `CategoriasProductos` (`id`);

ALTER TABLE `Ventas` ADD FOREIGN KEY (`id_usuario`) REFERENCES `Usuarios` (`id`);

ALTER TABLE `DetalleVenta` ADD FOREIGN KEY (`id_venta`) REFERENCES `Ventas` (`id`);

ALTER TABLE `DetalleVenta` ADD FOREIGN KEY (`id_producto`) REFERENCES `Productos` (`id`);

ALTER TABLE `DetalleVenta` ADD FOREIGN KEY (`id_usuario`) REFERENCES `Usuarios` (`id`);

ALTER TABLE `Pagos` ADD FOREIGN KEY (`id_venta`) REFERENCES `Ventas` (`id`);
