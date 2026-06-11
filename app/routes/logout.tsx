import { redirect } from "react-router";
import type { Route } from "./+types/logout";

export async function loader({ request }: Route.LoaderArgs) {
  const headers = new Headers();
  headers.set(
    "Set-Cookie",
    "mock-session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0"
  );
  return redirect("/login", { headers });
}
