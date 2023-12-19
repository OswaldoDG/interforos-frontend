import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
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
  permisosCast: PermisosCasting ={
    verRedesSociales: true,
    verTelefono: true,
    verDireccion: true,
    verEmail:  true,
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
    private ruta:Router,
    private session : SessionQuery,
  ) {
    this.rutaActiva.params.subscribe((params: Params) => {
      this.castingId = params['id'];
    });
  }
  ngOnInit(): void {
    var roles: string[] = this.session.GetRoles;
    this.servicio.PutModoTrabajo(true);
    this.castingClient.revisor(this.castingId).subscribe((c) => {
      this.casting = c;
      if(roles.indexOf(TipoRolCliente.RevisorExterno.toLocaleLowerCase()) >= 0){
        this.permisosCast = this.casting.pernisosEcternos;
      }
      this.servicio.ActualizarCasting(c);
      if (c.categorias.length > 0) {
        this.onChangeCategoria(c.categorias[0].id);
        this.hayCategorias = true;
      }else{
        this.hayCategorias = false;
      }
    });
  }
  onChangeCategoria(id: string) {
    this.servicio.ActualizarCategoria(id);
    this.modelosCategoriaActual(id);
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
          this.spinner.hide('loadCategorias');
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
  volver()
  {
    this.ruta.navigateByUrl('/castings');
  }

  excel(): void {
    this.castingClient.excel(this.castingId).subscribe(
      (blobData: Blob) => {
        this.descargarArchivo(blobData);
      },
      error => {
        console.error('Error al descargar el archivo:', error);
      }
    );
  }

  private descargarArchivo(blobData: Blob): void {
    const url = window.URL.createObjectURL(blobData);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.href = url;
    a.download = 'Casting.xlsx'; // Nombre del archivo
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}
