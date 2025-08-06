import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  LoginInputSchemaType,
  RegisterInputSchemaType,
} from "../utils/schema/auth.schema";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { TUserRole } from "../types";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

export class AuthService {
  async register(data: RegisterInputSchemaType) {
    const [existing] = await db
      .select({ username: users.username })
      .from(users)
      .where(eq(users.username, data.username))
      .limit(1);

    if (existing) {
      throw new Error("username has taken");
    }

    const hashed = await bcrypt.hash(data.password, 10);

    await db
      .insert(users)
      .values({
        username: data.username,
        password: hashed,
      })
      .returning();
  }

  async login(data: LoginInputSchemaType) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, data.username))
      .limit(1);

    if (!user) {
      throw new Error("username not found");
    }

    const isValid = await bcrypt.compare(data.password, user.password);

    if (!isValid) {
      throw new Error("password not match");
    }

    const payload = { id: user.id, username: user.username, role: user.role };

    const accessToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
      expiresIn: "24h",
    });

    await db.update(users).set({ refreshToken }).where(eq(users.id, user.id));

    return { accessToken, refreshToken };
  }

  async refreshToken(token: string) {
    let payload;

    try {
      payload = jwt.verify(token, JWT_REFRESH_SECRET) as {
        id: string;
        username: string;
        role: TUserRole;
      };
    } catch (error) {
      throw new Error("Invalid refresh token");
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, payload.id));

    if (!user || user.refreshToken !== token) {
      throw new Error("Invalid refresh token");
    }

    const newAccessToken = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    return { accessToken: newAccessToken };
  }

  async logout(refreshToken: string) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.refreshToken, refreshToken));

    if (!user) return;

    await db
      .update(users)
      .set({ refreshToken: null })
      .where(eq(users.id, user.id));
  }
}
