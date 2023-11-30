import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import {
  Consentimiento,
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
import { NgxSpinnerService } from 'ngx-spinner';

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
  agenciaId:string ='';
  LlamarBackend: boolean = true;
  consentimiento: Consentimiento;
  mostarControlesMisModelos: boolean = true;
  uid: string = null;
  verMedios: boolean = false;
  //Modal
  @ViewChild(ModalConfirmacionComponent) componenteModal;
  constructor(
    private servicioPersonas: ServicioRegistroPersonasService,
    private personaApi: PersonaClient,
    private session: SessionQuery,
    private servicio: CastingStaffServiceService,
    private spinner: NgxSpinnerService
  ) {
    if (this.session.ConsentimientoAltaModeloAceptado < 0) {
      this.consentimiento = this.session.GetConsentimientoAltaModelo;
    } else {
      this.LlamarBackend = false;
    }
  }
  ngAfterViewInit(): void {
    this.servicioPersonas.getPersonasApi();
  }

  ngOnInit(): void {
    this.spinner.show('spModelos');
    this.servicioPersonas.personaSub().subscribe((p) => {
      if (p.length > 0) {
        this.procesaPersonas(p);
      } else {
        this.personas = [];
      }
    });
    this.personaApi
      .perfilpublicoGet(this.session.UserId)
      .pipe(first())
      .subscribe((data) => {
        this.agenciaId = data.agenciaId;
      });
    this.spinner.hide('spModelos');
  }
  agregarPersona() {
    this.Editando = !this.Editando;
  }
  personaCreada(p) {
    if (p) {
      this.servicioPersonas.agregaPersona(p);
    } else {
      this.personaId = null;
      this.servicioPersonas.getPersonasApi();
    }

    this.Editando = !this.Editando;
  }
  editar(p) {
    this.personaId = p;
    this.miPerfil = false;
    this.Editando = !this.Editando;
    this.verMedios = false;
  }

  confirmar(p) {
    this.personaIdEliminar = p;
    this.componenteModal.openModal(
      this.componenteModal.myTemplate,
      'eliminar el modelo'
    );
  }

  // Auxiliares UI
  recibidoDelModal(r: string) {
    if (r == 'Y') {
      this.servicioPersonas.remover(this.personaIdEliminar);
    }
    this.personaIdEliminar = null;
  }

  procesaPersonas(personas: any) {
    this.spinner.show('spModelos');
    this.servicio.obtieneCatalogoCliente().subscribe((done) => {
      if (personas != null) {
        const tmp: Persona[] = [];
        personas.forEach((p) => {
          tmp.push(this.servicio.PersonaDesplegable(p));
        });
        this.personas = tmp;
        this.spinner.hide('spModelos');
      }
    });
  }
  traerMedios(uid) {
    this.uid = uid;
    this.miPerfil = !this.miPerfil;
    this.Editando = !this.Editando;
    this.verMedios = !this.verMedios;
  }

  volver(uid) {
    this.uid = uid;
    this.miPerfil = !this.miPerfil;
    this.Editando = !this.Editando;
    this.verMedios = !this.verMedios;
    this.personaId = null;
    this.servicioPersonas.getPersonasApi();
  }
}
