import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { first } from 'rxjs/operators';
import {
  BusquedaPersonasRequestPaginado,
  Persona,
  PersonaClient,
  PersonaResponsePaginado,
} from 'src/app/services/api/api-promodel';
import { PersonaInfoService } from 'src/app/services/persona/persona-info.service';

@Component({
  selector: 'app-paginado-personas',
  templateUrl: './paginado-personas.component.html',
  styleUrls: ['./paginado-personas.component.scss'],
})
export class PaginadoPersonasComponent implements OnInit, OnChanges {
  @Input() personasBuscar: BusquedaPersonasRequestPaginado = undefined;
  @Output() EstadoBusqueda: EventEmitter<boolean> = new EventEmitter();
  personasDesplegables = [];
  gridListings: number = 1;
  datosValidos: boolean = false;
  paginaTamano: number = 20;
  total: number = 1;
  constructor(
    private personaService: PersonaInfoService,
    private personaApi: PersonaClient
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.gridListings = 1;
    this.procesaPersonas();
  }

  procesaPersonas() {
    if (this.personasBuscar) {
      this.personaApi
        .buscar(this.personasBuscar)
        .pipe(first())
        .subscribe((personasEncontradas) => {
          this.paginaTamano = personasEncontradas.tamano;
          this.total = personasEncontradas.total;
          this.personaService.obtieneCatalogoCliente().subscribe((done) => {
            if (personasEncontradas?.elementos) {
              const tmp: Persona[] = [];
              personasEncontradas.elementos.forEach((p) => {
                tmp.push(this.personaService.PersonaDesplegable(p));
              });
              this.personasDesplegables = tmp;
              if (this.personasDesplegables.length > 0) {
                this.datosValidos = true;
              }
            }
            this.EstadoBusqueda.emit(false);
          });
        });
    }
  }

  nexPage(p) {
    this.gridListings = p;
    this.personasBuscar.pagina = p;
    this.procesaPersonas();
  }
  ngOnInit(): void {
    this.procesaPersonas();
  }
}
