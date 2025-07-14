import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import {
  BusquedaPersonasRequestPaginado,
  Persona,
  PersonaClient,
  PersonaResponsePaginado,
  TipoCuerpo,
} from 'src/app/services/api/api-promodel';
import { BusquedaPersonasService } from 'src/app/services/busqueda-personas.service';
import { PersonaInfoService } from 'src/app/services/persona/persona-info.service';

@Component({
  selector: 'app-paginado-personas',
  templateUrl: './paginado-personas.component.html',
  styleUrls: ['./paginado-personas.component.scss'],
})
export class PaginadoPersonasComponent implements OnInit {
  @Input() personasBuscar: BusquedaPersonasRequestPaginado = undefined;
  @Output() EstadoBusqueda: EventEmitter<boolean> = new EventEmitter();
  personas: PersonaResponsePaginado = undefined;
  personasDesplegables = [];
  gridListings: number = 1;
  datosValidos: boolean = false;
  paginaTamano: number = 20;
  total: number = 1;
  t: string = 'hola';
  formBuscarCasting: FormGroup = this.formBuilder.group({
    casting: [null],
    categorias: [null],
  });
  porCategorias: boolean = false;
  ordenASC: boolean = true;
  orden = 'consecutivo';

  constructor(
    private personaService: PersonaInfoService,
    private servicioBusqueda: BusquedaPersonasService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
  ) {
    this.formBuscarCasting = this.formBuilder.group({
      casting: ['', Validators.required],
      categorias: ['', Validators.required],
      porCategorias: [this.porCategorias],
    });
  }

  procesaPersonas() {

    if (this.personas) {
      this.paginaTamano = this.personas.tamano;
      this.total = this.personas.total;
      this.gridListings = this.personas.pagina;
      this.personaService.obtieneCatalogoCliente().subscribe((done) => {
        this.datosValidos = false;
        if (this.personas?.elementos) {
          const tmp: Persona[] = [];
          this.personas.elementos.forEach((p) => {
            tmp.push(this.personaService.PersonaDesplegable(p));
          });
          this.personasDesplegables = null;
          this.personasDesplegables = tmp;
          if (this.personasDesplegables.length > 0) {
            this.datosValidos = true;
          }
        }
        this.EstadoBusqueda.emit(false);
      });

    }
  }

  nexPage(p) {
    this.EstadoBusqueda.emit(true);
    this.gridListings = p;
    this.servicioBusqueda.nextPage(p);

  }
  ngOnInit(): void {
    this.servicioBusqueda.personaSub().subscribe((data) => {
      this.personas = data;
      this.procesaPersonas();
    });
  }

  formBuscar: FormGroup = this.formBuilder.group({
    generosId: [null],
    edadMinima: [null, [Validators.min(0), Validators.max(150)]],
    edadMaxima: [null, [Validators.min(0), Validators.max(150)]],
    nombre: [null],
    tipoCuerpo: [null],
    tipoEtnia: [null],
    tipoOjos: [null],
    tipoCabello: [null],
    colorCabello: [null],
    idioma: [null],
    habilidades: [null],
    agencias: [null],
  });

  private GetIdsDeFormField(campo: string): string[] {
    const ids = [];
    if (this.formBuscar.get(campo).value != null) {
      const valores = [...this.formBuscar.get(campo).value];
      valores.forEach((v) => {
        ids.push(v.clave);
      });
      return ids;
    }
    return null;
  }

  private ATipoCuerpos(ids: string[]): TipoCuerpo[] {
    if (ids != null) {
      const tipos = [];
      ids.forEach((id) => {
        switch (id) {
          case 'Bajo':
            tipos.push(TipoCuerpo.Bajo);
            break;

          case 'Normal':
            tipos.push(TipoCuerpo.Normal);
            break;

          case 'Obeso':
            tipos.push(TipoCuerpo.Obeso);
            break;

          case 'Sobrepeso':
            tipos.push(TipoCuerpo.Sobrepeso);
            break;
        }
      });
      return tipos;
    }
    return null;
  }

  private BusquedaDesdeForma(): BusquedaPersonasRequestPaginado {
    return {
      request: {
        generosId: this.GetIdsDeFormField('generosId'),
        edadMinima: this.formBuscar.get('edadMinima').value,
        edadMaxima: this.formBuscar.get('edadMaxima').value,
        tipoCuerpos: this.ATipoCuerpos(this.GetIdsDeFormField('tipoCuerpo')),
        nombre: this.formBuscar.get('nombre').value,
        etniasIds: this.GetIdsDeFormField('tipoEtnia'),
        colorOjosIds: this.GetIdsDeFormField('tipoOjos'),
        tipoCabelloIds: this.GetIdsDeFormField('tipoCabello'),
        colorCabelloIds: this.GetIdsDeFormField('colorCabello'),
        idiomasIds: this.GetIdsDeFormField('idioma'),
        habilidadesIds: this.GetIdsDeFormField('habilidades'),
        agenciasIds: this.GetIdsDeFormField('agencias'),
      },
      ordernarASC: this.ordenASC,
      ordenarPor: this.orden,
      pagina: 1,
      tamano: 20,
    };
  }

  EstadoEliminacion(buscando: boolean) {
    if (buscando) {
      console.log(this.personas);
      this.spinner.show('buscar');
      this.servicioBusqueda.solicitudBusquedaPersonas(this.BusquedaDesdeForma());
      this.servicioBusqueda.personaSub().subscribe((data) => {
        this.personas = data;
        console.log(this.personas);
        this.procesaPersonas();
        this.spinner.hide('buscar');
      });
    } else {
      this.spinner.hide('buscar');
    }
  }

}
