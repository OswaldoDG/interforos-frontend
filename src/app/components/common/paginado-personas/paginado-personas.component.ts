import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  Persona,
  PersonaResponsePaginado,
} from 'src/app/services/api/api-promodel';
import { PersonaInfoService } from 'src/app/services/persona/persona-info.service';

@Component({
  selector: 'app-paginado-personas',
  templateUrl: './paginado-personas.component.html',
  styleUrls: ['./paginado-personas.component.scss'],
})
export class PaginadoPersonasComponent implements OnInit, OnChanges {
  @Input() PaginadoPersonas: PersonaResponsePaginado = undefined;
  personasDesplegables = [];
  gridListings: number = 1;
  datosValidos: boolean = false;

  constructor(private personaService: PersonaInfoService) {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    this.procesaPersonas();
  }

  procesaPersonas() {
    this.personaService.obtieneCatalogoCliente().subscribe((done) => {
      if (this.PaginadoPersonas?.elementos) {
        const tmp: Persona[] = [];
        this.PaginadoPersonas.elementos.forEach((p) => {
          tmp.push(this.personaService.PersonaDesplegable(p));
        });
        this.personasDesplegables = tmp;
        if (this.personasDesplegables.length > 0) {
          this.datosValidos = true;
        }
      }
    });
  }

  ngOnInit(): void {}
}
