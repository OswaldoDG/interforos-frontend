import { Injectable } from '@angular/core';
import {
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
  private editar: boolean;
  private votos: VotoModeloMapeo[] = [];
  constructor(
    sessionQuery: SessionQuery,
    private personaClient: PersonaClient
  ) {
    this.userId = sessionQuery.UserId;
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
    if (participante) {
      return participante.nombre;
    } else {
      if (participante.email) {
        return participante.email;
      } else {
        return '-';
      }
    }
  }

  //vefirica si una persona esta en el casting actual
  public personaEnCategoria(idPersona: string): number {
    var indexC = this.casting.categorias.findIndex(
      (c) => c.id == this.categoriaActual
    );

    return this.casting.categorias[indexC].modelos.indexOf(idPersona);
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

  public modelosCategoriaActual(): Persona[] {
    const modelos: Persona[] = [];
    var indexC = this.casting.categorias.findIndex(
      (c) => c.id == this.categoriaActual
    );
    this.casting.categorias[indexC].modelos.forEach((m) => {
      this.personaClient.idGet(m).subscribe((p) => {
        console.log(p);
        if (p) {
          modelos.push(p);
        }
      });
    });
    return modelos;
  }
  public GetModoTrabajo() {
    return this.editar;
  }
  public PutModoTrabajo(modo: boolean) {
    this.editar = modo;
  }
}
