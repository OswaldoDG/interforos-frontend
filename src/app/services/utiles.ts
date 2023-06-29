import { ElementoCatalogo } from './api/api-promodel';

export function compare(a: ElementoCatalogo, b: ElementoCatalogo) {
  if (a.texto < b.texto) {
    return -1;
  }
  if (a.texto > b.texto) {
    return 1;
  }
  return 0;
}
