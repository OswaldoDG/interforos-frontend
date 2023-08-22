import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs/operators';
import { Casting, CastingClient } from 'src/app/services/api/api-promodel';
import { SessionQuery } from 'src/app/state/session.query';

@Component({
  selector: 'app-home-casting-view',
  templateUrl: './home-casting-view.component.html',
  styleUrls: ['./home-casting-view.component.scss'],
})
export class HomeCastingViewComponent implements OnInit {
  castingId: string = null;
  casting: Casting;
  logoCasting: string;
  isImageLoading = false;
  enSesion : boolean = false;
  esModelo : boolean = false;
  rol : any;
  listCategorias : string [] = [];
  esIncripcion : boolean = false;

  T: any[];
  constructor(
    private rutaActiva: ActivatedRoute,
    private castingClient: CastingClient,
    private ruta: Router,
    private servico : SessionQuery,
    private translate: TranslateService,
    private toastService: HotToastService,
  ) {
    this.rutaActiva.params.subscribe((params: Params) => {
      this.castingId = params['id'];
    });
  }

  ngOnInit(): void {
    this.translate
      .get([
        'casting.mensaje-inscripcion',
        'casting.mensaje-abandonar',
        'casting.mensaje-inscripcion-error',
        'casting.mensaje-abandonar-error'
      ])
      .subscribe((trads) => {
        this.T = trads;
      });
    this.castingClient.anonimo(this.castingId).subscribe((data) => {
      this.casting = data;
      this.rol = this.servico.GetRoles;
      this.enSesion = this.servico.autenticado;
      if(this.rol == 'modelo' && this.enSesion){
        this.esModelo = false;
        this.traerCategoriasModelo();
      }else{
        this.esModelo = true;
      }
    });
    this.castingClient.logoGet(this.castingId).subscribe((logo) => {
      this.logoCasting = logo;
      this.isImageLoading = true;
    });
  }
  regresar(): void {
    this.ruta.navigate(['/'], { fragment: 'eventos' });
  }

  inscritoCategoria(idCategoria: string) : boolean {
    return this.listCategorias.indexOf(idCategoria) >= 0;
  }

  traerCategoriasModelo(){
    this.castingClient.categoriasGet(this.castingId).subscribe((c) =>{
      this.listCategorias = [...c];
    } ,(err) => { console.log(err) });
  }

  Abandonar(idCategoria: string){
    this.castingClient.abandonar(this.castingId, idCategoria).pipe(first())
    .subscribe((data) =>{
      const temp: string[] = [...this.listCategorias];
      const idx = temp.indexOf(idCategoria);
      if (idx >= 0) {
        temp.splice(idx, 1);
        this.listCategorias = [...temp];
      }
      this.toastService.info(this.T['casting.mensaje-abandonar'], { position: 'bottom-center'});
    }, (err) => { console.log(err); this.toastService.error(this.T['casting.mensaje-abandonar-error'], { position: 'bottom-center'}); });
  }

  Inscribir(idCategoria: string){
    this.castingClient.inscribir(this.castingId, idCategoria).pipe(first())
    .subscribe((data) =>{
      this.listCategorias.push(idCategoria);
      this.toastService.success(this.T['casting.mensaje-inscripcion'], { position: 'bottom-center'});
    }, (err) => { console.log(err); this.toastService.error(this.T['casting.mensaje-inscripcion-error'], { position: 'bottom-center'}); });
  }

}
