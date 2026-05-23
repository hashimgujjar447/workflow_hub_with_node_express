import jwt, { Secret } from "jsonwebtoken";

const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET as Secret) as { id: string };
};

export default verifyToken;
