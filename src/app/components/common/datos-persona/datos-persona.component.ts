import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';
import { DateTimeAdapter } from 'ng-pick-datetime';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import {
  AccesoInformacion,
  CatalogoBase,
  Documento,
  DocumentoModelo,
  ElementoCatalogo,
  Persona,
  PersonaClient,
  TipoRelacionPersona,
} from 'src/app/services/api/api-promodel';
import { PersonaInfoService } from 'src/app/services/persona/persona-info.service';
import { compare } from 'src/app/services/utiles';
import { SessionQuery } from 'src/app/state/session.query';
import { SessionService } from 'src/app/state/session.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-datos-persona',
  templateUrl: './datos-persona.component.html',
  styleUrls: ['./datos-persona.component.scss'],
})
export class DatosPersonaComponent implements OnInit {
  @Input() miPerfil: boolean = true;
  @Input() personaId: string = null;
  @Input() validarDocumentos: boolean = true;
  @Input() agenciaId: string = null;
  @Input() enviadoEstado: boolean = false;
  @Output() PersonaCreada: EventEmitter<string> = new EventEmitter();
  @Output() PersonaActualizada: EventEmitter<string> = new EventEmitter();
  private destroy$ = new Subject();
  private persona: Persona = {
    id: '',
    clientes: [],
    exclusivo: false,
    usuarioId: '',
    nombre: '',
    nombreArtistico: '',
    relacion: TipoRelacionPersona.Yo,
    permisoTrabajo: false,
    extranjero: false,
    nombreBusqueda: '',
  };

  private esUpdate: boolean = false;
  private catalogos: CatalogoBase[] = [];
  private T: any;

  consecutivo: string = '';
  mostrarContacto: boolean = true;
  inCall: boolean = false;
  mobile: boolean = false;
  tiposTalla: ElementoCatalogo[] = [];
  estados: ElementoCatalogo[] = [];
  paises: ElementoCatalogo[] = [];
  generos: ElementoCatalogo[] = [];
  coloresojos: ElementoCatalogo[] = [];
  colorescabello: ElementoCatalogo[] = [];
  tiposcabello: ElementoCatalogo[] = [];
  etnias: ElementoCatalogo[] = [];
  agencias: ElementoCatalogo[] = [];
  esExtranjero: boolean = false;
  dropdownListIdiomas: ElementoCatalogo[] = [];
  selectedItemsIdiomas: ElementoCatalogo[] = [];
  dropdownListAgencias: ElementoCatalogo[] = [];
  selectedItemsAgencias: ElementoCatalogo[] = [];
  dropdownSettingsIdiomas = {};
  dropdownSettingsAgencias = {};

  dropdownListHabilidades: ElementoCatalogo[] = [];
  selectedItemsHabilidades: ElementoCatalogo[] = [];
  dropdownSettingsHabilidades = {};
  otroIdioma = null;
  otroColorCabello = null;
  otroColorOjos = null;
  otroGrupoRacial = null;
  otroTipoCabello = null;
  otroHabilidad = null;
  otroAgencia = null;

  documentos: DocumentoModelo[] = [];
  instanciasDocumento: Documento[] = [];
  mostrarOpcion: boolean;
  registroCompleto: boolean = false;
  dismissible = true;
  constructor(
    private personaService: PersonaInfoService,
    private bks: BreakpointObserver,
    private spinner: NgxSpinnerService,
    private apiPersona: PersonaClient,
    private translate: TranslateService,
    private toastService: HotToastService,
    private fb: FormBuilder,
    private sessionService: SessionService,
    dateTimeAdapter: DateTimeAdapter<any>,
    session: SessionQuery
  ) {
    dateTimeAdapter.setLocale(session.lang);
    this.mostrarOpcion = environment.catalogosAbiertos == false;
    session.cliente$.pipe(first()).subscribe((c) => {
      this.documentos = c.documentacion;
    });
  }

