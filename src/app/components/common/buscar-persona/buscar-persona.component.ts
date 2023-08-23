import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
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
  PersonaResponsePaginado,
  SelectorCastingCategoria,
  SelectorCategoria,
  TipoCuerpo,
} from 'src/app/services/api/api-promodel';
import { CastingStaffServiceService } from 'src/app/services/casting-staff-service.service';
import { PersonaInfoService } from 'src/app/services/persona/persona-info.service';
import { SessionQuery } from 'src/app/state/session.query';
import { SessionService } from 'src/app/state/session.service';

@Component({
  selector: 'app-buscar-persona',
  templateUrl: './buscar-persona.component.html',
  styleUrls: ['./buscar-persona.component.scss'],
})
export class BuscarPersonaComponent implements OnInit, OnDestroy {
  @Output() PersonasEncontradas: EventEmitter<PersonaResponsePaginado> =
    new EventEmitter();
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

  formBuscarCasting: FormGroup = this.fb.group({
    casting: [null],
    categorias: [null],
  });

  cateoriaId: string = null;
  porCategorias: boolean = false;
  constructor(
    private personaApi: PersonaClient,
    private personaService: PersonaInfoService,
    private spinner: NgxSpinnerService,
    private translate: TranslateService,
    private fb: FormBuilder,
    private sessionService: SessionService,
    private session: SessionQuery,
    private castingClient: CastingClient,
    private formBuilder: FormBuilder,
    private servicio: CastingStaffServiceService
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
  });

  buscar() {
    this.EstadoBusqueda.emit(true);
    const param = this.BusquedaDesdeForma();
    this.personaApi
      .buscar(param)
      .pipe(first())
      .subscribe((r) => {
        this.PersonasEncontradas.emit(r);
        this.EstadoBusqueda.emit(false);
      });
  }

  buscarModelos() {
    this.EstadoBusqueda.emit(true);
    const param = this.BusquedaDesdeFormaIds();
    this.personaApi
      .idPost(param)
      .pipe(first())
      .subscribe((r) => {
        this.PersonasEncontradas.emit(r);
        this.EstadoBusqueda.emit(false);
      });
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
      },
      ordernarASC: true,
      ordenarPor: 'nombre',
      pagina: 1,
      tamano: 50,
    };
  }

  private BusquedaDesdeFormaIds(): BusquedaPersonasRequestPaginado {
    let personas: string[] = [];
    if (this.porCategorias) {
      const categoria = this.categorias.find(
        (_) => _.id == this.formBuscarCasting.get('categorias').value
      );
      if (categoria != undefined) {
        categoria.modelos.forEach((id) => {
          personas.push(id);
        });
      }
    } else {
      this.categorias.forEach((categoria) => {
        categoria.modelos.forEach((m) => {
          if (!personas.includes(m)) {
            personas.push(m);
          }
        });
      });
    }
    return {
      request: {
        ids: personas,
      },
      ordernarASC: true,
      ordenarPor: 'nombre',
      pagina: 1,
      tamano: 50,
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

                const TipoCouerpo = CatalogoTipoCuerpo();
                TipoCouerpo[0].texto = this.T['buscar.tipocuerpo-delgado'];
                TipoCouerpo[1].texto = this.T['buscar.tipocuerpo-normal'];
                TipoCouerpo[2].texto = this.T['buscar.tipocuerpo-sobrepeso'];
                TipoCouerpo[3].texto = this.T['buscar.tipocuerpo-obeso'];
                this.dataTipoCuerpo = TipoCouerpo;

                this.formBuscar.valueChanges
                  .pipe(takeUntil(this.destroy$))
                  .subscribe((c) => {
                    console.info(c);
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
    this.servicio.ActualizarCategoria(this.categorias[0].id);
  }
  onChangeCategoria(id: string) {
    this.servicio.ActualizarCategoria(id);
  }
  onChangeCheckBox() {
    this.porCategorias = !this.porCategorias;
  }
  cargarCategorias() {
    this.categorias = this.servicio.CategoriasCastingActual();
    this.servicio.ActualizarCategoria(this.categorias[0].id);
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
