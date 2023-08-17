import { Component, Input, OnInit } from '@angular/core';
import { CastigReviewComponent } from '../castig-review/castig-review.component';
import { CastingStaffServiceService } from 'src/app/services/casting-staff-service.service';
import { CastingClient, VotoModeloMapeo } from 'src/app/services/api/api-promodel';
import { VotoModeloCategoria } from 'src/app/services/api-promodel';


@Component({
  selector: 'app-voto-modelo-component',
  templateUrl: './voto-modelo-component.component.html',
  styleUrls: ['./voto-modelo-component.component.scss']
})
export class VotoModeloComponentComponent implements OnInit {
  @Input() personaId : string = null;
  activoNo: boolean = false;
  activoNoSe: boolean = false;
  activoSi: boolean = false;
  activoMucho: boolean = false;
  //Variable donde se van a almacenar los votos traidos desde el servicio
  public votoMap : VotoModeloMapeo[] = [];
  //Variable que almacenará el like
  public likeRevisor : string = null;
  constructor(private servicio: CastingStaffServiceService,
              private castingService : CastingClient) { }

  ngOnInit(): void {
    this.voto()
    this.servicio.CategoriaSub().subscribe((v) => {
      if(v){
        this.voto();
      }
    });
  }

  voto(){
    if(this.servicio.personaEnCategoria(this.personaId)>=0){
      this.votoMap = this.servicio.traerVotosModelo(this.personaId);
      var indexP = this.votoMap.findIndex((c) => c.usuarioId == this.servicio.getUserId());
      if(indexP >= 0){
        var nivelLike= this.votoMap[indexP].nivelLike;
        this.pintarVoto(nivelLike);
      }
    }else{
      this.activoNo  = false;
      this.activoNoSe  = false;
      this.activoSi = false;
      this.activoMucho  = false;
    }
  }

  agregarVoto(nivelLike : string){
    if(this.servicio.personaEnCategoria(this.personaId)>=0){
      this.castingService.like(this.servicio.CastingIdActual(),
      this.servicio.CategoriActual(),this.personaId,nivelLike).subscribe((v)=>{
        this.servicio.agregarVoto(v, this.personaId);
      });
    }
  }

  pintarVoto(nivelLike: number){
    switch(nivelLike){
      case 0:
        this.activoNo = true;
        break;
      case 1:
        this.activoNoSe = true;
        break;
      case 2:
        this.activoSi = true;
        break;
      case 3:
        this.activoMucho = true;
        break;
    }
  }

  noMeGusto(){
    this.likeRevisor = null;
    this.activoNoSe = false;
    this.activoSi = false;
    this.activoMucho = false;
    if(!this.activoNo){
      this.activoNo = true;
      this.likeRevisor = "0";
      this.agregarVoto(this.likeRevisor);
    }
  }

  noSe(){
    this.likeRevisor = null;
    this.activoNo = false;
    this.activoSi = false;
    this.activoMucho = false;
    if(!this.activoNoSe){
      this.activoNoSe = true;
      this.likeRevisor = "1";
      this.agregarVoto(this.likeRevisor);
    }
  }

  siMeGusto(){
    this.likeRevisor = null;
    this.activoNo = false;
    this.activoNoSe = false;
    this.activoMucho = false;
    if(!this.activoSi){
      this.activoSi = true;
      this.likeRevisor = "2";
      this.agregarVoto(this.likeRevisor);
    }
  }

  meGustoMucho(){
    this.likeRevisor = null;
    this.activoNo = false;
    this.activoNoSe = false;
    this.activoSi = false;
    if(!this.activoMucho){
      this.activoMucho = true;
      this.likeRevisor = "3";
      this.agregarVoto(this.likeRevisor);
    }
  }


}
