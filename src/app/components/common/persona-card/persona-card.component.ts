import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { API_BASE_URL, CastingClient, ListasClient, ListaTalento, Persona } from 'src/app/services/api/api-promodel';
import { PersonaInfoService } from 'src/app/services/persona/persona-info.service';
import { CastingStaffServiceService, DatosSeleccion } from 'src/app/services/casting-staff-service.service';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalConfirmacionComponent } from '../modal-confirmacion/modal-confirmacion.component';

@Component({
  selector: 'app-persona-card',
  templateUrl: './persona-card.component.html',
  styleUrls: ['./persona-card.component.scss'],
})
export class PersonaCardComponent implements OnInit {
  @Input() persona: Persona = null;
  @Input() mostarControlesMisModelos: boolean;
  @Input() modoStaff : boolean = true;
  @Output() personaEditar: EventEmitter<string> = new EventEmitter();
  @Output() personaRemover: EventEmitter<string> = new EventEmitter();
  @Output() personaCargada: EventEmitter<boolean> = new EventEmitter();
  @Output() uid: EventEmitter<string> = new EventEmitter();
  @Output() EstadoEliminacion: EventEmitter<boolean> = new EventEmitter();
  mobile: boolean = false;
  notFoundURL: string = 'assets/img/errorMedio.jpg';
  avatarUrl: string = 'assets/img/errorMedio.jpg';
  videoCasting: any;
  fotoCasting: any;
  tieneVideo: boolean = false;
  imagenes: any = [];
  videos: any = [];
  tabHome = '';
  tabHomeBtn = '';
  mostrarBandera: boolean = false;
  lista: boolean = false;
  configCarousel = {
    height: '250px',
    space: 1,
  };
  enLista: boolean = false;

  T: any;
  enCategoria: boolean = null;
  usuarioFinal: string = undefined;
  nombrePersona: string;
  playbackId: string = null;
  verVideo: boolean = false;

  banderaCasting: boolean = false;
  banderaLista: boolean = false;

