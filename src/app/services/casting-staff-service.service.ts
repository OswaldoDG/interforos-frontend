import { Injectable } from '@angular/core';
import {
  SelectorCastingCategoria,
  SelectorCategoria,
} from './api/api-promodel';
import { Observable, Subject } from 'rxjs';
import { SessionQuery } from '../state/session.query';
import { takeUntil } from 'rxjs/operators';

@Injectable()
export class CastingStaffServiceService {
  private casting: SelectorCastingCategoria = null;
  private categoriaActual: string = null;
  private userId: string = null;
  private destroySubject: Subject<void> = new Subject();
  
  constructor(sessionQuery: SessionQuery) {
    // Session query lee el id desde el token de JWT, tka until usa un subject para reemover la susbscripcion cuandoo el servicio se destruye
    sessionQuery.userId$.pipe(takeUntil(this.destroySubject)).subscribe((id) => {
      this.userId = id;
    });
  }

  ngOnDestroy() {
    this.destroySubject.next();
  }

  // devuelve el is del usuario en sesión
  public getUserId() {
    return this.userId;
  }

  private categoriaSub: Subject<boolean> = new Subject();
  public CategoriaSub(): Observable<boolean> {
    return this.categoriaSub.asObservable();
  }

  // Devuelve una lista de casting en las que participa el modelo
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

  public CategoriActual(): string {
    return this.categoriaActual;
  }
  public CastingIdActual(): string {
    if (this.casting) {
      return this.casting.id;
    } else {
      return null;
    }
  }
  public CategoriasCastingActual(): SelectorCategoria[] {
    return this.casting.categorias;
  }
  
  public agregarModelo(modeloId: string, categoriaId: string) {
    var indexC = this.casting.categorias.findIndex((c) => c.id == categoriaId);
    this.casting.categorias[indexC].modelos.push(modeloId);
  }
  public removerModelo(modeloId: string, categoriaId: string) {
    var indexC = this.casting.categorias.findIndex((c) => c.id == categoriaId);
    var indexM = this.casting.categorias[indexC].modelos.indexOf(modeloId);
    this.casting.categorias[indexC].modelos.splice(indexM, 1);
  }

  public ActualizarCasting(castingNuevo: SelectorCastingCategoria) {
    if (castingNuevo != null) {
      this.casting = castingNuevo;
    }
  }
  public ActualizarCategoria(categoria: string) {
    if (categoria != null) {
      this.categoriaActual = categoria;
      this.categoriaSub.next(true);
    }
  }
}
