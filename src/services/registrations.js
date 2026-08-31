// Henter de funktioner vi skal bruge til at snakke med Supabase
import { registrationsUrl, request } from "../lib/supabase";

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
