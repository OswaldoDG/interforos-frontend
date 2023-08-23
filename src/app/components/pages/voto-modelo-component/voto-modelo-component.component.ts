import { Component, Input, OnInit } from '@angular/core';
import { CastigReviewComponent } from '../castig-review/castig-review.component';
import { CastingStaffServiceService } from 'src/app/services/casting-staff-service.service';
import { CastingClient, VotoModeloMapeo } from 'src/app/services/api/api-promodel';


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
    this.servicio.CategoriaSub().subscribe((c) => {
      if (c) {
        this.voto();
      }
    });
  }

  voto(){
    this.activoNo  = false;
    this.activoNoSe  = false;
    this.activoSi = false;
    this.activoMucho  = false;
    if(this.servicio.personaEnCategoria(this.personaId)>=0){
      this.votoMap = this.servicio.traerVotosModelo(this.personaId);
      var indexP = this.votoMap.findIndex((c) => c.usuarioId == this.servicio.getUserId());
      if(indexP >= 0){
        var nivelLike= this.votoMap[indexP].nivelLike;
        this.pintarVoto(nivelLike);
      }
    }
  }

  agregarVoto(nivelLike : string){
    if(this.servicio.personaEnCategoria(this.personaId)>=0){
      const casting = this.servicio.CastingIdActual();
      const categoria = this.servicio.CategoriActual();
      const persona = this.personaId;
      this.castingService.like(casting,
      categoria,persona,nivelLike).subscribe((v)=>{
        this.servicio.agregarVoto(v, this.personaId);
        this.voto();
      });
    }
  }

  pintarVoto(nivelLike: number){
    if(this.servicio.personaEnCategoria(this.personaId) >= 0){
      switch(nivelLike){
        case 0:
          this.activoNo = true;
          this.activoNoSe  = false;
          this.activoSi = false;
          this.activoMucho  = false;
          break;
        case 1:
          this.activoNoSe = true;
          this.activoNo  = false;
          this.activoSi = false;
          this.activoMucho  = false;
          break;
        case 2:
          this.activoSi = true;
          this.activoNo  = false;
          this.activoNoSe  = false;
          this.activoMucho  = false;
          break;
        case 3:
          this.activoMucho = true;
          this.activoNo  = false;
          this.activoNoSe  = false;
          this.activoSi = false;
          break;
      }
    }
  }

  votar(nivel : number){
    this.pintarVoto(nivel);
    this.agregarVoto(nivel.toString());
  }


}
