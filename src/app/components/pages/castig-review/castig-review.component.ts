import { Component, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  CastingClient,
  Persona,
  PersonaClient,
  SelectorCastingCategoria,
  SelectorCategoria,
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
  personasDesplegables = [];
  categorias: SelectorCategoria[] = [];
  dVertical: boolean = false;
  tBusqueda: boolean = false;
  constructor(
    private rutaActiva: ActivatedRoute,
    private castingClient: CastingClient,
    private servicio: CastingStaffServiceService,
    private personaClient: PersonaClient,
    private ruta:Router
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
      if (c.categorias.length > 0) {
        this.onChangeCategoria(c.categorias[0].id);
      }
    });
  }
  onChangeCategoria(id: string) {
    this.servicio.ActualizarCategoria(id);
    this.modelosCategoriaActual(id);
  }

  public modelosCategoriaActual(id: string) {
    const modelos: Persona[] = [];
    var indexC = this.casting.categorias.findIndex((c) => c.id == id);
    if (this.casting.categorias[indexC].modelos.length > 0) {
      this.casting.categorias[indexC].modelos.forEach((m) => {
        this.personaClient.idGet(m).subscribe((p) => {
          if (p) {
            modelos.push(p);
          }
          this.procesaPersonas(modelos);
        });
      });
    } else {
      this.personasDesplegables = [];
    }
  }

  procesaPersonas(personas: any) {
    this.servicio.obtieneCatalogoCliente().subscribe((done) => {
      if (personas != null) {
        const tmp: Persona[] = [];
        personas.forEach((p) => {
          tmp.push(this.servicio.PersonaDesplegable(p));
        });
        this.personasDesplegables = tmp;
      }
    });
  }
  volver()
  {
    this.ruta.navigateByUrl('/castings');
  }
}
