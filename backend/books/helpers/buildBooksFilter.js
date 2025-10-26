const ALLOWED_LANGS = new Set(["en","ru","uk","he","es","de","fr","it","pl","pt","other"]);
const ALLOWED_GENRES = new Set([
  "fiction","classic","fantasy","sci_fi","detective","thriller","romance","horror",
  "history","biography","non_fiction","poetry","graphic_novel","other",
]);


const NAME_TO_CODE = {
  english: "en",
  russian: "ru",
  ukrainian: "uk", ukraine: "uk", ua: "uk",
  hebrew: "he", ivrit: "he",
  spanish: "es",
  german: "de",
  french: "fr",
  italian: "it",
  polish: "pl",
  portuguese: "pt",
  other: "other",
};
// 
const CODE_TO_NAMES = {
  en: ["en", "English"],
  ru: ["ru", "Russian", "Rus", "RUS"],
  uk: ["uk", "Ukrainian", "UA", "Ukraine"],
  he: ["he", "Hebrew", "Ivrit"],
  es: ["es", "Spanish"],
  de: ["de", "German"],
  fr: ["fr", "French"],
  it: ["it", "Italian"],
  pl: ["pl", "Polish"],
  pt: ["pt", "Portuguese"],
  other: ["other", "Other"],
};

function escapeRegExp(s = "") { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
// нормализует входное значение языка из query
function normalizeLangRaw(raw) {
  if (raw == null) return null;
  if (Array.isArray(raw)) {
    for (const v of raw) {
      const code = normalizeLangRaw(v);
      if (code) return code;
    }
    return null;
  }
  const v = String(raw).trim();
  if (!v) return null;
  const first = v.split(",")[0].trim();
  if (ALLOWED_LANGS.has(first)) return first;                      
  const byName = NAME_TO_CODE[first.toLowerCase()];                
  if (byName) return byName;
  return first; // неизвестное — пусть пройдёт как есть
}

function buildBooksFilter(query = {}) {
  const { q, author, title, genre } = query;
  const langInput = normalizeLangRaw(query.language ?? query.lang);

  const filter = {};

  // q по текстовому индексу
  if (typeof q === "string" && q.trim()) {
    filter.$text = { $search: q.trim() };
  }

  // OR-поиск по author/title
  const or = [];
  if (typeof author === "string" && author.trim()) {
    or.push({ author: { $regex: escapeRegExp(author.trim()), $options: "i" } });
  }
  if (typeof title === "string" && title.trim()) {
    or.push({ title:  { $regex: escapeRegExp(title.trim()),  $options: "i" } });
  }
  if (or.length) filter.$or = or;

  // жанр строго по enum
  if (typeof genre === "string" && ALLOWED_GENRES.has(genre.trim())) {
    filter.genre = genre.trim();
  }
  // язык с учётом кодов и имён
  if (langInput) {
    if (ALLOWED_LANGS.has(langInput)) {
      const candidates = CODE_TO_NAMES[langInput] || [langInput];
      filter.language = { $in: candidates };
    } else {
     
      filter.language = langInput;
    }
  }

  return filter;
}

module.exports = { buildBooksFilter, ALLOWED_LANGS, ALLOWED_GENRES };
