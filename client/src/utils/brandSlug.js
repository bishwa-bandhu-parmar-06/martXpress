export const toBrandSlug = (brand) => {
  return brand
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-");
};
