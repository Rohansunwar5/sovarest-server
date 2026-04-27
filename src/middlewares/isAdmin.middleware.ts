import verifyAdminToken from './auth/verify-admin-token.middleware';
import requireAdminAuth from './auth/require-admin-auth.middleware';

const isAdmin = [verifyAdminToken, requireAdminAuth];

export default isAdmin;
