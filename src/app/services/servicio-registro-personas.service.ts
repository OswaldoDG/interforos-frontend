import { Injectable } from '@angular/core';
import { Persona, PersonaClient } from './api/api-promodel';
import { Observable, Subject } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ServicioRegistroPersonasService {
  private personasSub: Subject<Persona[]> = new Subject();
  public personaSub(): Observable<Persona[]> {
    return this.personasSub.asObservable();
  }
  private personaIdSub: Subject<string> = new Subject();
  public PersonaIdSub(): Observable<string> {
    return this.personaIdSub.asObservable();
  }
  constructor(private personaClient: PersonaClient) {}

  getPersonasApi() {
    this.personaClient.porusuarioGet().subscribe((p) => {
      if (p.length > 0) {
        const busqueda = {
          request: {
            ids: p,
          },
          ordernarASC: true,
          ordenarPor: 'nombre',
          pagina: 1,
          tamano: 50,
        };
        this.personaClient.idPost(busqueda).subscribe((r) => {
          this.personasSub.next(r.elementos);
        });
      }
    });
  }

  agregaPersona(personaId: string) {
    this.personaClient.porusuarioPost(personaId).subscribe((r) => {
      this.getPersonasApi();
    });
  }
  remover(personaId: string) {
    if (personaId) {
      this.personaClient.porusuarioDelete(personaId).subscribe((ok) => {
        this.personaClient.personaDelete(personaId).subscribe((ok) => {
          this.getPersonasApi();
        });
      });
    }
  }
}
