import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { CatalogoTipoCuerpo } from 'src/app/modelos/entidades-vacias';
import { CatalogosCliente } from 'src/app/modelos/locales/catalogos-cliente';
import {
  BusquedaPersonasRequestPaginado,
  CastingClient,
  ElementoCatalogo,
  Persona,
  PersonaClient,
  SelectorCastingCategoria,
  SelectorCategoria,
  TipoCuerpo,
} from 'src/app/services/api/api-promodel';
import { BusquedaPersonasService } from 'src/app/services/busqueda-personas.service';
import { CastingStaffServiceService } from 'src/app/services/casting-staff-service.service';
import { PersonaInfoService } from 'src/app/services/persona/persona-info.service';
import { SessionQuery } from 'src/app/state/session.query';

@Component({
  selector: 'app-buscar-persona',
  templateUrl: './buscar-persona.component.html',
  styleUrls: ['./buscar-persona.component.scss'],
})
export class BuscarPersonaComponent implements OnInit, OnDestroy {
  @Output() EstadoBusqueda: EventEmitter<boolean> = new EventEmitter();
  private personas: Persona[] = [];
  private destroy$ = new Subject();
  private catalogos: CatalogosCliente[] = [];
  private T: any;
  inCall: boolean = false;

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

  categoriaId: string = null;
  porCategorias: boolean = false;
  orden = 'consecutivo';
  ordenModelos = ['consecutivo', 'nombre', 'nombreArtistico', 'edad'];
  ordenASC: boolean = true;
  constructor(
    private personaApi: PersonaClient,
    private personaService: PersonaInfoService,
    private spinner: NgxSpinnerService,
    private translate: TranslateService,
    private fb: FormBuilder,
    private session: SessionQuery,
    private castingClient: CastingClient,
    private formBuilder: FormBuilder,
    private servicio: CastingStaffServiceService,
    private servicioBusqueda: BusquedaPersonasService
  ) {
    this.formBuscarCasting = this.formBuilder.group({
      casting: ['', Validators.required],
      categorias: ['', Validators.required],
      porCategorias: [this.porCategorias],
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
  ngOnChanges(): void {}

  onChangeCasting(id: any) {
    this.servicio.ActualizarCasting(this.castings.find((c) => c.id == id));
    this.cargarCategorias();
    //this.servicio.ActualizarCategoria(this.categorias[0].id);
  }
  onChangeCategoria(id: string) {
    this.servicio.ActualizarCategoria(id);
  }
  onChangeCheckBox() {
    this.porCategorias = !this.porCategorias;
  }
  onChangeOrden() {
    this.ordenASC = !this.ordenASC;
    this.buscar();
  }
  cargarCategorias() {
    this.categorias = this.servicio.CategoriasCastingActual();
    this.servicio.ActualizarCategoria(this.categorias[0].id);
    this.categoriaId = this.categorias[0].id;
  }
  cargarCastings() {
    const temp: SelectorCastingCategoria[] = [];
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
}
