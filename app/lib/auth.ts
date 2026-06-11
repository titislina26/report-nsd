/**
 * Mock session utilities — replace with Supabase auth when backend is ready.
 */

export interface MockUser {
  email: string;
  name: string;
  role: string;
}

/**
 * Gets the current mock user from the request cookie.
 * Returns null if no session cookie is present.
 */
export function getMockUser(request: Request): MockUser | null {
  const cookieHeader = request.headers.get("Cookie") ?? "";
  const match = cookieHeader.match(/mock-session=([^;]+)/);
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match[1])) as MockUser;
  } catch {
    return null;
  }
}

/**
 * Requires a valid mock session. Throws a redirect to /login if not found.
 */
export function requireMockUser(request: Request): MockUser {
  const user = getMockUser(request);
  if (!user) {
    throw new Response(null, {
      status: 302,
      headers: { Location: "/login" },
    });
  }
  return user;
}
