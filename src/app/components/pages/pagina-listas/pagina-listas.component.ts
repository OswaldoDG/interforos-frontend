import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ListasClient, ListaTalento } from 'src/app/services/api/api-promodel';
import { ModalEliminaListaComponent } from '../../common/modal-elimina-lista/modal-elimina-lista.component';

@Component({
  selector: 'app-pagina-listas',
  templateUrl: './pagina-listas.component.html',
  styleUrls: ['./pagina-listas.component.scss']
})
export class PaginaListasComponent implements OnInit {

  @ViewChild(ModalEliminaListaComponent) modalEliminaLista;

  formCrearLista: FormGroup = null;
  crearLista: boolean = false;
  isDisabled: boolean = true;
  lista: ListaTalento = {
    nombre: "",
    clienteId: "",
    agenciaId: "",
    idPersonas: []
  };
  showError: string = '';
  miembros: boolean = true;
  resObtieneListas: ListaTalento[] = [];
  listasFiltradas: ListaTalento[] = [];
  crearEditar: string = "";
  listaEditar: ListaTalento = null;
  controlLista: any = null;
  idLista: string = "";
  formBusquedaListas: FormGroup;
  T: any;

  constructor(
    private fb: FormBuilder,
    private listasApi: ListasClient,
    private spinner: NgxSpinnerService,
    private toastService: HotToastService,
    private translate: TranslateService
  ) { }


  ngOnInit(): void {
    this.obtieneListas();
    this.creaFormBusquedaListas();
    this.obtieneTraducciones();
    this.formBusquedaListas.get('buscarLista').valueChanges.subscribe((v) => {
      setTimeout(() => this.filtrarListas(v));
    })
  }

  obtieneTraducciones() {
    this.translate.get(['proyectos.error-lista-crear', 'proyectos.error-lista-actualizar','proyectos.error-lista-actualizar-409']).subscribe((ts) => {
      this.T = ts;
    })
  }

  muestraForm(isCreate?: string): void {
    this.crearEditar = isCreate;
    this.crearLista = !this.crearLista;
  }

  creaForm(): void {
    this.formCrearLista = this.fb.group({
      nombreLista: [null, Validators.required]
    });

  }

  creaFormBusquedaListas(): void {
    this.formBusquedaListas = new FormGroup({
      buscarLista: new FormControl()
    });
  }

  postListas(): void {
    if (this.revisaForm()) {
      this.listasApi.listasPost(this.lista).subscribe({
        next: res => {
          this.muestraForm();
          this.obtieneListas();
        },
        error: e => {
          this.muestraForm();
          this.toastService.error(this.T['proyectos.error-lista-crear'], {
            position: 'bottom-center'
          });
        }
      })
    }
  }

  revisaForm() {
    this.controlLista = this.formCrearLista.get('nombreLista');
    if (this.formCrearLista.valid) {
      this.lista.nombre = this.controlLista.value;
      return true;
    }
    return false;
  }

  putListas(): void {
    if (this.revisaForm()) {
      this.lista.id = this.idLista;
      this.listasApi.listasPut(this.idLista, this.lista).subscribe({
        next: res => {
          this.muestraForm();
          this.obtieneListas();
        },
        error: e => {
          this.muestraForm();
          if(e.status == 409) {
            this.toastService.warning(this.T['proyectos.error-lista-actualizar-409'], {
              position: 'bottom-center'
            });
          } else {
            this.toastService.error(this.T['proyectos.error-lista-actualizar'], {
              position: 'bottom-center'
            });            
          }
        }
      })
    }
  }

  editarLista(l: ListaTalento): void {
    if (!this.crearLista) {
      this.muestraForm();
    }
    if (this.crearEditar == 'C') {
      this.crearEditar = "";
    }
    this.creaForm();
    this.idLista = l.id;
    this.formCrearLista.controls['nombreLista'].setValue(l.nombre);
  }

  obtieneListas(): void {
    this.spinner.show('loadListas');
    this.listasApi.listasGet(this.miembros).subscribe({
      next: res => {
        this.resObtieneListas = res;
        this.listasFiltradas = this.resObtieneListas;
        this.spinner.hide('loadListas');
      },
      error: e => console.log(e)
    })
  }

  filtrarListas(buscarListas: string) {
    this.listasFiltradas = this.resObtieneListas.filter((w) => w.nombre.includes(buscarListas))
  }

  eliminaDeModal(r: boolean): void {
    if (r) {
      this.obtieneListas();
    }
  }

}
