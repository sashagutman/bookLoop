const NAME_TO_CODE = {
  english: "en",
  russian: "ru",
  ukrainian: "uk", ukraine: "uk", ua: "uk",
  hebrew: "he", ivrit: "he", hebrow: "he", 
  spanish: "es",
  german: "de",
  french: "fr",
  italian: "it",
  polish: "pl",
  portuguese: "pt",
  other: "other",
};

function normalizeLanguage(v) {
  if (v == null) return v;
  const s = String(v).trim().toLowerCase();
  return NAME_TO_CODE[s] ?? s;
}

module.exports = { normalizeLanguage };
