import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

import { getEvent } from "../services/events";
import { createRegistration } from "../services/registrations";
import { getUserByEmail, createUser } from "../services/users";
import { formatDate } from "../utils/formatDate";

// Selve siden for et bestemt event
export default function EventPage() {
  // Henter eventets ID fra URL'en
  // Fx hvis URL'en er /events/5, så er eventId = 5
  const { eventId } = useParams();

  // Her gemmer vi det event vi henter fra Supabase
  const [event, setEvent] = useState(null);

  // Her gemmer vi om eventet stadig bliver hentet
  const [loading, setLoading] = useState(true);

  // Her gemmer vi en fejlbesked hvis eventet ikke kan hentes
  const [error, setError] = useState("");

  // Her gemmer vi navn og mail brugeren skriver i formularen
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Her gemmer vi en besked til brugeren
  // fx "Tilmelding sendt!"
  const [message, setMessage] = useState("");

  // Henter eventet når siden bliver åbnet
  useEffect(() => {
    // Henter eventet fra Supabase
    async function loadEvent() {
      try {
        const data = await getEvent(eventId);
        // Gemmer eventet i state
        setEvent(data);
      } catch (error) {
        // Gemmer fejlbeskeden i state
        setError("Eventet kunne ikke hentes.");
        console.error("Kunne ikke hente event:", error);
      } finally {
        // Stopper loading når hentningen er færdig
        setLoading(false);
      }
    }

    // Kører funktionen
    loadEvent();

    // Hvis eventId ændrer sig, henter vi det nye event
  }, [eventId]);

  // Det her sker når brugeren trykker på "Tilmeld mig"
async function handleSubmit(eventSubmit) {
  eventSubmit.preventDefault();

  try {
    // Finder brugeren ud fra email
    let user = await getUserByEmail(email);

    // Hvis brugeren ikke findes, opretter vi en ny
    if (!user) {
      user = await createUser({
        name,
        email,
      });
    }

    // Opretter tilmeldingen
    const registration = {
      status: "Ny",
      userId: user.id,
      eventId: event.id,
    };

    await createRegistration(registration);

    // Viser en besked til brugeren når tilmeldingen lykkes
    setMessage("Tak for din tilmelding! Din plads er reserveret.");

    // Tømmer formularen efter tilmelding
    setName("");
    setEmail("");
  } catch (error) {
    // Hvis brugeren allerede er tilmeldt dette event
    if (error.message.includes("registrations_user_event_unique")) {
      setMessage(
        "Du er allerede tilmeldt dette event. Har du ikke modtaget en mail? Tryk her for at sende igen.",
      );
    } else {
      // Viser en besked hvis noget andet går galt
      setMessage("Der skete en fejl. Prøv igen.");
    }

    console.error("Kunne ikke tilmelde:", error);
  }
}

  // Hvis eventet ikke er hentet endnu, viser vi ikke siden
if (loading) {
  return <p>Henter event...</p>;
}

if (error) {
  return <p>{error}</p>;
}

if (!event) {
  return <p>Eventet blev ikke fundet.</p>;
}

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
                {formatDate(event.date)}
              </p>

              {/* Stedet hvor eventet foregår */}
              <p>
                <strong>Sted</strong>
                <span>
                  {event.venues.name}
                  <br />
                  {event.venues.address}, {event.venues.postalCode}{" "}
                  {event.venues.city}
                  {event.venues.website && (
                    <>
                      <br />
                      <a href={event.venues.website}>Besøg venue</a>
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

        {/* Formular hvor brugeren kan tilmelde sig */}
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

          {/* Viser besked efter tilmelding */}
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
