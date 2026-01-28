import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function isAuthenticated(requiredRole) {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return { isAuth: false };
    }

    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const { payload } = await jwtVerify(token, secret);

    if (requiredRole && payload.role !== requiredRole) {
      return { isAuth: false };
    }

    return {
      isAuth: true,
      user: payload,
    };

  } catch (error) {
    console.error("AUTH ERROR:", error);
    return { isAuth: false };
  }
}
