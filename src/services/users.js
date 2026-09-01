import { usersUrl, request } from "../lib/supabase";

// Finder en bruger ud fra deres email
export async function getUserByEmail(email) {
  // Finder adressen til users-tabellen
  const url = usersUrl();

  // Finder den bruger hvor email passer
  url.searchParams.set("email", `eq.${email}`);

  // Henter brugeren fra Supabase
  const data = await request(url);

  // Sender brugeren tilbage
  // Hvis brugeren ikke findes, sender vi null
  return Array.isArray(data) ? (data[0] ?? null) : null;
}

// Opretter en ny bruger
export async function createUser(user) {
  // Opretter en ny bruger
  const url = usersUrl();

  // Sender den nye bruger til Supabase
  const data = await request(url, {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      Prefer: "return=representation",
    },
  });

  // Supabase sender brugeren tilbage som et array
  return Array.isArray(data) ? data[0] : null;
}