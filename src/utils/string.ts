const ACRONYMS = new Set(['DKI', 'DI', 'DIY', 'NAD', 'NTB', 'NTT']);

export function toTitleCase(str: string): string {
  return str.replace(/\S+/g, word => {
    const clean = word.replace(/[^a-zA-Z]/g, '').toUpperCase();
    return ACRONYMS.has(clean)
      ? word.toUpperCase()
      : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
}
