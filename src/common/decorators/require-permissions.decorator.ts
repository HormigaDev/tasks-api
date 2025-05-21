import { SetMetadata } from '@nestjs/common';
import { Permissions } from '../enums/Permissions.enum';

export const PERMISSION_KEY = 'permissions';

export const RequirePermissions = (permissions: Permissions[], optional: boolean = false) =>
    SetMetadata(PERMISSION_KEY, { permissions, optional });
