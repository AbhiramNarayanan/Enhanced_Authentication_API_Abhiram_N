import bcrypt from "bcryptjs";

const plainTextPassword = "abhiram";

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

const hashedPassword = bcrypt.hashSync(plainTextPassword, salt);

console.log("Hashed Password:", hashedPassword);
