import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-for-dev-only";

export const hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hashed: string) => {
    return bcrypt.compare(password, hashed);
};

export const signToken = (payload: any) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};
