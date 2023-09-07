import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';
import { PersonaClient, RegistroClient, TipoRolCliente } from 'src/app/services/api/api-promodel';
import { SessionQuery } from 'src/app/state/session.query';

@Component({
  selector: 'app-invitar-modelo',
  templateUrl: './invitar-modelo.component.html',
  styleUrls: ['./invitar-modelo.component.scss']
})
export class InvitarModeloComponent implements OnInit {
  @Input () persona;
  mensajeDefault : string = null;
  formModelos : FormGroup;
  T: any[];
  valido : boolean = false;
  nombreUsuario : string;
  constructor(private fb : FormBuilder,
              private registro : RegistroClient,
              private translate: TranslateService,
              private toastService: HotToastService,
              private servicio : SessionQuery,
              private apiPersona : PersonaClient) {

                this.formModelos = this.fb.group({
                  correos: ['', Validators.required],
                  mensaje: ['',]
                  });

   }

  ngOnInit(): void {
    this.translate
    .get([
      'invitar-modelo.mensaje',
      'invitar-modelo.invalido-correos',
      'invitar-modelo.error-envio',
      'invitar-modelo.confirmacion-enviadas',
    ])
    .subscribe((trads) => {
      this.T = trads;
      this.formModelos
      .get('mensaje')
      .setValue(this.T['invitar-modelo.mensaje']);
    });


  }

  enviarInvitaciones(){
    const lista = this.formModelos.value.correos.split("\n").join("").trim();
    var express = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
    const lista2 = lista.split(/\s+/).join('');
    const lista3 = lista2.split(",");
    for(var i = 0; i < lista3.length ; i++){
      var x = express.test(lista3[i]);
      if(x == true){
        this.valido = true;
      }else{
        this.valido = false;
        break;
      }
    }

    if(this.valido == true){

      lista3.forEach(e=>{
        const usuarioAgencia = {
          email : e,
          nombre : e,
          rol : TipoRolCliente.Modelo,
          mensaje: this.formModelos.value.mensaje.trim() === '' ? this.T['invitar-modelo.mensaje'] : this.formModelos.value.mensaje,
          mensajeDe : this.persona.nombre
        }
        this.registro.registroPost(usuarioAgencia).subscribe((data) => {
          this.toastService.success(this.T['invitar-modelo.confirmacion-enviadas'], { position: 'bottom-center'});
        },(err) => {this.toastService.error(this.T['invitar-modelo.error-envio'], { position: 'bottom-center'}); });
      });
    }else{
      this.toastService.error(this.T['invitar-modelo.invalido-correos'], { position: 'bottom-center'});

    }
  }

}
