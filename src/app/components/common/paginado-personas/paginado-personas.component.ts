import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import {
  BusquedaPersonasRequestPaginado,
  Persona,
  PersonaClient,
  PersonaResponsePaginado,
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
  constructor(
    private personaService: PersonaInfoService,
    private servicioBusqueda: BusquedaPersonasService,
    private spinner: NgxSpinnerService,
  ) {}

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
      console.log(data);
      this.personas = data;
      this.procesaPersonas();
    });
  }
}
