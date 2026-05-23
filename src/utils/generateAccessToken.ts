import jwt, { Secret } from "jsonwebtoken";

const generateAccessToken = (userId: string) => {
  return jwt.sign(
    { id: userId },

    process.env.JWT_SECRET as Secret,

    {
      expiresIn: "15m",
    },
  );
};

export default generateAccessToken;
