import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import {
  CastingClient,
  Persona,
  SelectorCastingCategoria,
} from 'src/app/services/api/api-promodel';
import { CastingStaffServiceService } from 'src/app/services/casting-staff-service.service';

@Component({
  selector: 'app-castig-review',
  templateUrl: './castig-review.component.html',
  styleUrls: ['./castig-review.component.scss'],
  providers: [CastingStaffServiceService],
})
export class CastigReviewComponent implements OnInit {
  castingId: string = null;
  casting: SelectorCastingCategoria;
  modelos: Persona[] = [];
  constructor(
    private rutaActiva: ActivatedRoute,
    private castingClient: CastingClient,
    private servicio: CastingStaffServiceService
  ) {
    this.rutaActiva.params.subscribe((params: Params) => {
      this.castingId = params['id'];
    });
  }
  ngOnInit(): void {
    this.servicio.PutModoTrabajo(true);
    this.castingClient.revisor(this.castingId).subscribe((c) => {
      this.casting = c;
      this.servicio.ActualizarCasting(c);
    });
  }
  onChangeCategoria(id: string) {
    this.servicio.ActualizarCategoria(id);
    this.modelos = this.servicio.modelosCategoriaActual();
  }
}
