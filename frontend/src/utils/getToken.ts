import Cookies from "js-cookie";
import { cookies as serverCookies } from "next/headers";

const isServer = typeof window === "undefined";

export async function getToken() {
  if (isServer) {
    const cookieStore = await serverCookies();
    return cookieStore.get("token")?.value || "";
  } else {
    return Cookies.get("token") || "";
  }
}
