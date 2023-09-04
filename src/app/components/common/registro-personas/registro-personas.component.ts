import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  Persona,
  PersonaClient,
  PersonaResponsePaginado,
  TipoRelacionPersona,
} from 'src/app/services/api/api-promodel';
import { CastingStaffServiceService } from 'src/app/services/casting-staff-service.service';
import { ServicioRegistroPersonasService } from 'src/app/services/servicio-registro-personas.service';
import { ModalConfirmacionComponent } from '../modal-confirmacion/modal-confirmacion.component';
import { first } from 'rxjs/operators';
import { SessionQuery } from 'src/app/state/session.query';

@Component({
  selector: 'app-registro-personas',
  templateUrl: './registro-personas.component.html',
  styleUrls: ['./registro-personas.component.scss'],
  providers: [ServicioRegistroPersonasService, CastingStaffServiceService],
})
export class RegistroPersonasComponent implements OnInit, AfterViewInit {
  Editando: boolean = false;
  personas: Persona[] = [];
  miPerfil: boolean = false;
  personaId: string = null;
  validarDocumentos: boolean = false;
  personaIdEliminar: string = null;
  dVertical: boolean = true;
  tBusqueda: boolean = true;
  agenciaId = null;
  //Modal
  @ViewChild(ModalConfirmacionComponent) componenteModal;
  constructor(
    private servicioPersonas: ServicioRegistroPersonasService,
    private personaApi: PersonaClient,
    private session: SessionQuery
  ) {}
  ngAfterViewInit(): void {
    this.servicioPersonas.getPersonasApi();
  }

  ngOnInit(): void {
    this.servicioPersonas.personaSub().subscribe((p) => {
      this.personas = p;
    });
    this.personaApi
      .perfilpublicoGet(this.session.UserId)
      .pipe(first())
      .subscribe((data) => {
        this.agenciaId = data.agenciaId;
      });
  }
  agregarPersona() {
    this.Editando = !this.Editando;
  }
  personaCreada(p) {
    if (p) {
      this.servicioPersonas.agregaPersona(p);
    }
    {
      this.personaId = null;
      this.servicioPersonas.getPersonasApi();
    }

    this.Editando = !this.Editando;
  }
  editar(p) {
    this.personaId = p;
    this.miPerfil = false;
    this.Editando = !this.Editando;
  }

  confirmar(p) {
    this.personaIdEliminar = p;
    this.componenteModal.openModal(
      this.componenteModal.myTemplate,
      'el modelo'
    );
  }

  // Auxiliares UI
  recibidoDelModal(r: string) {
    if (r == 'Y') {
      this.servicioPersonas.remover(this.personaIdEliminar);
    }
    this.personaIdEliminar = null;
  }
}
