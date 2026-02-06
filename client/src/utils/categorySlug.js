export const toCategorySlug = (name = "") =>
  name
    .toLowerCase()
    .trim()
    .replace(/ & /g, "-")
    .replace(/\s+/g, "-");
