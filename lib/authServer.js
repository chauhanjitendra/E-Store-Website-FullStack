import { jwtVerify } from "jose";
import { cookies } from "next/headers"; // ✅ server-only
import { catchError } from "./helperFunction";

export const isAuthenticated = async (role) => {
  try {
    const cookieStore = cookies(); // server-side only
    if (!cookieStore.has("access_token")) {
      return { isAuth: false };
    }

    const access_token = cookieStore.get("access_token");
    const { payload } = await jwtVerify(
      access_token.value,
      new TextEncoder().encode(process.env.SECRET_KEY)
    );

    if (payload.role !== role) {
      return { isAuth: false };
    }

    return { isAuth: true, userId: payload._id };
  } catch (error) {
    catchError(error);
    return { isAuth: false, error };
  }
};
