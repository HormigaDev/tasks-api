# Scripts para desarrolladores

Esta carpeta contiene scripts que se pueden usar en ambiente de desarrollo

## Esta guía asume que ya siguió la guía de instalación en el [README](../docs/md/README_ES.md)

## Generando permisos para los roles

- Para calcular los permisos puedes ejecutar:

```bash
docker exec -it app-tasks-api bash
npm run perms
```

> Verifica que el archivo enum `src/common/enums/Permissions.enum.ts` esté en el lugar correcto si no, el script fallará

- Verá una salida como esta:

```bash
✅ Archivo generado correctamente en: /app/dist/permissions.json
? Select the permissions. Use SPACE to select and ENTER to confirm. ›
  Crear Usuarios
  Ver Usuarios
  Actualizar Usuarios
  Eliminar Usuarios
  Administrador
```

- Seleccione los permisos usando SPACE y confirme usando ENTER verá una salida de los permisos calculados:

```bash
Calculated Permissions Value: 1999
```

- Use esos permisos para crear el rol que desee
