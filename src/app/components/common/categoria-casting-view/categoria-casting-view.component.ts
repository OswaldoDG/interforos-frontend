import { Component, Input, OnInit } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs/operators';
import { CastingClient, CategoriaCasting, MapaUsuarioNombre } from 'src/app/services/api/api-promodel';

@Component({
  selector: 'app-categoria-casting-view',
  templateUrl: './categoria-casting-view.component.html',
  styleUrls: ['./categoria-casting-view.component.scss']
})
export class CategoriaCastingViewComponent implements OnInit {
@Input() categoria:CategoriaCasting;
@Input() esModelo:boolean;
@Input() modelosPersona: MapaUsuarioNombre[] = [];
@Input() castingId: string = null;

listCategorias: string[] = [];
esIncripcion: boolean = false;
T: any[];
personaId: string ='';
  constructor(
    private castingClient: CastingClient,
    private translate: TranslateService,
    private toastService: HotToastService,) { }

  ngOnInit(): void {
    this.translate
    .get([
      'casting.mensaje-inscripcion',
      'casting.mensaje-abandonar',
      'casting.mensaje-inscripcion-error',
      'casting.mensaje-abandonar-error',
    ])
    .subscribe((trads) => {
      this.T = trads;
    });
    if(this.esModelo)
    { this.traerCategoriasModelo()}
  }

  inscritoCategoria(idCategoria: string): boolean {
    return this.listCategorias.indexOf(idCategoria) >= 0;
  }

  traerCategoriasModelo() {
    this.castingClient.categoriasGet(this.castingId,this.personaId).subscribe(
      (c) => {
        this.listCategorias = [...c];
      },
      (err) => {
        console.log(err);
      }
    );
  }

  modeloChange(id: string) {
    this.personaId = id;
    this.traerCategoriasModelo();
  }
  Abandonar(idCategoria: string) {
    this.castingClient
      .abandonar(this.castingId, idCategoria, this.personaId)
      .pipe(first())
      .subscribe(
        (data) => {
          const temp: string[] = [...this.listCategorias];
          const idx = temp.indexOf(idCategoria);
          if (idx >= 0) {
            temp.splice(idx, 1);
            this.listCategorias = [...temp];
          }
          this.toastService.info(this.T['casting.mensaje-abandonar'], {
            position: 'bottom-center',
          });
        },
        (err) => {
          this.toastService.error(this.T['casting.mensaje-abandonar-error'], {
            position: 'bottom-center',
          });
        }
      );
  }

  Inscribir(idCategoria: string) {
    this.castingClient
      .inscribir(this.castingId, idCategoria, this.personaId)
      .pipe(first())
      .subscribe(
        (data) => {
          this.listCategorias.push(idCategoria);
          this.toastService.success(this.T['casting.mensaje-inscripcion'], {
            position: 'bottom-center',
          });
        },
        (err) => {
          this.toastService.error(this.T['casting.mensaje-inscripcion-error'], {
            position: 'bottom-center',
          });
        }
      );
  }
}
