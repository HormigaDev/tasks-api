# 🛡️ Política de Seguridad

## 🚧 Versiones Soportadas

| Versión | Soportada |
| ------- | --------- |
| latest  | ✅        |

Este proyecto recibe mantenimiento activo, incluyendo actualizaciones de seguridad cuando es necesario.

---

## 🔐 Consideraciones de Seguridad

Este proyecto ha sido desarrollado aplicando medidas razonables para mitigar riesgos de seguridad comunes en aplicaciones web modernas:

- **Autenticación:** Basada en JWT mediante Passport Strategy. Todos los endpoints requieren autenticación.
- **Autorización:** Implementación de control de acceso, garantizando que los datos sean accesibles únicamente por sus propietarios.
- **Persistencia Segura:** Uso de PostgreSQL con restricciones relacionales adecuadas para proteger la integridad de los datos.
- **Gestión de Sesiones:** Arquitectura sin estado mediante JWT.
- **Cache:** Redis implementado con manejo controlado de claves, minimizando exposición innecesaria de datos.
- **Entorno de Ejecución:** Contenedores Docker configurados para evitar la ejecución de procesos como root.
- **Validación de Datos:** Validación estricta de las entradas a nivel de DTO utilizando `class-validator` en NestJS.
- **Gestión de Errores:** Respuestas controladas, evitando la exposición de detalles internos del sistema.
- **Seguridad en Configuración:** Políticas CORS configuradas de forma restrictiva por defecto y manejo seguro de variables de entorno.

---

## 📣 Reporte de Vulnerabilidades

Si detectas una posible vulnerabilidad, te solicitamos reportarla de forma responsable.

- **Correo:** hormigadev7@gmail.com
- **Nota:** No abras issues públicos en GitHub para reportes relacionados con seguridad.

**Tiempo estimado de respuesta:** hasta **72 horas**.

---

## 📜 Política de Divulgación

- Los reportes serán evaluados y, en caso de confirmarse, tratados de forma privada.
- La divulgación pública se realizará únicamente después de que haya un parche disponible.
- Se acreditará la colaboración a quien reporte la vulnerabilidad, salvo que solicite permanecer en el anonimato.

---

## 🔍 Vulnerabilidades Fuera de Alcance

- Problemas derivados de configuraciones inseguras por parte del usuario (ejecutar sin `.env`, exponer puertos de servicios internos como Redis o PostgreSQL, desactivar autenticación, etc.).
- Vulnerabilidades en dependencias externas que ya cuenten con actualizaciones de seguridad disponibles y no hayan sido aplicadas en el entorno del usuario.

---

## 🚀 Recomendaciones para un Despliegue Seguro

- Asegúrate de tener las variables de entorno correctamente configuradas (`JWT_SECRET`, `DATABASE_URL`, etc.).
- No expongas puertos sensibles como los de Redis o PostgreSQL. Utiliza redes internas de Docker o VPN.
- Implementa HTTPS en producción.
- Rota periódicamente los secretos y credenciales.
- Utiliza imágenes de contenedor verificadas y realiza análisis de seguridad (por ejemplo, con Trivy o Docker Scout).

---

## 🔥 Importancia de la Seguridad

Este documento refleja el compromiso de este proyecto con la aplicación de medidas que contribuyen a mitigar riesgos comunes de seguridad. Aunque ningún sistema es completamente inmune, se han tomado decisiones orientadas a ofrecer un nivel de protección acorde a los estándares razonables en el desarrollo de software moderno.

---
