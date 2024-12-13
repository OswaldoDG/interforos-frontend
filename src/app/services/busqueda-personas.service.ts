import { Injectable } from '@angular/core';
import {
  BusquedaPersonasIdRequestPaginado,
  BusquedaPersonasRequestPaginado,
  PersonaClient,
  PersonaResponsePaginado,
} from './api/api-promodel';
import { Observable, Subject } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BusquedaPersonasService {
  private personasBuscarActual: any;
  private personasEncontradas: Subject<PersonaResponsePaginado> = new Subject();
  public personaSub(): Observable<PersonaResponsePaginado> {
    return this.personasEncontradas.asObservable();
  }

  constructor(private personaApi: PersonaClient) {}

  clearLista() {
    this.personasEncontradas.next( { elementos: [], total: 0, pagina: 0, tamano: 0});
  } 

  solicitudBusquedaPersonas(busqueda: BusquedaPersonasRequestPaginado) {
    this.personasBuscarActual = busqueda;
    if (busqueda) {
      this.personaApi
        .buscar(busqueda)
        .pipe(first())
        .subscribe((r) => {
          this.personasEncontradas.next(r);
        });
    }
  }

  solicitudBusquedaPersonasId(busqueda: BusquedaPersonasIdRequestPaginado) {
    this.personasBuscarActual = busqueda;
    if (busqueda) {
      this.personaApi
        .idPost(busqueda)
        .pipe(first())
        .subscribe((r) => {
          this.personasEncontradas.next(r);
        });
    }
  }

  nextPage(p: number) {
    if (this.personasBuscarActual) {
      this.personasBuscarActual.pagina = p;
      if (this.personasBuscarActual as BusquedaPersonasRequestPaginado) {
        this.solicitudBusquedaPersonas(this.personasBuscarActual);
      } else {
        this.solicitudBusquedaPersonasId(this.personasBuscarActual);
      }
    }
  }
}
