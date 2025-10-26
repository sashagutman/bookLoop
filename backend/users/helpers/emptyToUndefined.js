const emptyToUndefined = (v) => {
  if (v === null || v === undefined) return v;
  const s = String(v).trim();
  return s === "" ? undefined : s;
};

module.exports = emptyToUndefined;