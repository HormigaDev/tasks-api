// Al actualizar los permisos aqui debe actualizarse su contraparte de JS en
// dev/perms.js
// Y también actualizar src/sql/db.sql
export enum Permissions {
    CreateUsers = 1,
    ReadUsers = 2,
    UpdateUsers = 4,
    DeleteUsers = 16,

    Admin = 8,

    CreateRoles = 32,
    ReadRoles = 64,
    UpdateRoles = 128,
    DeleteRoles = 256,

    ManageUsers = 512,
    ManageRoles = 1024,
}

export const PermissionsDict = [
    {
        id: Permissions.CreateUsers,
        name: 'Crear Usuarios',
    },
    {
        id: Permissions.ReadUsers,
        name: 'Ver Usuarios',
    },
    {
        id: Permissions.UpdateUsers,
        name: 'Actualizar Usuarios',
    },
    {
        id: Permissions.DeleteUsers,
        name: 'Eliminar Usuarios',
    },
    {
        id: Permissions.CreateRoles,
        name: 'Crear Roles',
    },
    {
        id: Permissions.ReadRoles,
        name: 'Ver Roles',
    },
    {
        id: Permissions.UpdateRoles,
        name: 'Actualizar Roles',
    },
    {
        id: Permissions.DeleteRoles,
        name: 'Eliminar Roles',
    },
    {
        id: Permissions.ManageUsers,
        name: 'Gestionar Usuarios',
    },
    {
        id: Permissions.ManageRoles,
        name: 'Gestionar Roles',
    },
];