  apiBaseUrl: string = '';
  personaIdEliminar: string = null;
  @ViewChild(ModalConfirmacionComponent) componenteModal;
  constructor(
    private bks: BreakpointObserver,
    private personaService: PersonaInfoService,
    private servicio: CastingStaffServiceService,
    private castingService: CastingClient,
    private toastService: HotToastService,
    private translate: TranslateService,
    private spinner: NgxSpinnerService,
    private modalService: BsModalService,
    private listasService: ListasClient,
    @Inject(API_BASE_URL) baseUrl?: string
  ) {

    this.apiBaseUrl = baseUrl?? '';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.persona != null) {
      this.usuarioFinal = this.persona.id;

      if (this.persona?.elementoMedioPrincipalId) {
        this.avatarUrl = `${this.apiBaseUrl}/contenido/bucket/modelos/${this.usuarioFinal}/foto/${this.persona.elementoMedioPrincipalId}-mini.png`;
      }
    }
  }

  ngOnInit(): void {
    this.spinner.show('loadMedios');
    this.bks
      .observe(['(min-width: 500px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.mobile = false;
        } else {
          this.mobile = true;
        }
      });

      this.servicio.DatosSeleccionSub().subscribe((e) => {
        this.ConfiguraSelectores(e);
      });



    this.translate.get(['buscar.categorias-error']).subscribe((ts) => {
      this.T = ts;
    });

    this.getNombreModelo();
    const nombreModelo = this.persona.nombre + ' ' + this.persona.apellido1 +' ' + this.persona.apellido2;
    this.servicio.setNombreModelo(nombreModelo);
    this.ConfiguraSelectores(this.servicio.SeleccionActual());
  }


  ConfiguraSelectores(e:  DatosSeleccion) {
    this.banderaCasting = e.casting && e.id != null  &&  e.id != '' && e.subid != null  &&  e.subid != '' ;
    this.banderaLista = e.lista && e.id != null  &&  e.id != '';
    this.enLista = false;
    this.enCategoria = false;

    if (this.banderaCasting) {
      this.enCategoria = this.servicio.personaEnCategoria(this.persona.id) >= 0;
    }

    if (this.banderaLista) {
        this.enLista = this.servicio.personaEnLista(this.persona.id) >= 0;
    }
  }

  onChangeCheckBox(id: string) {
    if (this.servicio.SeleccionActual().casting) {
      if (this.enCategoria) {
        this.castingService
          .modeloPut(this.servicio.SeleccionActual().id, id, this.servicio.SeleccionActual().subid
          )
          .subscribe((d) => {
            this.servicio.agregarModelo(id, this.servicio.SeleccionActual().subid);
            this.enCategoria = !this.enCategoria;
          });
      } else {
        this.castingService
          .modeloDelete(
            this.servicio.SeleccionActual().id, id, this.servicio.SeleccionActual().subid
          )
          .subscribe((d) => {
            this.servicio.removerModelo(id, this.servicio.SeleccionActual().subid);
            this.enCategoria = !this.enCategoria;
          });
      }
    } else {
      this.enCategoria = !this.enCategoria;
      this.toastService.warning(this.T['buscar.categorias-error'], {
        position: 'bottom-center',
      });
    }
  }

  onChangeListaCheckBox(idPersona: string) {
    if (!this.enLista) {
      this.listasService.miembroPost(this.servicio.SeleccionActual().id, idPersona).subscribe({
        next: res => {
          this.servicio.agregarModeloLista(idPersona);
          this.enLista = !this.enLista;
        },
        error: e => {
        }
      })
    } else {
      this.listasService.miembroDelete(this.servicio.SeleccionActual().id, idPersona).subscribe({
        next: res => {
          this.servicio.removerModeloLista(idPersona);
          this.enLista = !this.enLista
        },
        error: e => {
        }
      })
    }
  }

  editarPersona() {
    if (this.persona) {
      this.personaEditar.emit(this.persona.id);
    }
  }
  removerPersona() {
    if (this.persona) {
      this.personaRemover.emit(this.persona.id);
    }
  }
  verMedios() {
    this.uid.emit(this.persona.id);
  }

  selectTab() {
    this.traerMedios();
  }

  traerMedios() {
    this.personaService
      .obtieneMediosPErsona(this.usuarioFinal)
      .subscribe((m) => {
        m.elementos.forEach((e) => {
          if (e.imagen) {
            this.imagenes.push({
              image: `${this.apiBaseUrl}/contenido/bucket/modelos/${this.usuarioFinal}/foto/${e.id}${e.extension} `,
              thumbImage: `${this.apiBaseUrl}/contenido/bucket/modelos/${this.usuarioFinal}/foto/${e.id}-mini.png`,
            });
          } else {
            if (e.video) {
              this.videos.push({
                video: e.playBackId,
                posterImage: `${this.apiBaseUrl}/contenido/bucket/modelos/${this.usuarioFinal}/video/${e.id}-mini.jpg`,
              });
            }
          }
        });
        this.personaCargada.emit(false);
      });
  }
  getNombreModelo() {
    var nombre =
      this.persona.nombre +
      ' ' +
      this.persona.apellido1 +
      ' ' +
      this.persona.apellido2;

    if (nombre.length > 25) {
      this.nombrePersona = `${nombre.slice(0, 24)}...`.toUpperCase();
    } else {
      this.nombrePersona = `${nombre.slice(0, 24)}`.toUpperCase();
    }
  }
  modalRef?: BsModalRef;
  modalRefMux?: BsModalRef;

  openModalWithClass(template: TemplateRef<void>) {
    this.traerMedios();
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
  }

  openModalMux(template: TemplateRef<void>, index: number) {
    this.playbackId = this.videos[index].video;
    this.modalRefMux = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray  modal-md' })
    );
  }

  isResaltada: boolean = false;

  resaltarImagen(resaltar: boolean) {
    this.isResaltada = resaltar;
  }

  eliminar(p) {
    if(this.modoStaff){
      this.personaIdEliminar = p;
      this.componenteModal.openModal(
      this.componenteModal.myTemplate,
      'eliminar el modelo'
    );
    }else{
      this.removerPersona();
    }
  }

  eliminarPersona(persona: string){
    console.log(persona);
    this.personaService.eliminaPersonaPorId(persona).subscribe(e => {
      console.log(e);
      this.EstadoEliminacion.emit(true);
    });
  }

    // Auxiliares UI
  recibidoDelModal(r: string) {
    if (r == 'Y') {
      this.eliminarPersona(this.personaIdEliminar);
    }
    this.personaIdEliminar = null;
  }

  IGUsername(input: string | null | undefined): string | null {
    if (!input || typeof input !== 'string') {
      return null;
    }

    input = input.trim();

    if (input.startsWith("https://www.instagram.com/") || input.startsWith("https://instagram.com/")) {
      const regex = /https:\/\/(?:www\.)?instagram\.com\/([^\/\?\s]+)/;
      const match = input.match(regex);

      if (match && match[1]) {
        return match[1];
      }

    } else if (input.startsWith("instagram.com/")) {
      const regex = /instagram\.com\/([^\/\?\s]+)/;
      const match = input.match(regex);

      if (match && match[1]) {
        return match[1];
      }

    } else if (input.startsWith("@")) {
      const regex = /@([a-zA-Z0-9_.]+)/;
      const match = input.match(regex);

      if (match && match[1]) {
        return match[1];
      }

    }
    return null;
  }

  INUsername(input: string | null | undefined): string | null {
    if (!input || typeof input !== 'string') {
      return null;
    }

    input = input.trim();

    const fullUrlRegex = /https:\/\/(?:[a-zA-Z0-9\-]+\.)?linkedin\.com\/in\/([^\/\?\s]+)/;
    const match1 = input.match(fullUrlRegex);

    if (match1 && match1[1]) {
      return match1[1];
    }

    const simpleUrlRegex = /(?:www\.)?linkedin\.com\/in\/([^\/\?\s]+)/;
    const match2 = input.match(simpleUrlRegex);

    if (match2 && match2[1]) {
      return match2[1];
    }

    const usernameOnlyRegex = /^@?([a-zA-Z0-9\-_]+)$/;
    const match3 = input.match(usernameOnlyRegex);

    if (match3 && match3[1]) {
      return match3[1];
    }

    return null;
  }


  XUsername(input: string | null | undefined): string | null {
    if (!input || typeof input !== 'string') {
      return null;
    }

    input = input.trim();

    if (input.startsWith("https://www.twitter.com/") || input.startsWith("https://twitter.com/") || input.startsWith("https://x.com/")) {
      const regex = /https:\/\/(?:www\.)?(?:twitter\.com|x\.com)\/([^\/\?\s]+)/;
      const match = input.match(regex);

      if (match && match[1]) {
        return match[1];
      }

    } else if (input.startsWith("twitter.com/") || input.startsWith("x.com/")) {
      const regex = /(?:twitter\.com|x\.com)\/([^\/\?\s]+)/;
      const match = input.match(regex);

      if (match && match[1]) {
        return match[1];
      }

    } else if (input.startsWith("@")) {
      const regex = /@([a-zA-Z0-9_]+)/;
      const match = input.match(regex);

      if (match && match[1]) {
        return match[1];
      }

    }

    return null;
  }


  FBUsername(input: string | null | undefined): string | null {
    if (!input || typeof input !== 'string') {
      return null;
    }

    input = input.trim();

    if (input.startsWith("https://www.facebook.com/")) {
      const regexes = [
        /https:\/\/www\.facebook\.com\/([^\/\?\s]+)/,
        /https:\/\/www\.facebook\.com\/share\/([^\/\s]+)/,
        /https:\/\/www\.facebook\.com\/profile\.php\?id=(\d+)/
      ];

      for (const regex of regexes) {
        const match = input.match(regex);
        if (match && match[1]) {
          return match[1];
        }
      }

    } else if (input.startsWith("facebook.com/")) {
      const match = input.match(/facebook\.com\/([^\/\?\s]+)/);

      if (match && match[1]) {
        return match[1];
      }

    }

    return null;
  }
}
