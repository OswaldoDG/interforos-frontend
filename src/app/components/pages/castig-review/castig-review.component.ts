import { Component, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
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
  //categoriaId: string = null;
  casting: SelectorCastingCategoria;
  modelos: Persona[] = [];
  personasDesplegables = [];
  categorias: SelectorCategoria[] = [];
  categoriasSelect: SelectorCategoria[] = [];
  dVertical: boolean = false;
  tBusqueda: boolean = false;
  orden = 'alfabetico';
  ordenModelos = ['alfabetico', 'mayor', 'menor'];
  constructor(
    private rutaActiva: ActivatedRoute,
    private castingClient: CastingClient,
    private servicio: CastingStaffServiceService,
    private personaClient: PersonaClient,
    private spinner: NgxSpinnerService
  ) {
    this.rutaActiva.params.subscribe((params: Params) => {
      this.castingId = params['id'];
    });
  }
  ngOnInit(): void {
    this.servicio.PutModoTrabajo(true);
    this.ordenChange(this.orden);
  }
  onChangeCategoria(id: string) {
    this.servicio.ActualizarCategoria(id);
    this.modelosCategoriaActual();
  }

  public modelosCategoriaActual() {
    this.servicio.obtieneCatalogoCliente().subscribe((c) => { const per = this.servicio.getPersonasCategoria();
      this.personasDesplegables = per;});

  }

  procesaPersonas(personas: any) {
    this.servicio.obtieneCatalogoCliente().subscribe((done) => {
      if (personas != null) {
        const tmp: Persona[] = [];
        personas.forEach((p) => {
          const per = this.servicio.PersonaDesplegable(p);
          console.log(per.nombreArtistico);
          tmp.push(per);
        });

        this.personasDesplegables = tmp;
      }
    });
  }

  ordenChange(orden: string) {
    //this.spinner.show('http');
    this.orden = orden;
    this.castingClient.revisor(this.castingId, orden).subscribe((c) => {
    this.casting=c
      this.servicio.ActualizarCasting(c);
      if (c.categorias.length > 0) {
        if (!this.servicio.CategoriActual()) {
          this.categoriasSelect = c.categorias;
          this.onChangeCategoria(c.categorias[0].id);
        } else {
          this.modelosCategoriaActual();
        }
      }
    });
  }
}
