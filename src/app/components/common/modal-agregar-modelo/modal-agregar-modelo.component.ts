import { Component, Input, OnInit, Output, EventEmitter, TemplateRef, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { CastingClient, Persona, PersonaClient } from 'src/app/services/api/api-promodel';
import { CastingReviewService } from 'src/app/services/casting-review.service';

@Component({
  selector: 'app-modal-agregar-modelo',
  templateUrl: './modal-agregar-modelo.component.html',
  styleUrls: ['./modal-agregar-modelo.component.scss']
})
export class ModalAgregarModeloComponent implements OnInit {
  @Output() EstadoAdicionModelo: EventEmitter<boolean> = new EventEmitter();
  @Input() puedeAgregarModelo: boolean = true;
  @Input() categoriaSeleccionada: boolean = false;
  @Input() EsAnonimo: boolean = false;
  @Input() castingId : string = null;

  formAgregarModelo: FormGroup;
  formBusquedaModelo : FormGroup;
  personas: Persona[] = [];
  personaSeleccionada: Persona | null = null;
  T: any;
  modalRef?: BsModalRef;

  constructor(private fb: FormBuilder,
              private translate: TranslateService,
              private toastService: HotToastService,
              private castingClient: CastingClient,
              private servicioCasting: CastingReviewService,
              private personaClient: PersonaClient,
              private modalService : BsModalService,
            ) {

    this.formAgregarModelo = this.fb.group({
      consecutivo: ['', Validators.required],
    });

    this.formBusquedaModelo = this.fb.group({
      nombreBuscado: ['', Validators.required]
    });

  }

  ngOnInit(): void {
    this.personas = [];
    this.translate
    .get([
      'modelo.error-400',
      'modelo.modelo',
      'modelo.error-404',
      'modelo.error-409',
      'modelo.excel-status-suc',
      'modelo.excel-status-err',
      'modelo.error-500',
      'modelo.error-coincidencias-404'
    ])
    .subscribe((ts) => {
      this.T = ts;
    });

    this.limpiar();
  }


  agregarModelo() {
    this.EstadoAdicionModelo.emit(true);
    this.castingClient
      .consecutivo(
        this.castingId,
        this.formAgregarModelo.get('consecutivo').value,
        this.servicioCasting.CategoriActual()
      )
      .subscribe(
        (data) => {
          this.servicioCasting.agregarModelo(data, this.servicioCasting.CategoriActual());
          this.toastService.success(this.T['modelo.modelo'], {
            position: 'bottom-center',
          });
          this.EstadoAdicionModelo.emit(false);
        },
        (err) => {
          this.EstadoAdicionModelo.emit(false);
          if (parseInt(err.status) >= 400 && parseInt(err.status) < 500) {
            this.toastService.error(this.T[`modelo.error-${err.status}`], {
              position: 'bottom-center',
            });
          } else {
            this.toastService.error(this.T['modelo.error-400'], {
              position: 'bottom-center',
            });
          }
        }
      );
    this.formAgregarModelo.get('consecutivo').setValue(null);
  }

  buscarCoincidencias(){
    this.EstadoAdicionModelo.emit(true);
    this.personaClient
      .buscarPersonaCoincidencias(
        this.formBusquedaModelo.get('nombreBuscado').value,
      )
      .subscribe(
        (data) => {
          if(data.length > 0){
            data.forEach(e => {
              if(this.servicioCasting.personaEnCategoria(e.id)<0){
                this.personas.push(e);
              }
            });
          }else{
            this.personas = [];
            this.toastService.error(this.T['modelo.error-coincidencias'], {
              position: 'bottom-center',
            });
          }
          this.EstadoAdicionModelo.emit(false);
        },
        (err) => {

          this.EstadoAdicionModelo.emit(false);
          if (parseInt(err.status) >= 400 && parseInt(err.status) < 500) {
            this.toastService.error(this.T[`modelo.error-coincidencias-${err.status}`], {
              position: 'bottom-center',
            });
          } else {
            this.toastService.error(this.T['modelo.error-400'], {
              position: 'bottom-center',
            });
          }
          this.limpiar();
        }
      );
    this.formBusquedaModelo.get('nombreBuscado').setValue(null);
  }

  formatEmail(value: string): string {
    if (!value) return value;

    const parts = value.split('@');
    if (parts.length > 1) {
      return '@' + parts[0];
    }
    return value;
  }

  seleccionarPersona(persona: Persona) {
    if (this.personaSeleccionada === persona) {
      this.personaSeleccionada = null;
    } else {
      this.personaSeleccionada = persona;
    }
  }

  agregarModeloCoincidencia(){
    if(this.personaSeleccionada != null){
      this.EstadoAdicionModelo.emit(true);
    this.castingClient
      .modeloPut(
        this.castingId,
        this.personaSeleccionada.id,
        this.servicioCasting.CategoriActual()
      )
      .subscribe(
        (data) => {
          this.servicioCasting.agregarModelo(data, this.servicioCasting.CategoriActual());
          this.toastService.success(this.T['modelo.modelo'], {
            position: 'bottom-center',
          });
          this.EstadoAdicionModelo.emit(false);
        },
        (err) => {
          this.EstadoAdicionModelo.emit(false);

          if (parseInt(err.status) >= 400 && parseInt(err.status) < 500) {
            this.toastService.error(this.T[`modelo.error-${err.status}`], {
              position: 'bottom-center',
            });
          } else {
            this.toastService.error(this.T['modelo.error-400'], {
              position: 'bottom-center',
            });
          }
        }
      );
      this.limpiar();
    }
  }

  openModal(template: TemplateRef<void>) {
    this.formBusquedaModelo.get('nombreBuscado').setValue(null);
    this.formAgregarModelo.get('consecutivo').setValue(null);
    this.limpiar();
    this.modalRef = this.modalService.show(template);
  }

  limpiar(){
    this.personas = [];
    this.formBusquedaModelo.reset();
    this.personaSeleccionada = null;
  }

}
