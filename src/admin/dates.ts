import { format } from 'date-fns';

/** ISO → valeur d'un <input type="datetime-local"> (heure locale). */
export function toLocalInput(iso: string | null | undefined): string {
  return iso ? format(new Date(iso), "yyyy-MM-dd'T'HH:mm") : '';
}

/** Valeur d'un <input type="datetime-local"> → ISO (ou null si vide). */
export function fromLocalInput(value: string): string | null {
  return value ? new Date(value).toISOString() : null;
}
