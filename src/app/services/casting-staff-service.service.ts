import { Injectable } from '@angular/core';
import {
  CatalogoBase,
  ClienteView,
  ComentarioCategoriaModeloCasting,
  Persona,
  PersonaClient,
  SelectorCastingCategoria,
  SelectorCategoria,
  VotoModeloCategoria,
  VotoModeloMapeo,
} from './api/api-promodel';
import { Observable, Subject } from 'rxjs';
import { SessionQuery } from '../state/session.query';
import { CatalogosCliente } from '../modelos/locales/catalogos-cliente';

export interface MapeoVoto {
  usuarioId?: string | undefined;
  No?: string | undefined;
  Nose?: string | undefined;
  Si?: string | undefined;
  Mucho?: string | undefined;
}

@Injectable()
export class CastingStaffServiceService {
  private casting: SelectorCastingCategoria = null;
  private categoriaActual: string = null;
  private userId: string = null;
  private destroySubject: Subject<void> = new Subject();
  private editar: boolean = false;
  private votos: VotoModeloMapeo[] = [];
  private personasView: Persona[] = [];
  private personaNombre: string;
  public catalogos: CatalogosCliente[] = [];
  public cliente: ClienteView;

  constructor(
    sessionQuery: SessionQuery,
    private personaClient: PersonaClient
  ) {
    this.userId = sessionQuery.UserId;
    const cs = sessionStorage.getItem('catalogos');
    if (cs != null) {
      sessionStorage.removeItem('catalogos');
    }

    sessionQuery.cliente$.subscribe((c) => {
      this.cliente = c;
    });
  }

  ngOnDestroy() {
    this.destroySubject.next();
  }

  // devuelve el id del usuario en sesión
  public getUserId() {
    return this.userId;
  }

  private categoriaSub: Subject<string> = new Subject();
  public CategoriaSub(): Observable<string> {
    return this.categoriaSub.asObservable();
  }

  //Trae los votos, del modelo.
  public traerVotosModelo(modeloId: string): VotoModeloMapeo[] {
    this.votos = [];
    var indexC = this.casting.categorias.findIndex(
      (c) => c.id == this.categoriaActual
    );
    this.casting.categorias[indexC].votos.forEach((m) => {
      if (m.personaId == modeloId) {
        this.votos.push(m);
      }
    });
    return this.votos;
  }
  //Agrega el voto del revisor externo
  agregarVoto(votoRevisor: VotoModeloCategoria, modeloId: string) {
    var indexC = this.casting.categorias.findIndex(
      (c) => c.id == this.categoriaActual
    );
    var indexV = this.casting.categorias[indexC].votos.findIndex(
      (v) => v.personaId == modeloId
    );

    if (indexV >= 0) {
      var voto = this.casting.categorias[indexC].votos[indexV];
      voto.nivelLike = votoRevisor.nivelLike;
      this.categoriaSub.next(this.categoriaActual);
    } else {
      const votoMapeado = {
        personaId: modeloId,
        usuarioId: votoRevisor.usuarioId,
        nivelLike: votoRevisor.nivelLike,
      };
      this.votos.push(votoMapeado);
      this.casting.categorias[indexC].votos = this.votos;
      this.categoriaSub.next(this.categoriaActual);
    }
  }

  //devulve los comentarios en una categoria de un modelo ordenadosde manera decendente
  public ComentariosCategoriaPersonaId(
    personaId: string,
    categoriaId: string
  ): ComentarioCategoriaModeloCasting[] {
    var comentarios: ComentarioCategoriaModeloCasting[] = [];
    if (categoriaId) {
      var indexC = this.casting.categorias.findIndex(
        (c) => c.id == categoriaId
      );
      this.casting.categorias[indexC].comentarios.forEach((comentario) => {
        if (comentario.personaId == personaId) {
          comentarios.push(comentario);
        }
      });
    }
    comentarios.sort(function (a, b) {
      if (a.fecha < b.fecha) return 1;
      else if (a.fecha > b.fecha) return -1;
      else return 0;
    });
    return comentarios;
  }

