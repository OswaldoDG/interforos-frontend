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
  @Input() personaId: string = null;
  @Input() estadoBoton: boolean = false;
  @Output() docUploaded: EventEmitter<string> = new EventEmitter();
  @Output() enviandoDoc: EventEmitter<boolean> = new EventEmitter();
  uploaded: boolean = false;
  selectedFile: boolean = true;
  uploadFile: File | null;
  uploadFileLabel: string | undefined = '';
  uploadProgress: number;
  uploadUrl: string;
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
      });
  }

  handleFileInput(files: FileList) {
    if (files.length > 0) {
      this.uploadFile = files.item(0);
      this.uploadFileLabel = this.uploadFile?.name;
    }
  }
  onFileSelected(file: FileList) {
    if (file.length > 0) {
      this.selectedFile = false;
    } else {
      this.selectedFile = true;
    }
  }

  upload() {
    this.enviandoDoc.emit(true);
    this.selectedFile = true;
    if (!this.uploadFile) {
      this.toastService.warning(this.T['fotos.no-file'], {
        position: 'bottom-center',
      });
      return;
    }

    this.uploadUrl = '';
    this.uploadProgress = 0;
    this.spinner.show('spupload');

    const formData: FileParameter = {
      fileName: this.uploadFile.name,
      data: this.uploadFile,
    };
    this.apiContenido
      .documentacion(this.personaId, this.Documento.id, formData, '', '')
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
          this.uploaded = true;
          this.docUploaded.emit(this.Documento.id);
          this.enviandoDoc.emit(false);
          this.selectedFile = false;
          this.uploadFile = null;
        },
        (err) => {
          this.toastService.error(this.T['perfil.error-envio-documento'], {
            position: 'bottom-center',
          });
          this.uploadFile = null;
          this.uploadFileLabel = '';
          this.spinner.hide('docupload');
          this.uploadProgress = 0;
          this.enviandoDoc.emit(false);
          this.selectedFile = false;
          console.error(err);
        }
      );
  }
}
