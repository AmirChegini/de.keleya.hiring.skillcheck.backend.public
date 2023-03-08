export interface JwtTokenUser {
  id: number;
  isAdmin: boolean;
}
//MODIFIED
export const isJwtTokenUser = (candidate: unknown): candidate is JwtTokenUser => {
  const user = candidate as JwtTokenUser;
  return user.isAdmin !== undefined && user.id !== undefined;
};
