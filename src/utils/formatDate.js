export function formatDate(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);

  return `${date.toLocaleDateString("da-DK", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })} kl. ${date.toLocaleTimeString("da-DK", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}
