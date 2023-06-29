import {
  Component,
  Input,
  OnChanges,
  Output,
  OnInit,
  SimpleChanges,
  EventEmitter,
} from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import {
  ContenidoClient,
  Documento,
  DocumentoModelo,
  FileParameter,
} from 'src/app/services/api/api-promodel';

@Component({
  selector: 'app-documento-persona',
  templateUrl: './documento-persona.component.html',
  styleUrls: ['./documento-persona.component.scss'],
})
export class DocumentoPersonaComponent implements OnInit, OnChanges {
  @Input() Instancias: Documento[] = null;
  @Input() Documento: DocumentoModelo = null;
  @Output() docUploaded: EventEmitter<string> = new EventEmitter();
  uploaded: boolean = false;
  uploadFile: File | null;
  uploadFileLabel: string | undefined = '';
  uploadProgress: number;
  uploadUrl: string;
  working: boolean = false;
  T: any;

  constructor(
    private spinner: NgxSpinnerService,
    private apiContenido: ContenidoClient,
    private toastService: HotToastService,
    private translate: TranslateService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.uploaded =
      this.Instancias.findIndex((i) => i.id == this.Documento.id) >= 0;
  }

  ngOnInit(): void {
    this.uploaded =
      this.Instancias.findIndex((i) => i.id == this.Documento.id) >= 0;

    this.cargaTraducciones();
  }

  cargaTraducciones() {
    this.translate
      .get([
        'perfil.error-envio-documento',
        'perfil.ok-envio-documento',
        'perfil.t-docs-opcional',
      ])
      .pipe(first())
      .subscribe((ts) => {
        this.T = ts;
        if (!this.Documento.obligatorio) {
          this.Documento.nombre = `${this.Documento.nombre} ${this.T['perfil.t-docs-opcional']}`;
        }
      });
  }

  handleFileInput(files: FileList) {
    if (files.length > 0) {
      this.uploadFile = files.item(0);
      this.uploadFileLabel = this.uploadFile?.name;
    }
  }

  upload() {
    if (!this.uploadFile) {
      this.toastService.warning(this.T['fotos.no-file'], {
        position: 'bottom-center',
      });
      return;
    }

    this.uploadUrl = '';
    this.uploadProgress = 0;
    this.working = true;
    this.spinner.show('spupload');

    const formData: FileParameter = {
      fileName: this.uploadFile.name,
      data: this.uploadFile,
    };
    this.apiContenido
      .documentacion(this.Documento.id, formData)
      .pipe(first())
      .subscribe(
        (e) => {
          this.toastService.success(this.T['perfil.ok-envio-documento'], {
            position: 'bottom-center',
          });
          this.uploadFile = null;
          this.uploadFileLabel = '';
          this.spinner.hide('docupload');
          this.uploadProgress = 0;
          this.working = false;
          this.uploaded = true;
          this.docUploaded.emit(this.Documento.id);
        },
        (err) => {
          this.toastService.error(this.T['perfil.error-envio-documento'], {
            position: 'bottom-center',
          });
          this.uploadFile = null;
          this.uploadFileLabel = '';
          this.spinner.hide('docupload');
          this.uploadProgress = 0;
          this.working = false;
          console.error(err);
        }
      );
  }
}
