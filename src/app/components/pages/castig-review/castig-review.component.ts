import { Component, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
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
  constructor(
    private rutaActiva: ActivatedRoute,
    private castingClient: CastingClient,
    private servicio: CastingStaffServiceService,
    private personaClient: PersonaClient
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
    this.modelosCategoriaActual(id);
  }


  public modelosCategoriaActual(id : string){
    const modelos: Persona[] = [];
    var indexC = this.casting.categorias.findIndex(
      (c) => c.id == id
    );
    console.log(indexC);
    console.log(this.casting.categorias[indexC].modelos);
    this.casting.categorias[indexC].modelos.forEach((m) => {
      console.log(m);
      this.personaClient.idGet(m).subscribe((p) => {
        console.log(p);
        if (p) {
          console.log(p);
          modelos.push(p);
        }
        this.procesaPersonas(modelos);
      });
    });
  }

  procesaPersonas(personas : any) {
    this.servicio.obtieneCatalogoCliente().subscribe((done) => {
      if (personas != null) {
        const tmp: Persona[] = [];
        personas.forEach((p) => {
          tmp.push(this.servicio.PersonaDesplegable(p));
        });
        this.personasDesplegables = tmp;
        console.log(personas);
      }
    });
  }

}
