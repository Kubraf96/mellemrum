// Henter de funktioner vi skal bruge til at snakke med Supabase
import { eventsUrl, request } from "../lib/supabase";

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

  // Finder det event hvor ID'et passer
  url.searchParams.set("id", `eq.${id}`);

  // Henter eventet fra Supabase
  const data = await request(url);

  // Sender eventet tilbage
  // Hvis eventet ikke findes, sender vi null
  return Array.isArray(data) ? (data[0] ?? null) : null;
}
