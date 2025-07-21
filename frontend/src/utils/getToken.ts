import Cookies from "js-cookie";

export function getClientToken() {
  return Cookies.get("token") || "";
}
