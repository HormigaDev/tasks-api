import { SetMetadata } from '@nestjs/common';

export const PERMISSION_KEY = 'permissions';

export const RequirePermissions = (permissions: bigint[], optional: boolean = false) =>
    SetMetadata(PERMISSION_KEY, { permissions, optional });