  //devuelve el nombre de un usuarioId
  public nombreUsuarioId(id: string): string {
    var participante = this.casting.participantes.find((_) => _.id === id);
    if (participante != null) {
      if (
        participante.nombre != null &&
        participante.nombre != undefined &&
        participante.nombre.length > 0
      ) {
        return participante.nombre;
      } else {
        return participante.email;
      }
    }
  }
  public setNombreModelo(nombrePersona: string) {
    this.personaNombre = nombrePersona;
  }

  public getNombreModelo(): string {
    return this.personaNombre;
  }

  //vefirica si una persona esta en el casting actual
  public personaEnCategoria(idPersona: string): number {
    if (this.casting) {
      var indexC = this.casting.categorias.findIndex(
        (c) => c.id == this.categoriaActual
      );

      return this.casting.categorias[indexC].modelos.indexOf(idPersona);
    } else {
      return -1;
    }
  }

  // Devuelve una lista de categorias en las que participa el modelo
  public CastingsPersona(idPersona: string): string[] {
    const tmp: string[] = [];
    if (this.casting) {
      this.casting.categorias.forEach((c) => {
        if (c.modelos.indexOf(idPersona) >= 0) {
          tmp.push(c.id);
        }
      });
    }
    return tmp;
  }
  //devuelve la categoriaId actual
  public CategoriActual(): string {
    return this.categoriaActual;
  }
  //devuelve el castingId actual
  public CastingIdActual(): string {
    if (this.casting) {
      return this.casting.id;
    } else {
      return null;
    }
  }
  //devuelve las categorias del casting Atual
  public CategoriasCastingActual(): SelectorCategoria[] {
    return this.casting.categorias;
  }
  //agregar un modelo
  public agregarModelo(modeloId: string, categoriaId: string) {
    var indexC = this.casting.categorias.findIndex((c) => c.id == categoriaId);
    this.casting.categorias[indexC].modelos.push(modeloId);
  }
  //remueve un modelo
  public removerModelo(modeloId: string, categoriaId: string) {
    var indexC = this.casting.categorias.findIndex((c) => c.id == categoriaId);
    var indexM = this.casting.categorias[indexC].modelos.indexOf(modeloId);
    this.casting.categorias[indexC].modelos.splice(indexM, 1);
  }
  //agrega comentario
  agregarComentario(comentario: ComentarioCategoriaModeloCasting) {
    var indexC = this.casting.categorias.findIndex(
      (c) => c.id == comentario.categoriaId
    );
    this.casting.categorias[indexC].comentarios.push(comentario);
  }
  //remueve comentario
  public removerComentario(comentarioId: string, categoriaId: string) {
    var indexC = this.casting.categorias.findIndex((c) => c.id == categoriaId);
    var indexCo = this.casting.categorias[indexC].comentarios.findIndex(
      (_) => _.id == comentarioId
    );
    this.casting.categorias[indexC].comentarios.splice(indexCo, 1);
  }

  public ActualizarCasting(castingNuevo: SelectorCastingCategoria) {
    if (castingNuevo != null) {
      this.casting = castingNuevo;
    }
  }
  public ActualizarCategoria(categoria: string) {
    if (categoria != null) {
      this.categoriaActual = categoria;
      this.categoriaSub.next(this.categoriaActual);
    }
  }

  public GetModoTrabajo() {
    return this.editar;
  }
  public PutModoTrabajo(modo: boolean) {
    this.editar = modo;
  }

  obtieneCatalogoCliente(): Observable<boolean> {
    return new Observable((subscriber) => {
      if (this.catalogos.findIndex((c) => c.url == this.cliente.url) >= 0) {
        subscriber.next(true);
        subscriber.complete();
      } else {
        this.personaClient.perfil().subscribe(
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

  PersonaDesplegable(persona: Persona): Persona {
    // const pv = this.personasView.find((p) => p.usuarioId == persona.usuarioId);
    // if (pv != undefined) {
    //   return pv;
    // }

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
