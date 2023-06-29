import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CatalogosCliente } from 'src/app/modelos/locales/catalogos-cliente';
import { SessionQuery } from 'src/app/state/session.query';
import {
  CatalogoBase,
  ClienteView,
  ContenidoClient,
  MediaCliente,
  Persona,
  PersonaClient,
} from '../api/api-promodel';

@Injectable({
  providedIn: 'root',
})
export class PersonaInfoService {
  private mediosPersonas: MediaCliente[] = [];
  private personas: Persona[] = [];
  private personasView: Persona[] = [];
  public catalogos: CatalogosCliente[] = [];
  public cliente: ClienteView;

  constructor(
    private session: SessionQuery,
    private apiPersona: PersonaClient,
    private contenido: ContenidoClient
  ) {
    const cs = sessionStorage.getItem('catalogos');
    if (cs != null) {
      sessionStorage.removeItem('catalogos');
    }

    session.cliente$.subscribe((c) => {
      this.cliente = c;
    });
  }

  eliminaPersonaCachePurUID(usuarioId: string) {
    const p = this.personas.findIndex((p) => p.usuarioId == usuarioId);
    if (p >= 0) {
      this.personas.splice(p, 1);
    }

    const pv = this.personasView.findIndex((p) => p.usuarioId == usuarioId);
    if (pv >= 0) {
      this.personasView.splice(p, 1);
    }
  }

  obtieneMediosPErsona(id: string): Observable<MediaCliente> {
    return new Observable((subscriber) => {
      const items = this.mediosPersonas.filter((c) => c.usuarioId == id);
      if (items.length > 0) {
        subscriber.next(items[0]);
        subscriber.complete();
      } else {
        this.contenido.medios(id).subscribe(
          (c) => {
            this.mediosPersonas.push(c);
            subscriber.next(c);
            subscriber.complete();
          },
          (error) => {
            subscriber.error();
          }
        );
      }
    });
  }

  obtieneCatalogoCliente(): Observable<boolean> {
    return new Observable((subscriber) => {
      if (this.catalogos.findIndex((c) => c.url == this.cliente.url) >= 0) {
        subscriber.next(true);
        subscriber.complete();
      } else {
        this.apiPersona.perfil().subscribe(
          (c) => {
            this.catalogos.push({
              url: this.cliente.url,
              fecha: new Date(),
              catalogos: c,
            });
            sessionStorage.setItem('catalogos', JSON.stringify(this.catalogos));
            subscriber.next(true);
            subscriber.complete();
          },
          (error) => {
            subscriber.error();
          }
        );
      }
    });
  }

  ontienePersonaPorUsuarioId(usuarioId: string): Observable<Persona> {
    return new Observable((subscriber) => {
      const pv = this.personas.find((p) => p.usuarioId == usuarioId);
      if (pv != undefined) {
        subscriber.next(pv);
        subscriber.complete();
      } else {
        this.apiPersona.personaGet(usuarioId).subscribe(
          (p) => {
            subscriber.next(p);
            subscriber.complete();
          },
          (error) => {
            subscriber.error(error);
          }
        );
      }
    });
  }

  // Cambia los IDs de las propiedades al texto disponible en el catálogo
  PersonaDesplegable(persona: Persona): Persona {
    const pv = this.personasView.find((p) => p.usuarioId == persona.usuarioId);
    if (pv != undefined) {
      return pv;
    }

    var p = { ...persona };
    const cs = this.catalogos.find((c) => c.url == this.cliente.url);

    p.actividadesIds = this.ADespliegueArray(
      p.actividadesIds,
      cs.catalogos.find((c) => c.tipoPropiedad == 'actividades')
    );
    p.idiomasIds = this.ADespliegueArray(
      p.idiomasIds,
      cs.catalogos.find((c) => c.tipoPropiedad == 'idiomas')
    );

    if (p.generoId != undefined) {
      p.generoId = this.ADespliegue(
        p.generoId,
        cs.catalogos.find((c) => c.tipoPropiedad == 'genero')
      );
    }

    if (p.paisOrigenId != undefined) {
      p.paisOrigenId = this.ADespliegue(
        p.paisOrigenId,
        cs.catalogos.find((c) => c.tipoPropiedad == 'pais')
      );
    }

    // Debe realizarse el cambio del elemento hijo antes del padre
    if (p.paisActualId != undefined) {
      if (p.estadoPaisId != undefined) {
        p.estadoPaisId = this.ADespliegue(
          p.estadoPaisId,
          cs.catalogos.find(
            (c) => c.tipoPropiedad == `estado${p.paisActualId.toLowerCase()}`
          )
        );
      }
      p.paisActualId = this.ADespliegue(
        p.paisActualId,
        cs.catalogos.find((c) => c.tipoPropiedad == 'pais')
      );
    }

    if (p.propiedadesFisicas?.colorCabelloId != undefined) {
      p.propiedadesFisicas.colorCabelloId = this.ADespliegue(
        p.propiedadesFisicas?.colorCabelloId,
        cs.catalogos.find((c) => c.tipoPropiedad == 'colorcabello')
      );
    }

    if (p.propiedadesFisicas?.colorOjosId != undefined) {
      p.propiedadesFisicas.colorOjosId = this.ADespliegue(
        p.propiedadesFisicas?.colorOjosId,
        cs.catalogos.find((c) => c.tipoPropiedad == 'colorojos')
      );
    }

    if (p.propiedadesFisicas?.etniaId != undefined) {
      p.propiedadesFisicas.etniaId = this.ADespliegue(
        p.propiedadesFisicas?.etniaId,
        cs.catalogos.find((c) => c.tipoPropiedad == 'etnia')
      );
    }

    if (p.propiedadesVestuario?.tipoTallaId != undefined) {
      p.propiedadesVestuario.tipoTallaId = this.ADespliegue(
        p.propiedadesVestuario.tipoTallaId,
        cs.catalogos.find((c) => c.tipoPropiedad == 'tallasvestuario')
      );
    }

    this.personasView.push({ ...p });
    return p;
  }

  private ADespliegue(id: string, catalogo: CatalogoBase) {
    if (catalogo == undefined) {
      return id;
    }
    var el = id;
    const t = catalogo.elementos.find((e) => e.clave == id);
    if (t != undefined) {
      el = t.texto;
    }
    return el;
  }

  private ADespliegueArray(ids: string[], catalogo: CatalogoBase) {
    if (catalogo == undefined) {
      return ids;
    }
    var elementos: string[] = [];
    ids.forEach((a) => {
      const t = catalogo.elementos.find((e) => e.clave == a);
      if (t != undefined) {
        elementos.push(t.texto);
      } else {
        elementos.push(a);
      }
    });
    return elementos;
  }
}
