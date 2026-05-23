import jwt, { Secret } from "jsonwebtoken";

const generateRefreshToken = (userId: string) => {
  return jwt.sign(
    { id: userId },

    process.env.JWT_SECRET as Secret,

    {
      expiresIn: "7d",
    },
  );
};

export default generateRefreshToken;
