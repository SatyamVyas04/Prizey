import bcrypt from 'bcryptjs';
export function saltHashPassword(password) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}
