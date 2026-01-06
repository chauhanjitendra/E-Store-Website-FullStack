import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export const isAuthenticated = async (role) => {
  try {
    const token = cookies().get("access_token")?.value;
    if (!token) return { isAuth: false };

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    if (role && payload.role !== role) {
      return { isAuth: false };
    }

    return {
      isAuth: true,
      userId: payload._id,
      role: payload.role,
    };
  } catch (error) {
    return { isAuth: false };
  }
};
