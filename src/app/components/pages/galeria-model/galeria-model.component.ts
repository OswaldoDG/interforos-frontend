import {
  Component,
  EventEmitter,
  InjectionToken,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

import {
  FileParameter,
  ContenidoClient,
  ElementoMediaCliente,
  PersonaClient,
  CastingPersonaCompleto,
  MediaCliente,
} from 'src/app/services/api/api-promodel';
import { first } from 'rxjs/operators';
import { HotToastService } from '@ngneat/hot-toast';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { ElementoMediaView } from 'src/app/modelos/locales/elemento-media-view';
import { PersonaInfoService } from 'src/app/services/persona/persona-info.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { FormControl, FormGroup } from '@angular/forms';
import '@mux/mux-player';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');

@Component({
  selector: 'app-galeria-model',
  templateUrl: './galeria-model.component.html',
  styleUrls: ['./galeria-model.component.scss'],
})
export class GaleriaModelComponent implements OnInit {
  @Output() volverMisModelos: EventEmitter<string> = new EventEmitter();
  @Input() uid: string = undefined;
  blogGrid: number = 1;
  errorMedio: string = 'assets/img/errorMedio.jpg';
  working = false;
  uploadFile: File | null;
  uploadFiles : FileList;
  uploadFileLabel: string | undefined = 'Choose an image to upload';
  uploadProgress: number;
  uploadUrl: string;
  usuarioId: string = '';
  T: any;
  fotos: ElementoMediaView[] = [];
  imageObject: Array<object> = [];
  mediaCliente: MediaCliente;
  datosimagen: FormGroup;
  contenido = {
    titulo: '',
  };
  castingsActuales: CastingPersonaCompleto[] = [];
  castingId: string = '';
  verVideo: boolean = true;
  @ViewChild('fileInput') fileInput: any;
  constructor(
    private servicioPersona: PersonaInfoService,
    private apiContenido: ContenidoClient,
    private spinner: NgxSpinnerService,
    private translate: TranslateService,
    private toastService: HotToastService,
    private personaApi: PersonaClient
  ) {}

  get titulo() {
    return this.datosimagen.get('titulo')!;
  }

  ngOnInit(): void {
    this.personaApi
      .activos(this.uid)
      .pipe(first())
      .subscribe((data) => {
        this.castingsActuales = data;
      });
    this.datosimagen = new FormGroup({
      titulo: new FormControl(''),
    });

    this.cargaTraducciones();
    this.spinner.show('loading');
    this.traerMedios();
  }

  toLink(e: ElementoMediaCliente): ElementoMediaView {
    const elementoId = e.video ? e.frameVideoId : e.id;
    if (e.imagen) {
      return {
        id: e.id,
        extension: e.extension,
        mimeType: e.mimeType,
        imagen: e.imagen,
        video: e.video,
        permanente: e.permanente,
        principal: e.principal,
        landscape: e.landscape,
        titulo: e.titulo,
        url: `https://storage.googleapis.com/interforos/modelos/${this.usuarioId}/foto/${e.id}${e.extension}`,
        urlFull: `https://storage.googleapis.com/interforos/modelos/${this.usuarioId}/foto/${e.id}-mini${e.extension}`,
        castingId: e.castingId,
      };
    } else {
      if (e.video) {
        return {
          id: e.id,
          extension: e.extension,
          mimeType: e.mimeType,
          imagen: e.imagen,
          video: e.video,
          permanente: e.permanente,
          principal: e.principal,
          landscape: e.landscape,
          titulo: e.titulo,
          url: e.playBackId,
          urlFull: `${environment.apiRoot}/contenido/${this.mediaCliente.usuarioId}/${e.frameVideoId}/thumb`,
          castingId: e.castingId,
        };
      }
    }
  }

  setPrincipal(id: string) {
    this.servicioPersona.eliminaPersonaCachePurUID(this.usuarioId);
    this.fotos.forEach((f) => {
      if (f.id == id) {
        f.principal = true;
        f.permanente = true;
      } else {
        if (f.principal) {
          f.permanente = false;
        }
        f.principal = false;
      }
    });
  }

  bntPrincipal(id: string) {
    this.apiContenido
      .principal(this.uid, id)
      .pipe(first())
      .subscribe(
        (e) => {
          this.setPrincipal(id);
        },
        (err) => {
          this.toastService.error(this.T['fotos.foto-gen-error'], {
            position: 'bottom-center',
          });
          console.error(err);
        }
      );
  }

  eliminaElemento(id: string) {
    const index = this.fotos.findIndex((f) => f.id == id);
    this.fotos.splice(index, 1);
  }

  bntEliminar(id: any) {
    this.spinner.show('loading');
    const foto = this.fotos.find((f) => f.id == id);
    if (id == null) {
      this.toastService.error(this.T['fotos.foto-gen-error'], {
        position: 'bottom-center',
      });
      this.spinner.hide('loading');
      return;
    }
    if (foto.principal) {
      this.toastService.warning(this.T['fotos.foto-delprin-error'], {
        position: 'bottom-center',
      });
      this.spinner.hide('loading');
      return;
    }

    this.apiContenido
      .contenidoDelete(this.uid, id)
      .pipe(first())
      .subscribe(
        (e) => {
          this.eliminaElemento(id);
          this.spinner.hide('loading');
        },
        (err) => {
          this.toastService.error(this.T['fotos.foto-gen-error'], {
            position: 'bottom-center',
          });
          this.spinner.hide('loading');
          console.error(err);
        }
      );
  }

  setBloqueo(id: string) {
    this.fotos.forEach((f) => {
      if (f.id == id) {
        f.permanente = !f.permanente;
      }
    });
  }

  bntPin(id: any) {
    const foto = this.fotos.find((f) => f.id == id);
    if (foto.principal) {
      this.toastService.warning(this.T['fotos.foto-altprin-error'], {
        position: 'bottom-center',
      });
      return;
    }

    this.apiContenido
      .bloqueo(this.uid, id)
      .pipe(first())
      .subscribe(
        (e) => {
          this.setBloqueo(id);
        },
        (err) => {
          this.toastService.error(this.T['fotos.foto-gen-error'], {
            position: 'bottom-center',
          });
          console.error(err);
        }
      );
  }

  addElementoView(e: ElementoMediaView) {
    const items: ElementoMediaView[] = [...this.fotos];
    items.push(e);
    this.ordenaImagenes(items);
  }

  ordenaImagenes(items: ElementoMediaView[]) {
    const ordenados: ElementoMediaView[] = [];

    const principales = items.filter((x) => x.principal == true);
    const permanentes = items.filter(
      (x) => x.principal == false && x.permanente == true
    );
    const caducibles = items.filter((x) => x.permanente == false);
    if (principales) {
      principales.forEach((i) => {
        ordenados.push(i);
      });
    }

    if (permanentes) {
      permanentes.forEach((i) => {
        ordenados.push(i);
      });
    }

    if (caducibles) {
      caducibles.forEach((i) => {
        ordenados.push(i);
      });
    }
    this.fotos = ordenados;
  }

  cargaTraducciones() {
    this.translate
      .get([
        'fotos.foto-ok',
        'fotos.foto-error',
        'fotos.no-file',
        'fotos.foto-gen-error',
        'fotos.foto-altprin-error',
        'fotos.foto-delprin-error',
        'perfil.perfil.fotos.alta',
        'perfil.perfil.fotos',
      ])
      .pipe(first())
      .subscribe((ts) => {
        this.T = ts;
        if (this.uid != undefined) {
          this.pageTitleContent[0].title = this.T['perfil.perfil.fotos.alta'];
        } else {
          this.pageTitleContent[0].title = this.T['perfil.perfil.fotos'];
        }
      });
  }

  handleFileInput(files: FileList) {
    if (files.length > 0) {
      this.uploadFiles = files;
      console.log(this.uploadFiles);
      //this.uploadFile = files;
      //this.uploadFileLabel = this.uploadFile?.name;
    }
  }

  upload() {
    if (!this.uploadFiles) {
      this.toastService.warning(this.T['fotos.no-file'], {
        position: 'bottom-center',
      });
      return;
    }

    this.uploadUrl = '';
    this.uploadProgress = 0;
    this.working = true;
    this.spinner.show('loading');


    for(let i = 0; i<this.uploadFiles.length; i++){
      const formData: FileParameter = {
        fileName: this.uploadFiles[i].name,
        data: this.uploadFiles[i],
      };

      this.cargarArchivos(formData);

    }
  }

  cargarArchivos(formData : FileParameter){
    this.apiContenido
    .carga(
      this.uid,
      'galeria',
      formData,
      this.datosimagen.get('titulo').value,
      this.castingId
    )
    .pipe(first())
    .subscribe(
      (e) => {
        this.fileInput.nativeElement.value = '';
        this.toastService.success(this.T['fotos.foto-ok'], {
          position: 'bottom-center',
        });
        this.uploadFile = null;
        this.uploadFileLabel = null;
        this.spinner.hide('loading');
        this.uploadProgress = 0;
        this.working = false;
        this.addElementoView(this.toLink(e));
        this.datosimagen.get('titulo').setValue('');
      },
      (err) => {
        this.fileInput.nativeElement.value = '';
        this.toastService.error(this.T['fotos.foto-error'], {
          position: 'bottom-center',
        });
        this.uploadFile = null;
        this.uploadFileLabel = '';
        this.spinner.hide('loading');
        this.uploadProgress = 0;
        this.working = false;
        console.error(err);
      }
    );
  }

  onChangeCategoria(id: string) {
    this.castingId = id;
    this.traerMedios();
  }

  traerMedios() {
    this.apiContenido
      .mi(this.uid, this.castingId)
      .pipe(first())
      .subscribe(
        (media) => {
          this.fotos = [];
          this.usuarioId = media.usuarioId;
          this.mediaCliente = media;
          media.elementos.forEach((e) => {
            this.addElementoView(this.toLink(e));
          });
          this.spinner.hide('loading');
        },
        (err) => {
          this.spinner.hide('loading');
          console.error(err);
        }
      );
  }

  pageTitleContent = [
    {
      title: '',
    },
  ];

  volver() {
    this.volverMisModelos.emit(null);
    this.uid = undefined;
  }
  manejarError(): void {
    this.verVideo = false;
  }
}