  private CargaTraducciones() {
    this.translate
      .get([
        'perfil.select-ph',
        'perfil.select-all',
        'perfil.select-clear',
        'perfil.select-search',
        'perfil.select-nodata',
        'perfil.datos-incorrectos',
        'perfil.datos-ok',
        'perfil.datos-error',
        'perfil.documentos-incompletos',
        'perfil.campos-faltantes',
        'perfil.nombre',
        'perfil.apellido1',
        'perfil.apellido2',
        'perfil.fechaNacimiento',
        'perfil.paisOrigenId',
        'perfil.paisActualId',
        'perfil.generoId',
        'perfil.extranjero',
        'perfil.permisoTrabajo',
        'perfil.nombreArtistico',
        'perfil.pesoCampo',
        'perfil.alturaCampo',
        'perfil.pantalon',
        'perfil.playera',
        'perfil.calzado',
        'perfil.tipoTallaId',
        'perfil.agenciasIds',
        'perfil.idiomas',
        'perfil.otrosAgenciasIds',
        'perfil.colorOjosId',
        'perfil.colorCabelloId',
        'perfil.tipoCabelloId',
        'perfil.etniaId',
        'perfil.email',
      ])
      .subscribe((ts) => {
        this.T = ts;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  formGenerales: FormGroup = this.fb.group({
    id: [null],
    clientes: [null],
    exclusivo: [false],
    usuarioId: [null],
    nombreArtistico: [
      null,
      Validators.compose([Validators.required, Validators.minLength(2)]),
    ],
    nombre: [
      null,
      Validators.compose([Validators.required, Validators.minLength(2)]),
    ],
    apellido1: [null, Validators.required],
    apellido2: [null, Validators.required],
    fechaNacimiento: [null, Validators.required],
    relacion: ['Yo'],
    paisOrigenId: [null, Validators.required],
    paisActualId: [null, Validators.required],
    estadoPaisId: [null],
    generoId: [null, Validators.required],
    extranjero: [false, Validators.required],
    permisoTrabajo: [false, Validators.required],
    zonaHorariaId: [null],
    offsetHorario: [null],
    idiomasIds: [null],
    agenciasIds: [null],
  });

  formContacto: FormGroup = this.fb.group({
    direccion: [null],
    telefono: [null, Validators.pattern('^[0-9]{10}$')],
    email: [null, Validators.required],
    twitter: [null],
    faceBook: [null],
    linkedIn: [null],
    instagram: [null],
    telSMS: [null],
    telefonoWhatsApp: [null],
    amigos: [true],
    profesionales: [true],
    omitirDatos: [false],
  });

  formFisicas: FormGroup = this.fb.group({
    mks: [true],
    altura: [null, Validators.required],
    peso: [null, Validators.required],
    colorOjosId: [null],
    colorCabelloId: [null],
    tipoCabelloId: [null],
    etniaId: [null],
    unidadesmks: ['mks'],
  });

  private FormaAPersona(): Persona {
    const accesos: AccesoInformacion = {
      profesionales: this.formContacto.get('profesionales').getRawValue(),
      amigos: this.formContacto.get('amigos').getRawValue(),
    };

    const p: Persona = this.formGenerales.getRawValue();
    p.contacto = this.formContacto.getRawValue();

    p.clientes = [];
    p.nombreBusqueda = '';
    if (p.contacto.omitirDatos) {
      p.contacto.email = null;
      p.contacto.telefono = null;
      p.contacto.direccion = null;
      p.contacto.faceBook = null;
      p.contacto.instagram = null;
      p.contacto.linkedIn = null;
      p.contacto.telSMS = null;
      p.contacto.telefonoWhatsApp = null;
      accesos.amigos = false;
      accesos.profesionales = false;
    }

    p.contacto.accesoDireccion = accesos;
    p.contacto.accesoEmail = accesos;
    p.contacto.accesoRedes = accesos;
    p.contacto.accesoTelefono = accesos;
    p.propiedadesFisicas = this.formFisicas.getRawValue();
    p.propiedadesVestuario = this.formVestuario.getRawValue();
    p.idiomasIds = [];
    p.actividadesIds = [];
    p.agenciasIds = [];
    p.extranjero = this.esExtranjero;
    this.selectedItemsAgencias.forEach((i) => {
      p.agenciasIds.push(i.clave);
    });

    this.selectedItemsIdiomas.forEach((i) => {
      p.idiomasIds.push(i.clave);
    });

    if (this.formFisicas.get('unidadesmks').value == 'mks') {
      p.propiedadesFisicas.mks = true;
    } else {
      p.propiedadesFisicas.mks = false;
    }

    this.selectedItemsHabilidades.forEach((i) => {
      p.actividadesIds.push(i.clave);
    });

    p.otroIdioma = this.otroIdioma;
    p.otroColorCabello = this.otroColorCabello;
    p.otroColorOjos = this.otroColorOjos;
    p.otroGrupoRacial = this.otroGrupoRacial;
    p.otroTipoCabello = this.otroTipoCabello;
    p.otroHabilidad = this.otroHabilidad;
    p.otroAgencia = this.otroAgencia;

    return p;
  }

  private ValoresAForma() {
    if (this.persona.id == '') {
      return;
    }

    if (this.persona.paisOrigenId) {
      this.onChangePais(this.persona.paisActualId);
    }

    if (this.persona.contacto.accesoDireccion) {
      this.formContacto
        .get('profesionales')
        .setValue(this.persona.contacto.accesoDireccion.profesionales);
      this.formContacto
        .get('amigos')
        .setValue(this.persona.contacto.accesoDireccion.amigos);
    }

    this.formContacto
      .get('direccion')
      .setValue(this.persona.contacto.direccion);
    this.formContacto.get('faceBook').setValue(this.persona.contacto.faceBook);
    this.formContacto
      .get('instagram')
      .setValue(this.persona.contacto.instagram);
    this.formContacto.get('linkedIn').setValue(this.persona.contacto.linkedIn);
    this.formContacto
      .get('omitirDatos')
      .setValue(this.persona.contacto.omitirDatos);
    this.formContacto.get('telefono').setValue(this.persona.contacto.telefono);
    this.formContacto.get('twitter').setValue(this.persona.contacto.twitter);
    this.formContacto.get('telefono').setValue(this.persona.contacto.telefono);
    this.formContacto.get('twitter').setValue(this.persona.contacto.twitter);
    this.formContacto
      .get('telefonoWhatsApp')
      .setValue(this.persona.contacto.telefonoWhatsApp);
    this.formContacto.get('telSMS').setValue(this.persona.contacto.telSMS);
    if (!this.miPerfil || this.agenciaId) {
      this.formContacto.get('email').setValue(this.persona.contacto.email);
    }
    this.mostrarContacto = !this.persona.contacto.omitirDatos;

    this.formGenerales.get('id').setValue(this.persona.id);
    this.formGenerales.get('usuarioId').setValue(this.persona.usuarioId);
    this.formGenerales
      .get('nombreArtistico')
      .setValue(this.persona.nombreArtistico);
    this.formGenerales.get('nombre').setValue(this.persona.nombre);
    this.formGenerales.get('apellido1').setValue(this.persona.apellido1);
    this.formGenerales.get('apellido2').setValue(this.persona.apellido2);
    this.formGenerales
      .get('fechaNacimiento')
      .setValue(this.persona.fechaNacimiento);
    this.formGenerales.get('relacion').setValue(this.persona.relacion);
    this.formGenerales.get('paisOrigenId').setValue(this.persona.paisOrigenId);
    this.formGenerales.get('paisActualId').setValue(this.persona.paisActualId);
    this.formGenerales.get('estadoPaisId').setValue(this.persona.estadoPaisId);
    this.formGenerales.get('generoId').setValue(this.persona.generoId);
    this.formGenerales.get('extranjero').setValue(this.persona.extranjero);
    this.formGenerales
      .get('permisoTrabajo')
      .setValue(this.persona.permisoTrabajo);
    this.formGenerales
      .get('zonaHorariaId')
      .setValue(this.persona.zonaHorariaId);
    this.formGenerales
      .get('zonaHorariaId')
      .setValue(this.persona.zonaHorariaId);
    this.formGenerales
      .get('offsetHorario')
      .setValue(this.persona.offsetHorario);
    this.formGenerales.get('idiomasIds').setValue(this.persona.idiomasIds);
    this.formGenerales.get('agenciasIds').setValue(this.persona.agenciasIds);

    this.esExtranjero = !!this.persona.extranjero;

    this.formFisicas.get('mks').setValue(this.persona.propiedadesFisicas?.mks);
    this.formFisicas
      .get('altura')
      .setValue(this.persona.propiedadesFisicas?.altura);
    this.formFisicas
      .get('peso')
      .setValue(this.persona.propiedadesFisicas?.peso);
    this.formFisicas
      .get('colorOjosId')
      .setValue(this.persona.propiedadesFisicas?.colorOjosId);
    this.formFisicas
      .get('colorCabelloId')
      .setValue(this.persona.propiedadesFisicas?.colorCabelloId);
    this.formFisicas
      .get('tipoCabelloId')
      .setValue(this.persona.propiedadesFisicas?.tipoCabelloId);
    this.formFisicas
      .get('etniaId')
      .setValue(this.persona.propiedadesFisicas?.etniaId);

    this.formFisicas.get('unidadesmks').setValue('mks');
    if (this.persona.propiedadesFisicas?.mks != null) {
      if (this.persona.propiedadesFisicas?.mks == false) {
        this.formFisicas.get('unidadesmks').setValue('ingles');
      }
    }

    this.formVestuario
      .get('pantalon')
      .setValue(this.persona.propiedadesVestuario?.pantalon);
    this.formVestuario
      .get('playera')
      .setValue(this.persona.propiedadesVestuario?.playera);
    this.formVestuario
      .get('calzado')
      .setValue(this.persona.propiedadesVestuario?.calzado);
    this.formVestuario
      .get('tipoTallaId')
      .setValue(this.persona.propiedadesVestuario?.tipoTallaId);
  }

  formVestuario: FormGroup = this.fb.group({
    pantalon: [null, Validators.required],
    playera: [null, Validators.required],
    calzado: [null, Validators.required],
    tipoTallaId: ['MX', Validators.required],
  });

  onSelectHabilidades(e: any) {}

  onSelectAllHabilidades(e: any) {}

  onSelectIdiomas(e: any) {}

  onSelectAllIdiomas(e: any) {}

  onSelectAgencias(e: any) {}

  onSelectAllAgencias(e: any) {}

  setHabilidades() {
    this.dropdownListHabilidades = this.catalogos
      .find((x) => x.tipoPropiedad == 'actividades')
      .elementos.sort(compare);

    const habilidades: ElementoCatalogo[] = [];

    if (this.persona.actividadesIds) {
      this.persona.actividadesIds.forEach((i) => {
        const item = this.dropdownListHabilidades.find((x) => x.clave == i);
        if (item) {
          habilidades.push(item);
        }
      });
    }

    this.selectedItemsHabilidades = habilidades;
    this.dropdownSettingsHabilidades = {
      singleSelection: false,
      idField: 'clave',
      textField: 'texto',
      selectAllText: this.T['perfil.select-all'],
      unSelectAllText: this.T['perfil.select-clear'],
      searchPlaceholderText: this.T['perfil.select-search'],
      allowSearchFilter: true,
      enableCheckAll: false,
      clearSearchFilter: true,
    };
  }

  setAgencias() {
    this.dropdownListAgencias = this.catalogos
      .find((x) => x.tipoPropiedad == 'agencias')
      .elementos.sort(compare);

    const agencias: ElementoCatalogo[] = [];

    if (this.persona.agenciasIds && !this.agenciaId) {
      this.persona.agenciasIds.forEach((i) => {
        const item = this.dropdownListAgencias.find((x) => x.clave == i);
        if (item) {
          agencias.push(item);
        }
      });
    } else {
      const item = this.dropdownListAgencias.find(
        (x) => x.clave == this.agenciaId
      );
      if (item) {
        agencias.push(item);
      }
    }
    this.selectedItemsAgencias = agencias;
    this.dropdownSettingsAgencias = {
      singleSelection: false,
      idField: 'clave',
      textField: 'texto',
      selectAllText: this.T['perfil.select-all'],
      unSelectAllText: this.T['perfil.select-clear'],
      searchPlaceholderText: this.T['perfil.select-search'],
      allowSearchFilter: true,
      enableCheckAll: false,
      clearSearchFilter: true,
    };
  }

  setIdiomas() {
    this.dropdownListIdiomas = this.catalogos
      .find((x) => x.tipoPropiedad == 'idiomas')
      .elementos.sort(compare);

    const idiomas: ElementoCatalogo[] = [];

    if (this.persona.idiomasIds) {
      this.persona.idiomasIds.forEach((i) => {
        const item = this.dropdownListIdiomas.find((x) => x.clave == i);
        if (item) {
          idiomas.push(item);
        }
      });
    }

    this.selectedItemsIdiomas = idiomas;
    this.dropdownSettingsIdiomas = {
      singleSelection: false,
      idField: 'clave',
      textField: 'texto',
      selectAllText: this.T['perfil.select-all'],
      unSelectAllText: this.T['perfil.select-clear'],
      searchPlaceholderText: this.T['perfil.select-search'],
      allowSearchFilter: true,
      enableCheckAll: false,
      clearSearchFilter: true,
    };
  }

  onChangePais(clave: string) {
    const c = this.catalogos.find(
      (x) => x.tipoPropiedad == `estado${clave.toLowerCase()}`
    );
    if (c) {
      this.estados = c.elementos;
    } else {
      this.estados = [];
    }
    this.formGenerales.get('estadoPaisId').setValue(this.persona.estadoPaisId);
  }

  private OntieneCatalogos() {
    this.apiPersona
      .perfil()
      .pipe(first())
      .subscribe(
        (cs) => {
          this.catalogos = cs;
          this.tiposTalla = cs.find(
            (x) => x.tipoPropiedad == 'tallasvestuario'
          ).elementos;
          this.etnias = cs.find((x) => x.tipoPropiedad == 'etnia').elementos;
          this.colorescabello = cs.find(
            (x) => x.tipoPropiedad == 'colorcabello'
          ).elementos;
          this.tiposcabello = cs.find(
            (x) => x.tipoPropiedad == 'tipocabello'
          ).elementos;
          this.coloresojos = cs.find(
            (x) => x.tipoPropiedad == 'colorojos'
          ).elementos;
          this.paises = cs.find((x) => x.tipoPropiedad == 'pais').elementos;
          this.generos = cs.find((x) => x.tipoPropiedad == 'genero').elementos;
          this.ObtienePerfil();
        },
        (err) => {
          console.error(err);
        }
      );
  }

  private ObtienePerfil() {
    if (!this.miPerfil) {
      if (this.personaId) {
        this.apiPersona
          .idGet(this.personaId)
          .pipe(first())
          .subscribe(
            (p) => {
              this.persona = p;
              this.consecutivo =
                p.consecutivo != null ? p.consecutivo.toString() : '-';
              this.instanciasDocumento = p.documentos;
              this.esUpdate = true;
              this.setIdiomas();
              this.setAgencias();
              this.setHabilidades();
              this.ValoresAForma();
              this.spinner.hide('spperfil');
              this.registroCompleto = this.persona.datosCompletos;
            },
            (err) => {
              this.esUpdate = false;
              this.setIdiomas();
              this.setAgencias();
              this.setHabilidades();
              this.ValoresAForma();
              this.spinner.hide('spperfil');
              if (err.status != 404) {
                console.error(err);
              }
            }
          );
      } else {
        this.apiPersona
          .newPerfil()
          .pipe(first())
          .subscribe(
            (p) => {
              this.persona = p;
              this.consecutivo =
                p.consecutivo != null ? p.consecutivo.toString() : '-';
              this.instanciasDocumento = p.documentos;
              this.esUpdate = true;
              this.setIdiomas();
              this.setAgencias();
              this.setHabilidades();
              this.ValoresAForma();
              this.spinner.hide('spperfil');
            },
            (err) => {
              this.esUpdate = false;
              this.setIdiomas();
              this.setAgencias();
              this.setHabilidades();
              this.ValoresAForma();
              this.spinner.hide('spperfil');
              if (err.status != 404) {
                console.error(err);
              }
            }
          );
      }
    } else {
      this.apiPersona
        .mi()
        .pipe(first())
        .subscribe(
          (p) => {
            this.persona = p;
            this.consecutivo =
              p.consecutivo != null ? p.consecutivo.toString() : '-';
            this.instanciasDocumento = p.documentos;
            this.esUpdate = true;
            this.setIdiomas();
            this.setAgencias();
            this.setHabilidades();
            this.ValoresAForma();
            this.spinner.hide('spperfil');
            this.registroCompleto = this.persona.datosCompletos;
          },
          (err) => {
            this.esUpdate = false;
            this.setIdiomas();
            this.setAgencias();
            this.setHabilidades();
            this.ValoresAForma();
            this.spinner.hide('spperfil');
            if (err.status != 404) {
              console.error(err);
            }
          }
        );
    }
  }

  ngOnInit(): void {
    this.spinner.show('spperfil');
    this.CargaTraducciones();
    this.OntieneCatalogos();

    this.bks
      .observe(['(min-width: 500px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.mobile = false;
        } else {
          this.mobile = true;
        }
      });

    this.formGenerales.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((v) => {
        this.esExtranjero = v['extranjero'] == true;
      });

    this.formFisicas.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((v) => {});

    this.formContacto.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((v) => {
        this.mostrarContacto = !this.formContacto
          .get('omitirDatos')
          .getRawValue();
      });
  }

  datosListaValidos(): boolean {
    if (this.selectedItemsIdiomas.length == 0 && this.otroIdioma == null) {
      this.toastService.warning(this.T['perfil.idiomas'], {
        position: 'bottom-center',
      });
      return false;
    }

    if (this.selectedItemsAgencias.length == 0) {
      this.toastService.warning(this.T['perfil.agenciasIds'], {
        position: 'bottom-center',
      });
      return false;
    }

    if (
      this.formFisicas.get('colorOjosId').getRawValue() == null &&
      this.otroColorOjos == null
    ) {
      this.toastService.warning(this.T['perfil.colorOjosId'], {
        position: 'bottom-center',
      });
      return false;
    }

    if (
      this.formFisicas.get('colorCabelloId').getRawValue() == null &&
      this.otroColorCabello == null
    ) {
      this.toastService.warning(this.T['perfil.colorCabelloId'], {
        position: 'bottom-center',
      });
      return false;
    }

    if (
      this.formFisicas.get('tipoCabelloId').getRawValue() == null &&
      this.otroTipoCabello == null
    ) {
      this.toastService.warning(this.T['perfil.tipoCabelloId'], {
        position: 'bottom-center',
      });
      return false;
    }

    if (
      this.formFisicas.get('etniaId').getRawValue() == null &&
      this.otroGrupoRacial == null
    ) {
      this.toastService.warning(this.T['perfil.etniaId'], {
        position: 'bottom-center',
      });
      return false;
    }
    if (this.agenciaId) {
      console.log(!this.formContacto.get('email').valid);
      if (!this.formContacto.get('email').valid) {
        return false;
      }
    }

    return true;
  }

  salvaPersona() {
    if (!this.docsOK()) {
      this.toastService.warning(this.T['perfil.documentos-incompletos'], {
        position: 'bottom-center',
      });
      return;
    }

    if (
      !this.datosListaValidos() ||
      !this.formGenerales.valid ||
      !this.formFisicas.valid ||
      !this.formVestuario.valid
    ) {
      this.validarCampos();
      this.toastService.warning(this.T['perfil.datos-incorrectos'], {
        position: 'bottom-center',
      });

      return;
    }

    const p = this.FormaAPersona();
    p.datosCompletos = true;
    this.inCall = true;
    this.spinner.show('spperfil');
    if (this.esUpdate) {
      this.apiPersona
        .personaPut(p.id, p)
        .pipe(first())
        .subscribe(
          (r) => {
            if (!this.miPerfil && this.personaId == null) {
              this.PersonaCreada.emit(p.id);
            } else {
              this.PersonaCreada.emit(null);
            }
            this.personaService.eliminaPersonaCachePurUID(p.usuarioId);
            this.toastService.success(this.T['perfil.datos-ok'], {
              position: 'bottom-center',
            });
            this.registroCompleto = p.datosCompletos;
            this.dismissible = false;
            this.inCall = false;
            if (this.miPerfil) {
              this.apiPersona.perfilusuario().subscribe((e) => {
                this.sessionService.establecePerfil(e);
              });
            }
            this.spinner.hide('spperfil');
          },
          (err) => {
            this.toastService.error(this.T['perfil.datos-error']);
          }
        );
    } else {
      this.apiPersona
        .personaPost(p)
        .pipe(first())
        .subscribe(
          (r) => {
            if (!this.miPerfil) {
              this.PersonaCreada.emit(null);
            }
            this.toastService.success(this.T['perfil.datos-ok'], {
              position: 'bottom-center',
            });
            this.registroCompleto = r.datosCompletos;
            this.dismissible = false;
            this.apiPersona.perfilusuario().subscribe((e) => {
              this.sessionService.establecePerfil(e);
            });
            this.inCall = false;
            this.spinner.hide('spperfil');
          },
          (err) => {
            this.toastService.error(this.T['perfil.datos-error'], {
              position: 'bottom-center',
            });
          }
        );
    }
  }

  validarCampos() {
    if (!this.formGenerales.valid) {
      for (const field in this.formGenerales.controls) {
        if (!this.formGenerales.controls[field].valid) {
          this.toastService.warning(this.T['perfil.' + field], {
            position: 'bottom-center',
          });
        }
      }
    }
    if (!this.formFisicas.valid) {
      for (const field in this.formFisicas.controls) {
        if (!this.formFisicas.controls[field].valid) {
          this.toastService.warning(this.T['perfil.' + field + 'Campo'], {
            position: 'bottom-center',
          });
        }
      }
    }
    if (!this.formVestuario.valid) {
      for (const field in this.formVestuario.controls) {
        if (!this.formVestuario.controls[field].valid) {
          this.toastService.warning(this.T['perfil.' + field], {
            position: 'bottom-center',
          });
        }
      }
    }
    if (this.agenciaId) {
      if (!this.formContacto.get('email').value) {
        this.toastService.warning(this.T['perfil.email'], {
          position: 'bottom-center',
        });
      }
    }
  }

  DocUploaded(docId: string) {
    this.actualizaDocumentos(docId);
  }

  EnviandoDoc(estadoEnvio: boolean) {
    this.enviadoEstado = estadoEnvio;
  }

  actualizaDocumentos(docId: string) {
    const d = this.persona.documentos.findIndex((d) => d.id == docId);
    if (d < 0) {
      this.persona.documentos.push({ id: docId, idAlmacenamiento: docId });
    }
  }

  docsOK(): boolean {
    if (this.validarDocumentos) {
      for (var i: number = 0; i < this.documentos.length; i++) {
        if (
          this.documentos[i].obligatorio &&
          this.persona.documentos.findIndex(
            (d) => d.id == this.documentos[i].id
          ) < 0
        ) {
          return false;
        }
      }
    }
    return true;
  }

  cancelar() {
    if (!this.miPerfil && !this.personaId) {
      this.apiPersona
        .personaDelete(this.persona.id)
        .pipe(first())
        .subscribe((ok) => {
          this.PersonaCreada.emit(null);
        });
    }
    {
      this.personaId = null;
      this.PersonaCreada.emit(null);
    }
  }
  pageTitleContent = [
    {
      title: 'Mi Perfil',
      backgroundImage: 'assets/img/page-title/page-title2-d.jpg',
    },
  ];

  //AUX
  onClosed(dismissedAlert: any): void {
    this.dismissible = false;
  }
  pageTitleContent = [
    {
      title: 'Mi Perfil',
      backgroundImage: 'assets/img/page-title/page-title2-d.jpg',
    },
  ];

  //AUX
  onClosed(dismissedAlert: any): void {
    this.dismissible = false;
  }
}
