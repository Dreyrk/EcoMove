"use server";

import { authFetcher } from "@/utils/authFetcher";
import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";

export default async function logout() {
  try {
    const res = await authFetcher("logout");

    if (!res.success) {
      console.error(res.message);
    }

    const cookieStore = await cookies();

    cookieStore.delete("token");
  } catch (e) {
    console.error(e);
  }
  redirect("/login", RedirectType.replace);
}
