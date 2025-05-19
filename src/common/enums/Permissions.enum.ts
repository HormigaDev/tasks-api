// Al actualizar los permisos aqui debe actualizarse su contraparte de JS en
// dev/perms.js
// Y también actualizar src/sql/db.sql
export enum Permissions {
    CreateUsers = 2 ** 0,
    ReadUsers = 2 ** 1,
    UpdateUsers = 2 ** 2,
    DeleteUsers = 2 ** 3,

    Admin = 2 ** 4,

    CreateRoles = 2 ** 5,
    ReadRoles = 2 ** 6,
    UpdateRoles = 2 ** 7,
    DeleteRoles = 2 ** 8,

    ManageUsers = 2 ** 9,
    ManageRoles = 2 ** 10,

    ReadMySelf = 2 ** 11,
    UpdateMySelf = 2 ** 12,
    DeleteMySelf = 2 ** 13,

    CreateCategories = 2 ** 14,
    ReadCategories = 2 ** 15,
    UpdateCategories = 2 ** 16,
    DeleteCategories = 2 ** 17,

    CreateTags = 2 ** 18,
    ReadTags = 2 ** 19,
    UpdateTags = 2 ** 20,
    DeleteTags = 2 ** 21,

    CreateTasks = 2 ** 22,
    ReadTasks = 2 ** 23,
    UpdateTasks = 2 ** 24,
    DeleteTasks = 2 ** 25,

    CreateSubtasks = 2 ** 26,
    ReadSubtasks = 2 ** 27,
    UpdateSubtasks = 2 ** 28,
    DeleteSubtasks = 2 ** 29,

    CreateMilestones = 2 ** 30,
    ReadMilestones = 2 ** 31,
    UpdateMilestones = 2 ** 32,
    DeleteMilestones = 2 ** 33,

    CreateComments = 2 ** 34,
    ReadComments = 2 ** 35,
    UpdateComments = 2 ** 36,
    DeleteComments = 2 ** 37,

    CreateAttachments = 2 ** 38,
    ReadAttachments = 2 ** 39,
    UpdateAttachments = 2 ** 40,
    DeleteAttachments = 2 ** 41,
}

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

    { id: Permissions.ManageUsers, name: 'Gestionar Usuarios' },
    { id: Permissions.ManageRoles, name: 'Gestionar Roles' },

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

    { id: Permissions.CreateAttachments, name: 'Crear Archivos Adjuntos' },
    { id: Permissions.ReadAttachments, name: 'Ver Archivos Adjuntos' },
    { id: Permissions.UpdateAttachments, name: 'Actualizar Archivos Adjuntos' },
    { id: Permissions.DeleteAttachments, name: 'Eliminar Archivos Adjuntos' },
];
