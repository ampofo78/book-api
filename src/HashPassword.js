import * as Bcrypt from "bcrypt";

const salt = Bcrypt.genSaltSync(10);

export const hashPassword = (password) => {
  return Bcrypt.hashSync(password, salt);
};

export const comparePassword = (data, hashPassword) => {
  return Bcrypt.compareSync(data, hashPassword);
};
