import { redirect } from "react-router";
import { createClient } from "~/lib/server";
import type { Route } from "./+types/logout";

export async function action({ request }: Route.ActionArgs) {
  const { supabase, headers } = createClient(request);
  await supabase.auth.signOut();
  return redirect("/login", { headers });
}

export async function loader() {
  return redirect("/login");
}
