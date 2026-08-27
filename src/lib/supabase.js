// Henter adressen til vores Supabase-projekt fra .env-filen
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

// Henter vores API-nøgle fra .env-filen
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_APIKEY;


// Tjekker om vi har fået de nødvendige oplysninger fra .env-filen
function assertSupabaseConfig() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {

    // Hvis noget mangler, stopper vi og viser en fejl
    throw new Error(
      "Supabase URL or API key is missing. Check your .env file.",
    );
  }
}


// Laver adressen til vores events-tabel
function eventsUrl() {

  // Tjekker først at vores Supabase-oplysninger findes
  assertSupabaseConfig();

  // Tilføjer /events til Supabase-adressen
  return new URL(`${SUPABASE_URL}/events`);
}


// Laver adressen til vores registrations-tabel
function registrationsUrl() {

  // Tjekker først at vores Supabase-oplysninger findes
  assertSupabaseConfig();

  // Tilføjer /registrations til Supabase-adressen
  return new URL(`${SUPABASE_URL}/registrations`);
}


// Denne funktion bruges til at sende og hente data fra Supabase
async function request(url, options = {}) {

  // Tjekker at vores Supabase-oplysninger findes
  assertSupabaseConfig();

  // Sender en request til Supabase
  const response = await fetch(url, {

    // Her kan vi fx fortælle om vi vil hente, oprette,
    // ændre eller slette noget
    ...options,

    // Sender vores oplysninger med til Supabase
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,

      // Fortæller at vi sender data som JSON
      "Content-Type": "application/json",

      // Giver mulighed for at tilføje andre headers
      ...options.headers,
    },
  });


  // Hvis Supabase svarer med en fejl
  if (!response.ok) {

    // Henter fejlbeskeden
    const message = await response.text();

    // Viser fejlbeskeden
    throw new Error(
      message || `Request failed with status ${response.status}`,
    );
  }


  // Hvis Supabase ikke sender noget tilbage
  if (response.status === 204) {
    return null;
  }


  // Henter det svar vi får fra Supabase
  const text = await response.text();

  // Hvis der er et svar, laver vi det om til noget JavaScript kan bruge
  // Hvis der ikke er noget svar, returnerer vi null
  return text ? JSON.parse(text) : null;
}



// ====================
// EVENTS
// ====================


// Henter alle events fra Supabase
export async function listEvents() {

  // Finder adressen til events-tabellen
  const url = eventsUrl();

  // Sorterer events så de højeste ID'er kommer først
  url.searchParams.set("order", "id.desc");

  // Henter events fra Supabase
  const data = await request(url);

  // Sender events tilbage hvis vi har fået en liste
  // Ellers sender vi en tom liste tilbage
  return Array.isArray(data) ? data : [];
}


// Henter ét bestemt event
export async function getEvent(id) {

  // Finder adressen til events-tabellen
  const url = eventsUrl();

  // Finder det event hvor ID'et passer med det ID vi har fået
  url.searchParams.set("id", `eq.${id}`);

  // Henter eventet fra Supabase
  const data = await request(url);

  // Sender eventet tilbage
  // Hvis eventet ikke findes, sender vi null tilbage
  return Array.isArray(data) ? (data[0] ?? null) : null;
}



// ====================
// REGISTRATIONS
// ====================


// Gemmer en ny tilmelding i registrations-tabellen
export function createRegistration(registration) {

  // Sender tilmeldingen til Supabase
  return request(registrationsUrl(), {

    // POST betyder at vi opretter noget nyt
    method: "POST",

    // Laver tilmeldingen om til JSON
    // så Supabase kan modtage den
    body: JSON.stringify(registration),
  });
}