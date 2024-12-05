import { HttpResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';
import { TabDirective } from 'ngx-bootstrap/tabs';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { CatalogoTipoCuerpo } from 'src/app/modelos/entidades-vacias';
import {
  BusquedaPersonasRequestPaginado,
  CastingClient,
  ElementoCatalogo,
  ListasClient,
  ListaTalento,
  SelectorCastingCategoria,
  SelectorCategoria,
  TipoCuerpo,
} from 'src/app/services/api/api-promodel';
import { BusquedaPersonasService } from 'src/app/services/busqueda-personas.service';
import { CastingStaffServiceService } from 'src/app/services/casting-staff-service.service';
import { DownloadExcelService } from 'src/app/services/Files/download-excel.service';
import { PersonaInfoService } from 'src/app/services/persona/persona-info.service';
import { SessionQuery } from 'src/app/state/session.query';

@Component({
  selector: 'app-buscar-persona',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './buscar-persona.component.html',
  styleUrls: ['./buscar-persona.component.scss'],
})
export class BuscarPersonaComponent implements OnInit, OnDestroy {
  @Output() EstadoBusqueda: EventEmitter<boolean> = new EventEmitter();
  private destroy$ = new Subject();
  private T: any;
  resListas: ListaTalento[];
  inCall: boolean = false;
  isList: boolean = false;
  miembrosListas: boolean = true;

  dropdownSettings: any;

  // Selector generos
  dataGeneros: ElementoCatalogo[] = [];
  generosId: ElementoCatalogo[] = [];

  dataOjos: ElementoCatalogo[] = [];
  selectedOjos: ElementoCatalogo[] = [];

  dataEtnia: ElementoCatalogo[] = [];
  selectedEtnia: ElementoCatalogo[] = [];

  dataCabello: ElementoCatalogo[] = [];
  selectedCabello: ElementoCatalogo[] = [];

  dataColorCabello: ElementoCatalogo[] = [];
  selectedColorCabello: ElementoCatalogo[] = [];

  dataIdiomas: ElementoCatalogo[] = [];
  selectedIdiomas: ElementoCatalogo[] = [];

  dataHabilidades: ElementoCatalogo[] = [];
  selectedHabilidades: ElementoCatalogo[] = [];

  dataTipoCuerpo: ElementoCatalogo[];
  selectedTipoCuerpo: ElementoCatalogo[] = [];

  castings: SelectorCastingCategoria[] = [];
  categorias: SelectorCategoria[] = [];

  dataAgencias: ElementoCatalogo[] = [];
  selectedAgencias: ElementoCatalogo[] = [];

  formBuscarCasting: FormGroup = this.fb.group({
    casting: [null],
    categorias: [null],
  });

  formListas: FormGroup = this.fb.group({
    listas: [null]
  });

  filtrarPorLista: boolean = false;
  filtrarPorProyecto: boolean = false;

  castingId:string = null;
  listaId: string = null;
  categoriaId: string = null;
  
  porCategorias: boolean = false;
  orden = 'consecutivo';
  ordenModelos = ['consecutivo', 'nombre', 'nombreArtistico', 'edad'];
  ordenASC: boolean = true;


  descargarCasting: boolean = false;
  descargarLista: boolean = false;

  constructor(
    private personaService: PersonaInfoService,
    private translate: TranslateService,
    private fb: FormBuilder,
    private session: SessionQuery,
    private castingClient: CastingClient,
    private formBuilder: FormBuilder,
    private servicio: CastingStaffServiceService,
    private servicioBusqueda: BusquedaPersonasService,
    private apiListas: ListasClient,
    private excelDescargaServicio: DownloadExcelService,
    private spinner: NgxSpinnerService,
    private toastService: HotToastService
  ) {
    this.formBuscarCasting = this.formBuilder.group({
      casting: ['', Validators.required],
      categorias: ['', Validators.required],
      porCategorias: [this.porCategorias],
    });
    this.formListas = formBuilder.group({
      listas: ['', Validators.required]
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.servicio.PutModoTrabajo(true);
    this.cargarCastings();
    this.CargaTraducciones();
    this.cargarListas();
  }

  formBuscar: FormGroup = this.fb.group({
    generosId: [null],
    edadMinima: [null, [Validators.min(0), Validators.max(150)]],
    edadMaxima: [null, [Validators.min(0), Validators.max(150)]],
    nombre: [null],
    tipoCuerpo: [null],
    tipoEtnia: [null],
    tipoOjos: [null],
    tipoCabello: [null],
    colorCabello: [null],
    idioma: [null],
    habilidades: [null],
    agencias: [null],
  });

  buscar() {
    this.EstadoBusqueda.emit(true);
    this.servicioBusqueda.solicitudBusquedaPersonas(this.BusquedaDesdeForma());
  }

  buscarModelos() {
    this.EstadoBusqueda.emit(true);
    this.servicioBusqueda.solicitudBusquedaPersonasId(
      this.BusquedaDesdeFormaIds()
    );
  }

  private BusquedaDesdeForma(): BusquedaPersonasRequestPaginado {
    return {
      request: {
        generosId: this.GetIdsDeFormField('generosId'),
        edadMinima: this.formBuscar.get('edadMinima').value,
        edadMaxima: this.formBuscar.get('edadMaxima').value,
        tipoCuerpos: this.ATipoCuerpos(this.GetIdsDeFormField('tipoCuerpo')),
        nombre: this.formBuscar.get('nombre').value,
        etniasIds: this.GetIdsDeFormField('tipoEtnia'),
        colorOjosIds: this.GetIdsDeFormField('tipoOjos'),
        tipoCabelloIds: this.GetIdsDeFormField('tipoCabello'),
        colorCabelloIds: this.GetIdsDeFormField('colorCabello'),
        idiomasIds: this.GetIdsDeFormField('idioma'),
        habilidadesIds: this.GetIdsDeFormField('habilidades'),
        agenciasIds: this.GetIdsDeFormField('agencias'),
      },
      ordernarASC: this.ordenASC,
      ordenarPor: this.orden,
      pagina: 1,
      tamano: 20,
    };
  }

  ordenChange(event) {
    this.orden = event;
    this.buscar();
  }

  private BusquedaDesdeFormaIds(): BusquedaPersonasRequestPaginado {
    let personas: string[] = [];
    if (this.porCategorias) {
      const categoria = this.categorias.find(
        (_) => _.id == this.formBuscarCasting.get('categorias').value
      );
      if (categoria != undefined) {
        categoria.modelos.forEach((id) => {
          personas.push(id.personaId);
        });
      }
    } else {
      this.categorias.forEach((categoria) => {
        categoria.modelos.forEach((m) => {
          if (!personas.includes(m.personaId)) {
            personas.push(m.personaId);
          }
        });
      });
    }
    return {
      request: {
        ids: personas,
      },
      ordernarASC: this.ordenASC,
      ordenarPor: this.orden,
      pagina: 1,
      tamano: 20,
    };
  }

    private ATipoCuerpos(ids: string[]): TipoCuerpo[] {
    if (ids != null) {
      const tipos = [];
      ids.forEach((id) => {
        switch (id) {
          case 'Bajo':
            tipos.push(TipoCuerpo.Bajo);
            break;

          case 'Normal':
            tipos.push(TipoCuerpo.Normal);
            break;

          case 'Obeso':
            tipos.push(TipoCuerpo.Obeso);
            break;

          case 'Sobrepeso':
            tipos.push(TipoCuerpo.Sobrepeso);
            break;
        }
      });
      return tipos;
    }
    return null;
  }

  private GetIdsDeFormField(campo: string): string[] {
    const ids = [];
    if (this.formBuscar.get(campo).value != null) {
      const valores = [...this.formBuscar.get(campo).value];
      valores.forEach((v) => {
        ids.push(v.clave);
      });
      return ids;
    }
    return null;
  }

  private CargaTraducciones() {
    this.translate
      .get([
        'modelo.excel-status-suc',
        'comun.select-all',
        'comun.select-clear',
        'comun.select-search',
        'buscar.tipocuerpo-delgado',
        'buscar.tipocuerpo-normal',
        'buscar.tipocuerpo-sobrepeso',
        'buscar.tipocuerpo-obeso',
      ])
      .subscribe((ts) => {
        this.T = ts;
        this.dropdownSettings = {
          singleSelection: false,
          idField: 'clave',
          textField: 'texto',
          selectAllText: this.T['comun.select-all'],
          unSelectAllText: this.T['comun.select-clear'],
          searchPlaceholderText: this.T['comun.select-search'],
          allowSearchFilter: true,
          enableCheckAll: false,
          clearSearchFilter: true,
        };
        this.llenaCatalogos();
      });
  }

  private llenaCatalogos() {
    this.session.cliente$.pipe(first()).subscribe((cliente) => {
      this.personaService
        .obtieneCatalogoCliente()
        .pipe(first())
        .subscribe(
          (result) => {
            if (result) {
              const catalogos = this.personaService.catalogos.find(
                (x) => x.url == cliente.url
              );
              if (catalogos) {
                this.dataGeneros = catalogos.catalogos.find(
                  (x) => x.tipoPropiedad == 'genero'
                ).elementos;
                this.dataOjos = catalogos.catalogos.find(
                  (x) => x.tipoPropiedad == 'colorojos'
                ).elementos;
                this.dataEtnia = catalogos.catalogos.find(
                  (x) => x.tipoPropiedad == 'etnia'
                ).elementos;
                this.dataCabello = catalogos.catalogos.find(
                  (x) => x.tipoPropiedad == 'tipocabello'
                ).elementos;
                this.dataColorCabello = catalogos.catalogos.find(
                  (x) => x.tipoPropiedad == 'colorcabello'
                ).elementos;
                this.dataHabilidades = catalogos.catalogos.find(
                  (x) => x.tipoPropiedad == 'actividades'
                ).elementos;
                this.dataIdiomas = catalogos.catalogos.find(
                  (x) => x.tipoPropiedad == 'idiomas'
                ).elementos;
                this.dataAgencias = catalogos.catalogos.find(
                  (x) => x.tipoPropiedad == 'agencias'
                ).elementos;

                const TipoCouerpo = CatalogoTipoCuerpo();
                TipoCouerpo[0].texto = this.T['buscar.tipocuerpo-delgado'];
                TipoCouerpo[1].texto = this.T['buscar.tipocuerpo-normal'];
                TipoCouerpo[2].texto = this.T['buscar.tipocuerpo-sobrepeso'];
                TipoCouerpo[3].texto = this.T['buscar.tipocuerpo-obeso'];
                this.dataTipoCuerpo = TipoCouerpo;

                this.formBuscar.valueChanges
                  .pipe(takeUntil(this.destroy$))
                  .subscribe((c) => {
                    //console.info(c);
                  });
              }
            }
          },
          (err) => {
            console.error(err);
          }
        );
    });
  }

  ngOnChanges(): void { }

  onChangeCasting(id: any) {
    this.castingId = id;
    this.MostrarCategoriasCasting();
  }

  onChangeCategoria(id: string) {
    this.categoriaId = id;
    this.setCastingData();
  }

  onChangeCheckBox() {
    this.porCategorias = !this.porCategorias;
    this.setCastingData();
  }

  onChangeOrden() {
    this.ordenASC = !this.ordenASC;
    this.buscar();
  }
  
  MostrarCategoriasCasting() {
    this.categorias = this.castings.find((c) => c.id == this.castingId).categorias;
    if(this.categorias.length> 0) {
      this.categoriaId = this.categorias[0].id;
    } else {
      this.categoriaId = null;
    }
    this.setCastingData();
  }

  cargarCastings() {
    const temp: SelectorCastingCategoria[] = [ { id: '', nombre: '', categorias: [] , participantes: [] } ];
    this.castingClient.castingGet(false).subscribe((data) => {
      if (data) {
        data.forEach((casting) => {
          this.castingClient.selector(casting.id).subscribe((c) => {
            if (c) {
              temp.push(c);
            }
          });
        });
      }
    });
    this.castings = temp;
  }
  
  cargarListas(): void {
    this.apiListas.listasGet(this.miembrosListas).subscribe({
      next: res => this.resListas = res,
      error: e => console.log(e)
    });
  }
  
  onChangeListas(id: string): void {
    this.listaId = id;
    this.setListaData();
  }
  
  onDestroyCategorias(): void {
    console.log('categorias destruido');
  }
  
  buscarModelosLista(): void {
    if(this.listaId) { 
      this.EstadoBusqueda.emit(true);
        this.servicioBusqueda.solicitudBusquedaPersonasId(
          this.BusquedListaIds()
      );
    }
  }


  private BusquedListaIds(): BusquedaPersonasRequestPaginado {
    let listaActual = this.resListas.find((l) => l.id == this.listaId);
      return {
        request: {
          ids: listaActual.idPersonas,
        },
        ordernarASC: this.ordenASC,
        ordenarPor: this.orden,
        pagina: 1,
        tamano: 20,
      };
  }

  onSelectTab(data: TabDirective, id: string): void {
    switch(id) {
      case 'l':
        this.setListaData();
        break;

      case 'c':
        this.setCastingData()
        break;
    }
  }

  setCastingData() {
    var c = this.castings.find(c=>c.id == this.castingId);
    this.servicio.SetTabCasting(this.castingId, this.categoriaId, this.porCategorias, c);
  }

  setListaData() {
    var l = this.resListas.find(c=>c.id == this.listaId);
    this.servicio.SetTabLista(this.listaId, l);
  }

  descargarArchivoCasting(formato: string) {
    this.excelDescargaCasting(this.castingId, formato);
  }

  descargarArchivoLista(formato: string) {
    this.excelDescargaLista(this.listaId, formato);
  }

  excelDescargaCasting(castingId: string, formato: string): void {
    this.spinner.show('loadCategorias');
    this.descargarCasting = true;
    this.descargarLista = true;
    this.excelDescargaServicio.descargarArchivoExcel2(castingId, formato).subscribe(
      (response: HttpResponse<Blob>) => {
        
        var extension = ".pdf";
        if(formato == "excel") {
          extension = ".xslx";
        }
        
        const blobData: Blob = response.body;
        this.descargarArchivo(blobData,this.servicio.SeleccionActual().castingData.nombre, extension);
      },
      (err) => {
        this.spinner.hide('loadCategorias');
        this.descargarCasting = false;
        this.descargarLista = false;
        this.toastService.error(this.T['modelo.excel-status-err'], {
          position: 'bottom-center',
        });
      }
    );
  }

  excelDescargaLista(castingId: string, formato: string): void {
    this.spinner.show('loadCategorias');
    this.descargarCasting = true;
    this.descargarLista = true;
    this.excelDescargaServicio.descargarArchivoLista(castingId, formato).subscribe(
      (response: HttpResponse<Blob>) => {

        var contentype = response.headers.get('content-type');
        
        var extension = ".pdf";
        if(formato == "excel") {
          extension = ".xslx";
        }
        
        const blobData: Blob = response.body;
        this.descargarArchivo(blobData,this.servicio.SeleccionActual().listData.nombre, extension);
      },
      (err) => {
        this.spinner.hide('loadCategorias');
        this.descargarCasting = false;
        this.descargarLista = false;
        this.toastService.error(this.T['modelo.excel-status-err'], {
          position: 'bottom-center',
        });
      }
    );
  }

  private descargarArchivo(blobData: Blob,nombre: string, extension: string ): void {
    const currentDate: Date = new Date();
    const formattedDate: string = `${currentDate.getUTCFullYear()}-${(
      currentDate.getUTCMonth() + 1
    )
      .toString()
      .padStart(2, '0')}-${currentDate
      .getUTCDate()
      .toString()
      .padStart(2, '0')}`;
    const filename: string = `${formattedDate}__${nombre}.${extension}`;
    const url = window.URL.createObjectURL(blobData);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.href = url;
    if (a.download != null || a.download != '') {
      a.download = filename;
      this.descargarCasting = false;
      this.descargarLista = false;
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      this.spinner.hide('loadCategorias');
      this.toastService.success(this.T['modelo.excel-status-suc'], {
        position: 'bottom-center',
      });
    }
  }
}
