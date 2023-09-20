import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import {
  CastingStaffServiceService,
  MapeoVoto,
} from 'src/app/services/casting-staff-service.service';
import {
  CastingClient,
  TipoRolCliente,
  VotoModeloMapeo,
} from 'src/app/services/api/api-promodel';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SessionQuery } from 'src/app/state/session.query';

@Component({
  selector: 'app-voto-modelo-component',
  templateUrl: './voto-modelo-component.component.html',
  styleUrls: ['./voto-modelo-component.component.scss'],
})
export class VotoModeloComponentComponent implements OnInit {
  @Input() personaId: string = null;
  activoNo: boolean = false;
  activoNoSe: boolean = false;
  activoSi: boolean = false;
  activoMucho: boolean = false;
  totalNo: number = 0;
  totalNoSe: number = 0;
  totalSi: number = 0;
  totalMucho: number = 0;

  //Variable donde se van a almacenar los votos traidos desde el servicio
  public votoMap: VotoModeloMapeo[] = [];
  //Variable que almacenará el like
  public likeRevisor: string = null;

  //Variable donde se mapean el nivel de like y el usaurio que realizó la votación
  mapeoVotos: MapeoVoto[] = [];
  modalRef?: BsModalRef;
  esRevisor: boolean = false;
  nombreModelo: string;
  constructor(
    private servicio: CastingStaffServiceService,
    private castingService: CastingClient,
    private modalService: BsModalService,
    private session: SessionQuery
  ) {}

  ngOnInit(): void {
    this.esRevisor =
      this.session.GetRoles.toLowerCase() ==
      TipoRolCliente.RevisorExterno.toLocaleLowerCase();
    this.nombreModelo = this.servicio.getNombreModelo();
    if (this.esRevisor) {
      this.voto();
    }

    this.totales();
    this.servicio.CategoriaSub().subscribe((c) => {
      if (c) {
        this.voto();
      }
    });
    this.servicio.CategoriaSub().subscribe((c) => {
      if (c) {
        this.servicio.CalcularTotalesSub().subscribe((c) => {
          if (c) {
            this.totales();
          }
        });
      }
    });
  }

  voto() {
    this.activoNo = false;
    this.activoNoSe = false;
    this.activoSi = false;
    this.activoMucho = false;
    if (this.servicio.personaEnCategoria(this.personaId) >= 0) {
      this.votoMap = this.servicio.traerVotosModelo(this.personaId);
      var indexP = this.votoMap.findIndex(
        (c) => c.usuarioId == this.servicio.getUserId()
      );
      if (indexP >= 0) {
        var nivelLike = this.votoMap[indexP].nivelLike;
        this.pintarVoto(nivelLike);
      }
    }
  }

  agregarVoto(nivelLike: string) {
    if (this.servicio.personaEnCategoria(this.personaId) >= 0) {
      const casting = this.servicio.CastingIdActual();
      const categoria = this.servicio.CategoriActual();
      const persona = this.personaId;
      this.castingService
        .like(casting, categoria, persona, nivelLike)
        .subscribe((v) => {
          this.servicio.agregarVoto(v, this.personaId);
          this.voto();
        });
    }
  }

  pintarVoto(nivelLike: number) {
    if (this.servicio.personaEnCategoria(this.personaId) >= 0) {
      this.activoNo = nivelLike == 0;
      this.activoNoSe = nivelLike == 1;
      this.activoSi = nivelLike == 2;
      this.activoMucho = nivelLike == 3;
    }
  }

  votar(nivel: number) {
    this.pintarVoto(nivel);
    this.agregarVoto(nivel.toString());
  }

  modalResumenVotos(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  totales() {
    if (this.servicio.personaEnCategoria(this.personaId) >= 0) {
      this.votoMap = this.servicio.traerVotosModelo(this.personaId);
      const totales = {
        No: 0,
        Nose: 0,
        Si: 0,
        Mucho: 0,
      };
      this.votoMap.forEach((voto) => {
        const nivelLike = voto.nivelLike;
        switch (nivelLike) {
          case 0:
            totales.No++;
            break;
          case 1:
            totales.Nose++;
            break;
          case 2:
            totales.Si++;
            break;
          case 3:
            totales.Mucho++;
            break;
        }
      });
      this.totalNo = totales.No;
      this.totalNoSe = totales.Nose;
      this.totalSi = totales.Si;
      this.totalMucho = totales.Mucho;
    }
  }
}
