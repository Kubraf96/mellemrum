// Henter adressen til vores Supabase-projekt fra .env-filen
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

// Henter vores API-nøgle fra .env-filen
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_APIKEY;

// Tjekker om vi har fået de nødvendige oplysninger fra .env-filen
function assertSupabaseConfig() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error(
      "Supabase URL or API key is missing. Check your .env file.",
    );
  }
}

// Laver adressen til vores events-tabel
function eventsUrl() {
  assertSupabaseConfig();
  return new URL(`${SUPABASE_URL}/events`);
}

// Laver adressen til vores registrations-tabel
function registrationsUrl() {
  assertSupabaseConfig();
  return new URL(`${SUPABASE_URL}/registrations`);
}

// Denne funktion bruges til at sende og hente data fra Supabase
async function request(url, options = {}) {
  assertSupabaseConfig();

  const response = await fetch(url, {
    ...options,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const message = await response.text();

    throw new Error(message || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();

  return text ? JSON.parse(text) : null;
}

// Gør funktionerne tilgængelige for events.js og registrations.js
export { eventsUrl, registrationsUrl, request };
