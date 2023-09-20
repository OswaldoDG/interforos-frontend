import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';

import { Casting, CastingClient, CastingListElement, EstadoCasting, TipoRolCliente } from 'src/app/services/api/api-promodel';
import { SessionQuery } from 'src/app/state/session.query';
import { ModalEliminarCastingComponent } from '../modal-eliminar-casting/modal-eliminar-casting.component';

@Component({
  selector: 'app-casting-card-component',
  templateUrl: './casting-card-component.component.html',
  styleUrls: ['./casting-card-component.component.scss']
})
export class CastingCardComponentComponent implements OnInit {
  @Input() Casting : any;
  @Output() refrescarCast = new EventEmitter();
  urlImage : string;
  valoresdisponibles:any;
  T: any;
  estadoCasting : any;
  nuevoEstado: any;
  esStaff : boolean;
  esRevisor : boolean;
  esAdmin: boolean;
 disable:boolean=true;
  //Modal
  @ViewChild( ModalEliminarCastingComponent) componenteModal;
  constructor(private clientApi: CastingClient,
    private translate: TranslateService,
    private toastService: HotToastService,
    private servicio : SessionQuery,
    private ruta: Router) {

  }

  ngOnInit(): void {
    this.translate
      .get([
        'proyectos.casting-estado-ok',
        'proyectos.casting-estado-error',
        'proyectos.casting-estado-EnEdicion',
        'proyectos.casting-estado-Abierto',
        'proyectos.casting-estado-Cerrado',
        'proyectos.casting-estado-Cancelado',
        'proyectos.succes-mensaje-eliminacion',
        'proyectos.error-mensaje-eliminacion',
      ]).subscribe((ts) => {
        this.T = ts;
        this.estadoCasting = this.T['proyectos.casting-estado-' + this.Casting.status];

      });

    this.clientApi.logoGet(this.Casting.id).subscribe((data) => {
      this.urlImage = data;
    });
    this.clientApi.id(this.Casting.id).subscribe((data) => {
      var buscarUsuario = data.contactos.find(e => e.usuarioId == this.servicio.UserId);
      if(buscarUsuario != undefined){
        this.validarRol(buscarUsuario);
      }
    });
  }

  validarRol(usuario : any){
    if(usuario.rol == TipoRolCliente.Staff || usuario.rol == TipoRolCliente.Administrador){
      this.esStaff = true;
      this.esAdmin = true;
      this.esRevisor = false;
    }else if(usuario.rol == TipoRolCliente.RevisorExterno){
      this.esRevisor = true;
      this.esStaff = false;
      this.esAdmin = false;
    }
  }

    // Auxiliares UI
    recibidoDelModal(r : string){
      if(r == 'Y'){
        this.clientApi.castingDelete(this.Casting.id).subscribe((e)=>{
          this.refrescarCast.emit('Y');
          this.toastService.success(this.T['proyectos.succes-mensaje-eliminacion'], {
            position: 'bottom-center',
          });
        },(err) => {this.toastService.error(this.T['proyectos.error-mensaje-eliminacion'], { position: 'bottom-center'}); });
      }
    }

    confirmar() {
      this.componenteModal.openModal(this.componenteModal.myTemplate, this.Casting.nombre);
    }

  refrescarCasting(){
    this.clientApi.id(this.Casting.id).subscribe((e)=>{
      const mapeo : CastingListElement ={
        id : e.id,
        nombre : e.nombre,
        nombreCliente : e.nombreCliente,
        fechaApertura: e.fechaApertura,
        fechaCierre : e.fechaCierre,
        status : e.status,
        aceptaAutoInscripcion : e.aceptaAutoInscripcion,
        activo : e.activo,
        aperturaAutomatica : e.aperturaAutomatica,
        cierreAutomatico : e.cierreAutomatico,
        rol : this.Casting.rol
      }

      this.Casting = mapeo;
      console.log(this.Casting);
    });
  }

  cambiarEstado()
  {

    switch(this.valoresdisponibles){
      case this.T['proyectos.casting-estado-EnEdicion']:
        this.valoresdisponibles = EstadoCasting.EnEdicion;
        break;
      case this.T['proyectos.casting-estado-Abierto']:
        this.valoresdisponibles = EstadoCasting.Abierto;
        break;
      case this.T['proyectos.casting-estado-Cerrado']:
        this.valoresdisponibles = EstadoCasting.Cerrado;
        break;
      case this.T['proyectos.casting-estado-Cancelado']:
        this.valoresdisponibles = EstadoCasting.Cancelado;
        break;
    }
    this.clientApi.estadocasting(this.Casting.id,this.valoresdisponibles).subscribe((e) => {
      this.clientApi.id(this.Casting.id).subscribe((e) => {
        this.estadoCasting = this.T['proyectos.casting-estado-' + e.status];
      });
    });
  }

  editarCasting(){
    this.ruta.navigateByUrl('castings/' + this.Casting.id);
  }
  btnActivar()
  {
    this.disable=false;
  }

  colaborar(){}
}
