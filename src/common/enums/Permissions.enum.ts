// Al actualizar los permisos aqui debe actualizarse su contraparte de JS en
// dev/perms.js
// Y también actualizar src/sql/db.sql
export const Permissions = {
    CreateUsers: 1n << 0n,
    ReadUsers: 1n << 1n,
    UpdateUsers: 1n << 2n,
    DeleteUsers: 1n << 3n,

    Admin: 1n << 4n,

    CreateRoles: 1n << 5n,
    ReadRoles: 1n << 6n,
    UpdateRoles: 1n << 7n,
    DeleteRoles: 1n << 8n,

    ReadMySelf: 1n << 11n,
    UpdateMySelf: 1n << 12n,
    DeleteMySelf: 1n << 13n,

    CreateCategories: 1n << 14n,
    ReadCategories: 1n << 15n,
    UpdateCategories: 1n << 16n,
    DeleteCategories: 1n << 17n,

    CreateTags: 1n << 18n,
    ReadTags: 1n << 19n,
    UpdateTags: 1n << 20n,
    DeleteTags: 1n << 21n,

    CreateTasks: 1n << 22n,
    ReadTasks: 1n << 23n,
    UpdateTasks: 1n << 24n,
    DeleteTasks: 1n << 25n,

    CreateSubtasks: 1n << 26n,
    ReadSubtasks: 1n << 27n,
    UpdateSubtasks: 1n << 28n,
    DeleteSubtasks: 1n << 29n,

    CreateMilestones: 1n << 30n,
    ReadMilestones: 1n << 31n,
    UpdateMilestones: 1n << 32n,
    DeleteMilestones: 1n << 33n,

    CreateComments: 1n << 34n,
    ReadComments: 1n << 35n,
    UpdateComments: 1n << 36n,
    DeleteComments: 1n << 37n,

    SaveAttachments: 1n << 38n,
    ReadAttachments: 1n << 39n,
    DeleteAttachments: 1n << 40n,
};

export const PermissionsDict = [
    { id: Permissions.CreateUsers, name: 'Crear Usuarios' },
    { id: Permissions.ReadUsers, name: 'Ver Usuarios' },
    { id: Permissions.UpdateUsers, name: 'Actualizar Usuarios' },
    { id: Permissions.DeleteUsers, name: 'Eliminar Usuarios' },

    { id: Permissions.Admin, name: 'Administrador' },

    { id: Permissions.CreateRoles, name: 'Crear Roles' },
    { id: Permissions.ReadRoles, name: 'Ver Roles' },
    { id: Permissions.UpdateRoles, name: 'Actualizar Roles' },
    { id: Permissions.DeleteRoles, name: 'Eliminar Roles' },

    { id: Permissions.ReadMySelf, name: 'Ver Mi Perfil' },
    { id: Permissions.UpdateMySelf, name: 'Actualizar Mi Perfil' },
    { id: Permissions.DeleteMySelf, name: 'Eliminar Mi Perfil' },

    { id: Permissions.CreateCategories, name: 'Crear Categorías' },
    { id: Permissions.ReadCategories, name: 'Ver Categorías' },
    { id: Permissions.UpdateCategories, name: 'Actualizar Categorías' },
    { id: Permissions.DeleteCategories, name: 'Eliminar Categorías' },

    { id: Permissions.CreateTags, name: 'Crear Etiquetas' },
    { id: Permissions.ReadTags, name: 'Ver Etiquetas' },
    { id: Permissions.UpdateTags, name: 'Actualizar Etiquetas' },
    { id: Permissions.DeleteTags, name: 'Eliminar Etiquetas' },

    { id: Permissions.CreateTasks, name: 'Crear Tareas' },
    { id: Permissions.ReadTasks, name: 'Ver Tareas' },
    { id: Permissions.UpdateTasks, name: 'Actualizar Tareas' },
    { id: Permissions.DeleteTasks, name: 'Eliminar Tareas' },

    { id: Permissions.CreateSubtasks, name: 'Crear Subtareas' },
    { id: Permissions.ReadSubtasks, name: 'Ver Subtareas' },
    { id: Permissions.UpdateSubtasks, name: 'Actualizar Subtareas' },
    { id: Permissions.DeleteSubtasks, name: 'Eliminar Subtareas' },

    { id: Permissions.CreateMilestones, name: 'Crear Hitos' },
    { id: Permissions.ReadMilestones, name: 'Ver Hitos' },
    { id: Permissions.UpdateMilestones, name: 'Actualizar Hitos' },
    { id: Permissions.DeleteMilestones, name: 'Eliminar Hitos' },

    { id: Permissions.CreateComments, name: 'Crear Comentarios' },
    { id: Permissions.ReadComments, name: 'Ver Comentarios' },
    { id: Permissions.UpdateComments, name: 'Actualizar Comentarios' },
    { id: Permissions.DeleteComments, name: 'Eliminar Comentarios' },

    { id: Permissions.SaveAttachments, name: 'Guardar Archivos Adjuntos' },
    { id: Permissions.ReadAttachments, name: 'Ver Archivos Adjuntos' },
    { id: Permissions.DeleteAttachments, name: 'Eliminar Archivos Adjuntos' },
];
