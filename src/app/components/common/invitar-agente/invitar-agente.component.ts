import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs/operators';
import { CatalogoBase, PersonaClient, RegistroClient, TipoRolCliente } from 'src/app/services/api/api-promodel';

@Component({
  selector: 'app-invitar-agente',
  templateUrl: './invitar-agente.component.html',
  styleUrls: ['./invitar-agente.component.scss']
})
export class InvitarAgenteComponent implements OnInit {

  private catalogos: CatalogoBase[] = [];
  agencias : any[];
  formAgencias : FormGroup;
  valido : boolean = false;
  T: any[];
  constructor(private formBuilder : FormBuilder,
              private apiPersona : PersonaClient,
              private registro : RegistroClient,
              private translate: TranslateService,
              private toastService: HotToastService) {
    this.formAgencias = this.formBuilder.group({
      agencia: ['', Validators.required],
      correos: ['', Validators.required]
    });
   }

  ngOnInit(): void {
    this.apiPersona.perfil().pipe(first()).subscribe((cs) =>
    {
      this.catalogos = cs
      this.obtenerAgencias();
    });

    this.translate
    .get([
      'invitar-agente.invitar-correos-novalidos',
      'invitar-agente.invitar-correos-enviados',
      'invitar-agente.invitar-correos-error'
    ])
    .subscribe((trads) => {
      this.T = trads;
    });
  }

  obtenerAgencias(){
    this.agencias = this.catalogos.find((x) => x.tipoPropiedad == 'agencias').elementos;
  }

  enviarInvitaciones(){
    const lista = this.formAgencias.value.correos.split("\n").join("").trim();
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
        const agenciaId = this.agencias.find(e => e.texto == this.formAgencias.value.agencia);
        const usuarioAgencia = {
          email : e,
          nombre : e,
          rol : TipoRolCliente.Agencia,
          agenciaId: agenciaId.clave
        }
        console.log(usuarioAgencia);
        this.registro.registroPost(usuarioAgencia).subscribe((data) => {
          console.log(data);
          this.toastService.success(this.T['invitar-agente.invitar-correos-enviados'], { position: 'bottom-center'});
        },(err) => {this.toastService.error(this.T['invitar-agente.invitar-correos-error'], { position: 'bottom-center'}); });
      });
    }else{
      this.toastService.error(this.T['invitar-agente.invitar-correos-novalidos'], { position: 'bottom-center'});

    }

  }
}