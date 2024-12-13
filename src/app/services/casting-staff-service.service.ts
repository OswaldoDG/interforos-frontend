import { Injectable } from '@angular/core';
import {
  Casting,
  CatalogoBase,
  ClienteView,
  ListaTalento,
  Persona,
  PersonaClient,
  SelectorCastingCategoria,
  SelectorCategoria,
} from './api/api-promodel';
import { Observable, Subject } from 'rxjs';
import { SessionQuery } from '../state/session.query';
import { CatalogosCliente } from '../modelos/locales/catalogos-cliente';

export interface DatosSeleccion {
  casting: Boolean,
  lista: Boolean,
  id: string,
  subid: string,
  porCategoria: boolean,
  castingData?: SelectorCastingCategoria,
  listData?: ListaTalento
}

export interface MapeoVoto {
  usuarioId?: string | undefined;
  No?: string | undefined;
  Nose?: string | undefined;
  Si?: string | undefined;
  Mucho?: string | undefined;
}

@Injectable()
export class CastingStaffServiceService {
  private userId: string = null;
  private destroySubject: Subject<void> = new Subject();
  private editar: boolean = false;
  private personaNombre: string;
  public catalogos: CatalogosCliente[] = [];
  public cliente: ClienteView;



  private seleccionActual: DatosSeleccion = { casting: true, lista: false, id: null, subid: null, porCategoria: false }

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


  public SetTabCasting(id: string, categoriaId: string, porcat: boolean, casting?: Casting  ) {
    if(id != null && id != '') {
      this.seleccionActual.casting = true;
    } else {
      this.seleccionActual.casting = false;
    }
    this.seleccionActual.lista = false;
    this.seleccionActual.id = id;
    this.seleccionActual.subid = categoriaId;
    this.seleccionActual.porCategoria = porcat;
    this.seleccionActual.castingData = casting;
    this.datosSeleccionSub.next(this.seleccionActual);
  }

  public SetTabLista(id: string, lista?: ListaTalento) {
    if(id != null && id != '') {
      this.seleccionActual.lista = true;
    } else {
      this.seleccionActual.lista = false;
    }
    this.seleccionActual.casting = false;
    this.seleccionActual.id = id;
    this.seleccionActual.subid = '';
    this.seleccionActual.listData = lista;
    this.datosSeleccionSub.next(this.seleccionActual);
  }

  public SeleccionActual(): DatosSeleccion {
    return this.seleccionActual;
  }

  // devuelve el id del usuario en sesión
  public getUserId() {
    return this.userId;
  }


  private datosSeleccionSub: Subject<DatosSeleccion> = new Subject();
  public DatosSeleccionSub(): Observable<DatosSeleccion> {
    return this.datosSeleccionSub.asObservable();
  }


  //devuelve el nombre de un usuarioId
  public nombreUsuarioId(id: string): string {
    var participante = this.seleccionActual.castingData.participantes.find((_) => _.id === id);
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
    if (this.seleccionActual.subid != null && this.seleccionActual.subid != '' && this.seleccionActual.castingData != null) {
      var indexC = this.seleccionActual.castingData.categorias.findIndex((c) => c.id == this.seleccionActual.subid);
      if(indexC>=0) {
        return this.seleccionActual.castingData.categorias[indexC].modelos.findIndex(_ => _.personaId == idPersona);
      }
    } 
    return -1;
  }

  //verifica si una persona esta en la lista actual
  public personaEnLista(idPersona: string): number {
    if (this.seleccionActual.listData != null) {
      return this.seleccionActual.listData.idPersonas.findIndex(p => p == idPersona);
    } else {
      return -1;
    }
  }

  // Devuelve una lista de categorias en las que participa el modelo
  public CastingsPersona(idPersona: string): string[] {
    const tmp: string[] = [];
    if (this.seleccionActual.castingData != null) {
      this.seleccionActual.castingData.categorias.forEach((c) => {
        if (c.modelos.findIndex(_ => _.personaId == idPersona) >= 0) {
          tmp.push(c.id);
        }
      });
    }
    return tmp;
  }


  //devuelve las categorias del casting Atual
  public CategoriasCastingActual(): SelectorCategoria[] {
    if (this.seleccionActual.castingData) {
      return this.seleccionActual.castingData.categorias
    }
    return [];
  }
  
  //agregar un modelo
  public agregarModelo(modeloId: string, categoriaId: string) {
    var indexC = this.seleccionActual.castingData.categorias.findIndex((c) => c.id == categoriaId);
    var consecutivo = Math.max(...this.seleccionActual.castingData.categorias[indexC].modelos.map(_ => _.consecutivo));
    this.seleccionActual.castingData.categorias[indexC].modelos.push({ consecutivo: consecutivo, personaId: modeloId });
  }

  public agregarModeloLista(modeloId: string) {
    this.seleccionActual.listData.idPersonas.push(modeloId);
  }

  //remueve un modelo
  public removerModelo(modeloId: string, categoriaId: string) {
    var indexC = this.seleccionActual.castingData.categorias.findIndex((c) => c.id == categoriaId);
    var indexM = this.seleccionActual.castingData.categorias[indexC].modelos.findIndex(_ => _.personaId == modeloId);
    this.seleccionActual.castingData.categorias[indexC].modelos.splice(indexM, 1);
  }

  public removerModeloLista(modeloId: string) {
    var indexM = this.seleccionActual.listData.idPersonas.indexOf(modeloId);
    this.seleccionActual.listData.idPersonas.splice(indexM, 1);
  }

  public ActualizarCasting(castingNuevo: SelectorCastingCategoria) {
    if (castingNuevo != null) {
      this.seleccionActual.castingData = castingNuevo;
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
