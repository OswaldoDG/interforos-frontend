import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Casting, CastingClient } from 'src/app/services/api/api-promodel';

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
  constructor(
    private rutaActiva: ActivatedRoute,
    private castingClient: CastingClient,
    private ruta: Router
  ) {
    this.rutaActiva.params.subscribe((params: Params) => {
      this.castingId = params['id'];
    });
  }

  ngOnInit(): void {
    this.castingClient.anonimo(this.castingId).subscribe((data) => {
      this.casting = data;
    });
    console.log(this.casting);
    this.castingClient.logoGet(this.castingId).subscribe((logo) => {
      this.logoCasting = logo;
      this.isImageLoading = true;
    });
  }
  regresar(): void {
    this.ruta.navigate(['/'], { fragment: 'eventos' });
  }
}
