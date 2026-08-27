// Henter de ting vi skal bruge fra React
import { useEffect, useState } from "react";

// Link bruges til at gå mellem sider
// useParams bruges til at hente eventets ID fra URL'en
import { Link, useParams } from "react-router";

// Henter funktionen der gemmer en tilmelding i Supabase
import { createRegistration } from "../lib/supabase";

// Henter adressen til vores Supabase-projekt fra .env-filen
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

// API-nøglen bruges når vi henter data fra Supabase
const headers = {
  apikey: import.meta.env.VITE_SUPABASE_APIKEY,
  "Content-Type": "application/json",
};


// Selve siden for et bestemt event
export default function EventPage() {
  // Henter eventets ID fra URL'en
  // Fx hvis URL'en er /events/5, så er eventId = 5
  const { eventId } = useParams();

  // Her gemmer vi det event vi henter fra Supabase
  const [event, setEvent] = useState(null);

  // Her gemmer vi det navn brugeren skriver i formularen
  const [name, setName] = useState("");

  // Her gemmer vi den email brugeren skriver i formularen
  const [email, setEmail] = useState("");

  //Her gemmer vi en besked til brugeren, fx "Tilmelding sendt!"
  const [message, setMessage] = useState("");

  // Henter eventet når siden bliver åbnet
  useEffect(() => {
    // Finder det event der passer til eventets ID
    async function getEvent() {
      // Henter eventet fra events-tabellen i Supabase
      const response = await fetch(`${SUPABASE_URL}/events?id=eq.${eventId}`, {
        headers,
      });

      // Laver svaret fra Supabase om til data vi kan bruge
      const data = await response.json();

      // Gemmer eventet så vi kan vise det på siden
      setEvent(data[0]);
    }

    // Kører funktionen
    getEvent();

    // Hvis eventId ændrer sig, henter vi det nye event
  }, [eventId]);

  // Det her sker når brugeren trykker på "Tilmeld mig"
  async function handleSubmit(eventSubmit) {
    // Forhindrer siden i at genindlæse når formularen bliver sendt
    eventSubmit.preventDefault();

    // Samler oplysningerne fra formularen
    // og oplysningerne om det event brugeren har valgt
    const registration = {
      name,
      email,
      status: "Ny",
      eventTitle: event.title,
      eventDate: event.date,
      eventLocation: event.venueName,
    };

    // Prøver at gemme tilmeldingen i Supabase
    try {
      await createRegistration(registration);

      // Viser en besked til brugeren når tilmeldingen lykkes
      setMessage("Tak for din tilmelding! Din plads er reserveret.");

      // Tømmer formularen efter tilmelding
      setName("");
      setEmail("");
    } catch (error) {
      // Viser en besked hvis noget går galt
      setMessage("Der skete en fejl. Prøv igen.");

      console.error("Kunne ikke tilmelde:", error);
    }
  } // <-- DENNE MANGLER HOS DIG

  // Hvis eventet ikke er hentet endnu, viser vi ikke siden
  if (!event) {
    return null;
  }

  // Gør eventets dato klar så vi kan vise den på en pæn måde
  const date = new Date(event.date);

  return (
    <>
      <main className="event-page">
        {/* Link tilbage til alle events */}
        <Link className="back-link" to="/">
          ← Alle events
        </Link>

        {/* Viser information om det valgte event */}
        <section className="event-detail">
          {/* Eventets billede */}
          <img src={event.image} alt="" />

          <div className="event-detail-content">
            {/* Eventets kategori */}
            <p className="event-category">{event.category}</p>

            {/* Eventets titel */}
            <h1>{event.title}</h1>

            {/* Den korte beskrivelse af eventet */}
            <p className="lead">{event.summary}</p>

            {/* Her viser vi de vigtigste detaljer om eventet */}
            <div className="detail-list">
              {/* Dato og tidspunkt */}
              <p>
                <strong>Dato</strong>
                {date.toLocaleDateString("da-DK", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}{" "}
                kl.{" "}
                {date.toLocaleTimeString("da-DK", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>

              {/* Stedet hvor eventet foregår */}
              <p>
                <strong>Sted</strong>

                <span>
                  {event.venueName}
                  <br />
                  {event.venueAddress}, {event.venuePostalCode}{" "}
                  {event.venueCity}
                  {/* Viser et link til stedet hvis der er en hjemmeside */}
                  {event.venueWebsite && (
                    <>
                      <br />
                      <a href={event.venueWebsite}>Besøg venue</a>
                    </>
                  )}
                </span>
              </p>

              {/* Prisen på eventet */}
              <p>
                <strong>Pris</strong>

                {/* Hvis prisen er 0, skriver vi "Gratis" */}
                {event.price === 0 ? "Gratis" : `${event.price} kr.`}
              </p>
            </div>

            {/* Den lange beskrivelse af eventet */}
            <p>{event.description}</p>
          </div>
        </section>

        {/* Formular hvor brugeren kan tilmelde sig eventet */}
        <section className="signup-panel">
          <div>
            {/* Lille overskrift over tilmeldingen */}
            <p className="eyebrow dark">Tilmelding</p>

            {/* Overskrift til formularen */}
            <h2>Reserver din plads</h2>

            <p>
              Udfyld formularen, så sender vi din tilmelding til arrangøren.
            </p>
          </div>

          {/* Når formularen bliver sendt, kører handleSubmit */}
          <form onSubmit={handleSubmit}>
            <label>
              Navn
              <input
                value={name}
                onChange={(inputEvent) => setName(inputEvent.target.value)}
              />
            </label>

            <label>
              E-mail
              <input
                value={email}
                onChange={(inputEvent) => setEmail(inputEvent.target.value)}
                placeholder="dig@example.com"
              />
            </label>

            <button type="submit">Tilmeld mig</button>
          </form>

          {message && <p className="signup-message">{message}</p>}
        </section>
      </main>

      {/* Footer nederst på siden */}
      <footer className="site-footer">
        <div className="footer-top">
          <div className="footer-intro">
            {/* Navnet på hjemmesiden */}
            <p className="footer-brand">
              mellemrum<span>.</span>
            </p>

            <p>Udvalgte kulturoplevelser og nye perspektiver på Aarhus.</p>
          </div>

          {/* Links i footeren */}
          <nav className="footer-links" aria-label="Footer">
            <div className="footer-link-group">
              <p className="footer-heading">Udforsk</p>

              {/* Link til forsiden */}
              <Link to="/">Events</Link>

              {/* Link til Om-siden */}
              <Link to="/om">Om Mellemrum</Link>
            </div>

            <div className="footer-link-group">
              <p className="footer-heading">For arrangører</p>

              {/* Link til siden med tilmeldinger */}
              <Link to="/tilmeldinger">Se tilmeldinger</Link>

              {/* Åbner brugerens mailprogram */}
              <a href="mailto:hej@mellemrum.dk">Kontakt os</a>
            </div>
          </nav>
        </div>

        {/* Den nederste del af footeren */}
        <div className="footer-bottom">
          <p className="footer-meta">© 2025 Mellemrum</p>

          <p>Aarhus, Danmark</p>
        </div>
      </footer>
    </>
  );
}