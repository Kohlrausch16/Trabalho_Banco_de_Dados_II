function getQueryParam(param) {
  const url = new URL(window.location.href);
  return url.searchParams.get(param);
}

function toLocalDateInput(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toISOString().slice(0, 10);
}

function toIsoWithMsFromDateAndTime(dateStr, timeStr) {
  if (!dateStr) return null;
  const t = timeStr ? timeStr : "00:00";
  return new Date(dateStr + "T" + t + ":00.000Z").toISOString();
}

function escapeHtml(text) {
  if (!text) return "";
  return text.replace(/[&<>"']/g, m => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[m]));
}

function formatMonthYear(date) {
  return date.toLocaleString("pt-BR", { month: "long", year: "numeric" });
}

window.getQueryParam = getQueryParam;
window.toLocalDateInput = toLocalDateInput;
window.toIsoWithMsFromDateAndTime = toIsoWithMsFromDateAndTime;
window.escapeHtml = escapeHtml;
window.formatMonthYear = formatMonthYear;