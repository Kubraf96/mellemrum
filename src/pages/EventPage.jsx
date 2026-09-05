import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

import { getEvent } from "../services/events";
import { createRegistration } from "../services/registrations";
import { getUserByEmail, createUser } from "../services/users";
import { formatDate } from "../utils/formatDate";
import Footer from "../components/Footer";
import styles from "./EventPage.module.css";

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
        user = await createUser({ name, email });
      }

      // Opretter tilmeldingen og kobler den til brugeren
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
      if (error.message.includes("registrations_user_event_unique")) {
        setMessage(
          "Du er allerede tilmeldt dette event. Har du ikke modtaget en mail? Tryk her for at sende igen.",
        );
      } else {
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
      <main className={styles.eventPage}>
        {/* Link tilbage til alle events */}
        <Link className={styles.backLink} to="/">
          ← Alle events
        </Link>

        {/* Viser information om det valgte event */}
        <section className={styles.eventDetail}>
          {/* Eventets billede */}
          <img src={event.image} alt="" />

          <div className={styles.eventDetailContent}>
            {/* Eventets kategori */}
            <p className="event-category">{event.category}</p>

            {/* Eventets titel */}
            <h1>{event.title}</h1>

            {/* Den korte beskrivelse af eventet */}
            <p className="lead">{event.summary}</p>

            {/* Her viser vi de vigtigste detaljer om eventet */}
            <div className={styles.detailList}>
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
        <section className={styles.signupPanel}>
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
          {message && <p className={styles.signupMessage}>{message}</p>}
        </section>
      </main>
      <Footer />
    </>
  );
}
