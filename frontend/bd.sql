-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 20-07-2026 a las 03:06:14
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `bolsa_trabajo_jb`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id`, `nombre`, `slug`) VALUES
(1, 'Tecnología y Sistemas', 'tecnolog-a-y-sistemas');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empresas_clientes`
--

CREATE TABLE `empresas_clientes` (
  `id` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `ruc` varchar(20) NOT NULL,
  `sector` varchar(100) NOT NULL,
  `logo_url` varchar(500) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `estado` enum('activo','inactivo') NOT NULL DEFAULT 'activo',
  `fecha_registro` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `empresas_clientes`
--

INSERT INTO `empresas_clientes` (`id`, `nombre`, `ruc`, `sector`, `logo_url`, `descripcion`, `estado`, `fecha_registro`) VALUES
(1, 'I.seg', '10756036373', 'Seguridad industrial', '', '', 'activo', '2026-07-02 12:05:51');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ofertas_trabajo`
--

CREATE TABLE `ofertas_trabajo` (
  `id` int(11) NOT NULL,
  `empresa_id` int(11) NOT NULL,
  `titulo` varchar(150) NOT NULL,
  `slug` varchar(150) NOT NULL,
  `descripcion` text NOT NULL,
  `requisitos` text DEFAULT NULL,
  `salario_min` decimal(10,2) DEFAULT NULL,
  `salario_max` decimal(10,2) DEFAULT NULL,
  `ubicacion` varchar(100) DEFAULT NULL,
  `modalidad` enum('presencial','remoto','híbrido') NOT NULL DEFAULT 'presencial',
  `tipo_contrato` enum('indefinido','temporal','freelance','prácticas','por_horas') NOT NULL DEFAULT 'indefinido',
  `nivel_experiencia` enum('junior','semisenior','senior','gerente') DEFAULT NULL,
  `categoria_id` int(11) DEFAULT NULL,
  `estado` enum('activa','pausada','eliminada') NOT NULL DEFAULT 'activa',
  `vistas_count` int(11) NOT NULL DEFAULT 0,
  `fecha_creacion` datetime NOT NULL DEFAULT current_timestamp(),
  `fecha_expiracion` datetime NOT NULL DEFAULT (current_timestamp() + interval 90 day)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ofertas_trabajo`
--

INSERT INTO `ofertas_trabajo` (`id`, `empresa_id`, `titulo`, `slug`, `descripcion`, `requisitos`, `salario_min`, `salario_max`, `ubicacion`, `modalidad`, `tipo_contrato`, `nivel_experiencia`, `categoria_id`, `estado`, `vistas_count`, `fecha_creacion`, `fecha_expiracion`) VALUES
(1, 1, 'Desarrollador Frontend React Js', 'desarrollador-frontend-react-js-19377', 'Buscamos un desarrollador apasionado por crear interfaces limpias y rápidas. Trabajarás directo con el equipo de producto.', '- 2 años de experiencia en React\n- Conocimiento avanzado de Tailwind CSS\n- Uso de Git y GitHub', 2500.00, 3500.00, 'Lima, Perú', 'híbrido', 'indefinido', 'semisenior', 1, 'activa', 0, '2026-07-02 14:09:37', '2026-09-30 14:09:37');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `postulaciones_candidatos`
--

CREATE TABLE `postulaciones_candidatos` (
  `id` int(11) NOT NULL,
  `usuario_id` varchar(36) NOT NULL,
  `oferta_id` int(11) NOT NULL,
  `cv_enviado_url` varchar(500) DEFAULT NULL,
  `estado` enum('recibido','revisado','rechazado','aprobado') NOT NULL DEFAULT 'recibido',
  `notas_internas` text DEFAULT NULL,
  `fecha_postulacion` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `preguntas_oferta`
--

CREATE TABLE `preguntas_oferta` (
  `id` int(11) NOT NULL,
  `oferta_id` int(11) NOT NULL,
  `pregunta` varchar(255) NOT NULL,
  `obligatoria` tinyint(1) NOT NULL DEFAULT 0,
  `orden` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `respuestas_postulacion`
--

CREATE TABLE `respuestas_postulacion` (
  `id` int(11) NOT NULL,
  `postulacion_id` int(11) NOT NULL,
  `pregunta_id` int(11) NOT NULL,
  `respuesta_texto` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles_sistema`
--

CREATE TABLE `roles_sistema` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `roles_sistema`
--

INSERT INTO `roles_sistema` (`id`, `nombre`, `descripcion`) VALUES
(1, 'admin', 'Administrador de la Consultora JB con acceso total'),
(2, 'usuario', 'Candidato que busca postular a ofertas de trabajo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` varchar(36) NOT NULL DEFAULT uuid(),
  `rol_id` int(11) NOT NULL,
  `google_id` varchar(255) DEFAULT NULL,
  `nombre_completo` varchar(150) NOT NULL,
  `correo` varchar(150) NOT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `cv_url` varchar(500) DEFAULT NULL,
  `texto_presentacion` text DEFAULT NULL,
  `estado` enum('activo','inactivo') NOT NULL DEFAULT 'activo',
  `correo_verificado` tinyint(1) NOT NULL DEFAULT 0,
  `fecha_registro` datetime NOT NULL,
  `codigo_recuperacion` varchar(6) DEFAULT NULL,
  `expiracion_codigo` datetime DEFAULT NULL,
  `ultimo_cambio_password` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `rol_id`, `google_id`, `nombre_completo`, `correo`, `password_hash`, `telefono`, `cv_url`, `texto_presentacion`, `estado`, `correo_verificado`, `fecha_registro`, `codigo_recuperacion`, `expiracion_codigo`, `ultimo_cambio_password`) VALUES
('0e610778-27e1-46c1-a37a-bbf2cd3935bb', 2, NULL, 'Diana Isabel Pure Tocre', 'u22226149@utp.edu.pe', '$2y$12$rx/B0gnu.AQo.RY03F/ereBxe6LV/Bh1CzO4h/OukaMTFYfKsQ5Bi', '999999999', 'uploads/cvs/0e610778-27e1-46c1-a37a-bbf2cd3935bb_1783008487.pdf', 'Soy un trabajador responsable, lo juro, no soy vago, enserio lo juro, aunque tengo vagancia si eso si, pero juro no soy vago', 'inactivo', 1, '2026-07-01 12:41:56', NULL, NULL, '2026-07-02 11:11:33'),
('84331b77-5776-48e5-83d9-e2f870d8e5f9', 1, NULL, 'Administrador', 'admin@gmail.com', '$2y$12$dF5ovaBcrAABe6ySvxiqu.eFz4PjL6Ps2KF6552LCeUWj5RyHtmaa', '999999999', NULL, NULL, 'activo', 0, '2026-07-02 12:02:38', NULL, NULL, NULL),
('fbe08a4b-4897-485c-a62e-bc1f72350a4f', 2, '105014274378632286529', 'Carlos Pure', 'carlospure2011@gmail.com', NULL, NULL, NULL, NULL, 'activo', 1, '2026-07-01 14:59:57', NULL, NULL, NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indices de la tabla `empresas_clientes`
--
ALTER TABLE `empresas_clientes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ruc` (`ruc`),
  ADD UNIQUE KEY `uq_empresa_nombre` (`nombre`);

--
-- Indices de la tabla `ofertas_trabajo`
--
ALTER TABLE `ofertas_trabajo`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `fk_oferta_empresa` (`empresa_id`),
  ADD KEY `idx_ofertas_estado_fecha` (`estado`,`fecha_creacion`),
  ADD KEY `idx_ofertas_categoria` (`categoria_id`),
  ADD KEY `idx_ofertas_modalidad` (`modalidad`),
  ADD KEY `idx_ofertas_tipo_contrato` (`tipo_contrato`);

--
-- Indices de la tabla `postulaciones_candidatos`
--
ALTER TABLE `postulaciones_candidatos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_postulacion_usuario_oferta` (`usuario_id`,`oferta_id`),
  ADD KEY `idx_postulaciones_usuario` (`usuario_id`),
  ADD KEY `idx_postulaciones_oferta` (`oferta_id`);

--
-- Indices de la tabla `preguntas_oferta`
--
ALTER TABLE `preguntas_oferta`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_pregunta_orden` (`oferta_id`,`orden`);

--
-- Indices de la tabla `respuestas_postulacion`
--
ALTER TABLE `respuestas_postulacion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_respuesta_postulacion` (`postulacion_id`),
  ADD KEY `fk_respuesta_pregunta` (`pregunta_id`);

--
-- Indices de la tabla `roles_sistema`
--
ALTER TABLE `roles_sistema`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `correo` (`correo`),
  ADD KEY `fk_usuario_rol` (`rol_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `empresas_clientes`
--
ALTER TABLE `empresas_clientes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `ofertas_trabajo`
--
ALTER TABLE `ofertas_trabajo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `postulaciones_candidatos`
--
ALTER TABLE `postulaciones_candidatos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `preguntas_oferta`
--
ALTER TABLE `preguntas_oferta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `respuestas_postulacion`
--
ALTER TABLE `respuestas_postulacion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `roles_sistema`
--
ALTER TABLE `roles_sistema`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `ofertas_trabajo`
--
ALTER TABLE `ofertas_trabajo`
  ADD CONSTRAINT `fk_oferta_categoria` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`),
  ADD CONSTRAINT `fk_oferta_empresa` FOREIGN KEY (`empresa_id`) REFERENCES `empresas_clientes` (`id`);

--
-- Filtros para la tabla `postulaciones_candidatos`
--
ALTER TABLE `postulaciones_candidatos`
  ADD CONSTRAINT `fk_postulacion_oferta` FOREIGN KEY (`oferta_id`) REFERENCES `ofertas_trabajo` (`id`),
  ADD CONSTRAINT `fk_postulacion_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `preguntas_oferta`
--
ALTER TABLE `preguntas_oferta`
  ADD CONSTRAINT `fk_pregunta_oferta` FOREIGN KEY (`oferta_id`) REFERENCES `ofertas_trabajo` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `respuestas_postulacion`
--
ALTER TABLE `respuestas_postulacion`
  ADD CONSTRAINT `fk_respuesta_postulacion` FOREIGN KEY (`postulacion_id`) REFERENCES `postulaciones_candidatos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_respuesta_pregunta` FOREIGN KEY (`pregunta_id`) REFERENCES `preguntas_oferta` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `fk_usuario_rol` FOREIGN KEY (`rol_id`) REFERENCES `roles_sistema` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;


-- 1) Agregar columnas nuevas a preguntas_oferta
ALTER TABLE preguntas_oferta
  ADD COLUMN tipo enum('si_no','opciones','texto','numero') NOT NULL DEFAULT 'texto' AFTER pregunta,
  ADD COLUMN opciones longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
      CHECK (json_valid(opciones)) AFTER tipo;

-- 2) IMPORTANTE: primero mapear los datos existentes de ofertas_trabajo
--    antes de alterar los enums (ajusta el mapeo según tu criterio real)
UPDATE ofertas_trabajo SET modalidad = 'Híbrida' WHERE modalidad = 'híbrido';

UPDATE ofertas_trabajo SET tipo_contrato = 'Permanente'   WHERE tipo_contrato = 'indefinido';
UPDATE ofertas_trabajo SET tipo_contrato = 'Temporal'     WHERE tipo_contrato = 'temporal';
UPDATE ofertas_trabajo SET tipo_contrato = 'Freelance'    WHERE tipo_contrato = 'freelance';
UPDATE ofertas_trabajo SET tipo_contrato = 'Prácticas'    WHERE tipo_contrato = 'prácticas';
UPDATE ofertas_trabajo SET tipo_contrato = 'Medio tiempo' WHERE tipo_contrato = 'por_horas';

-- 3) Ahora sí, alterar los enums y el charset/collation de la tabla
ALTER TABLE ofertas_trabajo
  MODIFY modalidad enum('presencial','remoto','Híbrida') NOT NULL DEFAULT 'presencial',
  MODIFY tipo_contrato enum('Tiempo completo','Permanente','Medio tiempo','Freelance','Prácticas','Temporal') NOT NULL DEFAULT 'Tiempo completo',
  ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 4) Agregar campo de programación de convocatoria
ALTER TABLE ofertas_trabajo 
ADD COLUMN fecha_publicacion DATETIME NULL DEFAULT NULL 
AFTER fecha_creacion;

-- 5) Tabla de notificaciones para el admin
CREATE TABLE `notificaciones` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` varchar(36) NOT NULL,
  `tipo` varchar(50) NOT NULL DEFAULT 'nueva_postulacion',
  `titulo` varchar(255) NOT NULL,
  `mensaje` text NOT NULL,
  `leida` tinyint(1) NOT NULL DEFAULT 0,
  `referencia_tipo` varchar(50) DEFAULT NULL,
  `referencia_id` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_notif_usuario` (`usuario_id`),
  KEY `idx_notif_leida` (`leida`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;