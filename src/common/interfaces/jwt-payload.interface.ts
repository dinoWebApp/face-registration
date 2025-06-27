export interface JwtPayload {
  id: number;
  email: string;
  permission: string;
  isDeviceAdmin: boolean;
  iat: number;
  exp: number;
}
