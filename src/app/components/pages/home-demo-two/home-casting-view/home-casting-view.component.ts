import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import {
  Casting,
  CastingClient,
  MapaUsuarioNombre,
  PersonaClient,
} from 'src/app/services/api/api-promodel';
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
  esModelo: boolean = false;
  rol: string;
  listCategorias: string[] = [];
  modelosPersona: MapaUsuarioNombre[] = [];
  constructor(
    private rutaActiva: ActivatedRoute,
    private castingClient: CastingClient,
    private ruta: Router,
    private servico: SessionQuery,
    private personaClient: PersonaClient
  ) {
    this.rutaActiva.params.subscribe((params: Params) => {
      this.castingId = params['id'];
    });
  }

  ngOnInit(): void {
    this.castingClient.anonimo(this.castingId).subscribe((data) => {
      this.casting = data;
      if (this.servico.GetRoles == 'modelo' && this.servico.autenticado) {
        this.esModelo = true;
        this.personaClient
        .porusuarioGet()
        .pipe(first())
        .subscribe((m) => {
          this.modelosPersona = m;
        });

      } else {
        this.esModelo = false;
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

}
