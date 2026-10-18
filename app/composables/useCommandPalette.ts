// Whether the Ctrl+K command palette is open; the header button opens it as well as the shortcut.
export const useCommandPalette = () => useState('command-palette-open', () => false);
