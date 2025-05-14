# NEST API TEMPLATE

Una plantilla simple para crear una API RESTful con NestJS.

La plantilla incluye:

- [Sistema de autenticación](#sistema-de-autenticacion)
- [Control de permisos granulares](#control-de-permisos-granulares)
- [Mitigación de ataques de fuerza bruta](#mitigación-de-ataques-de-fuerza-bruta)
- [Configuración para el CLI R-BACKUPS](configuracion-para-el-cli-r-backups)
- [Documentación con Swagger](#documentacion-con-swagger)

## Sistema de autenticación

La plantilla incluye un sistema de autenticación simple y robusto por email y contraseña.
Este sistema de autenticación puede utilizar 2 tipos de estrategia `cookie` o `bearer` la cual se puede configurar simplemente informando la variable de entorno `JWT_STRATEGY`.
El cual guardará el token de autenticación en la cookie `auth_token` si la estrategia es `cookie` y devolverá un token en la respuesta http si es `bearer`.
