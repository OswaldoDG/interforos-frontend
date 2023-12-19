import { Component, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  CastingClient,
  PermisosCasting,
  Persona,
  PersonaClient,
  SelectorCastingCategoria,
  SelectorCategoria,
  TipoRolCliente,
} from 'src/app/services/api/api-promodel';
import { CastingStaffServiceService } from 'src/app/services/casting-staff-service.service';
import { SessionQuery } from 'src/app/state/session.query';

@Component({
  selector: 'app-castig-review',
  templateUrl: './castig-review.component.html',
  styleUrls: ['./castig-review.component.scss'],
  providers: [CastingStaffServiceService],
})
export class CastigReviewComponent implements OnInit {
  castingId: string = null;
  casting: SelectorCastingCategoria;
  modelos: Persona[] = [];
  personasDesplegables = [];
  categorias: SelectorCategoria[] = [];
  dVertical: boolean = false;
  tBusqueda: boolean = false;
  hayCategorias : boolean = false;
  estadoPersona : boolean = true;
  puedeAgregarModelo: boolean = true;
  T: any;
  CategoriaActual: string = '';
  formAgregarModelo: FormGroup;
  permisosCast: PermisosCasting = {
    verRedesSociales: true,
    verTelefono: true,
    verDireccion: true,
    verEmail: true,
    verHabilidades: true,
    verDatosGenerales: true,
    verGaleriaPersonal: true,
    verComentarios: true,
  };
  constructor(
    private rutaActiva: ActivatedRoute,
    private castingClient: CastingClient,
    private servicio: CastingStaffServiceService,
    private personaClient: PersonaClient,
    private spinner: NgxSpinnerService,
    private ruta: Router,
    private session: SessionQuery,
    private fb: FormBuilder,
    private translate: TranslateService,
    private toastService: HotToastService
  ) {
    this.rutaActiva.params.subscribe((params: Params) => {
      this.castingId = params['id'];
    });
    this.formAgregarModelo = this.fb.group({
      consecutivo: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.translate
      .get(['modelo.error-modelo', 'modelo.modelo'])
      .subscribe((ts) => {
        this.T = ts;
      });
    var roles: string[] = this.session.GetRoles;
    this.servicio.PutModoTrabajo(true);
    this.spinner.show('loadCategorias');
    this.castingClient.revisor(this.castingId).subscribe((c) => {
      this.casting = c;
      this.categorias = c.categorias;
      if (
        roles.indexOf(TipoRolCliente.RevisorExterno.toLocaleLowerCase()) >= 0
      ) {
        this.permisosCast = this.casting.pernisosEcternos;
        this.puedeAgregarModelo = false;
      }
      this.servicio.ActualizarCasting(c);
      if (c.categorias.length > 0) {
        this.hayCategorias = true;
      } else {
        this.hayCategorias = false;
      }
      this.spinner.hide('loadCategorias');
    });
  }
  onChangeCategoria(id: string) {
    this.servicio.ActualizarCategoria(id);
    this.modelosCategoriaActual(id);
    this.CategoriaActual = id;
  }

  public modelosCategoriaActual(id: string) {
    this.spinner.show('loadCategorias');
    const modelos: Persona[] = [];
    var indexC = this.casting.categorias.findIndex((c) => c.id == id);
    if (this.casting.categorias[indexC].modelos.length > 0) {
      this.casting.categorias[indexC].modelos.forEach((m) => {
        this.personaClient.idGet(m).subscribe((p) => {
          if (p) {
            modelos.push(p);
          }
          this.procesaPersonas(modelos);
          if(this.estadoPersona == false){
            this.spinner.hide('loadCategorias');
          }
        });
      });
    } else {
      this.personasDesplegables = [];
      this.spinner.hide('loadCategorias');
    }
  }

  procesaPersonas(personas: any) {
    this.servicio.obtieneCatalogoCliente().subscribe((done) => {
      if (personas != null) {
        const tmp: Persona[] = [];
        personas.forEach((p) => {
          tmp.push(this.servicio.PersonaDesplegable(p));
        });
        this.personasDesplegables = tmp;
      }
    });
  }
  volver() {
    this.ruta.navigateByUrl('/castings');
  }

  personaCargadaEvnt(r : boolean){
    this.estadoPersona = r;
  }
  
  agregarModelo() {
    this.spinner.show('loadCategorias');
    this.castingClient
      .consecutivo(
        this.castingId,
        this.formAgregarModelo.get('consecutivo').value,
        this.servicio.CategoriActual()
      )
      .subscribe(
        (data) => {
          this.castingClient.revisor(this.castingId).subscribe((c) => {
            this.casting = c;
            this.servicio.ActualizarCasting(c);
            if (c.categorias.length > 0) {
              this.onChangeCategoria(this.servicio.CategoriActual());
              this.hayCategorias = true;
            } else {
              this.hayCategorias = false;
            }
            this.toastService.success(this.T['modelo.modelo'], {
              position: 'bottom-center',
            });
          });
        },
        (err) => {
          this.spinner.hide('loadCategorias');
          this.toastService.error(this.T['modelo.error-modelo'], {
            position: 'bottom-center',
          });
        }
      );
    this.formAgregarModelo.get('consecutivo').setValue(null);
  }
}
