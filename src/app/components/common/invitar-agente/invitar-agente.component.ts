import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import { CatalogoBase, ElementoCatalogo, PersonaClient, RegistroClient, TipoRolCliente } from 'src/app/services/api/api-promodel';

@Component({
  selector: 'app-invitar-agente',
  templateUrl: './invitar-agente.component.html',
  styleUrls: ['./invitar-agente.component.scss']
})

export class InvitarAgenteComponent implements OnInit {

  private catalogos: CatalogoBase[] = [];
  agenciaSeleccionada : ElementoCatalogo;
  agencias : ElementoCatalogo[];
  formAgenciasInvitacion : FormGroup;
  formAgenciasActualiza : FormGroup;
  formAgenciasRegistro : FormGroup;
  valido : boolean = false;
  selectAgencia : boolean = false;
  cambiosAdmin : any;
  T: any[];

  constructor(private formBuilder : FormBuilder,
              private apiPersona : PersonaClient,
              private registro : RegistroClient,
              private translate: TranslateService,
              private toastService: HotToastService,
              private spinner: NgxSpinnerService) {
    this.formAgenciasInvitacion = this.formBuilder.group({
      agencia: ['', Validators.required],
      correos: ['', Validators.required],
    });
    this.formAgenciasActualiza = this.formBuilder.group({
      agenciaActualiza: ['', Validators.required],
      nombreActualiza: ['', Validators.required]
    });
    this.formAgenciasRegistro = this.formBuilder.group({
      nombreRegistro: ['', Validators.required]
    });
   }

  ngOnInit(): void {
    this.obtieniendoCatalogos();
    this.translate
    .get([
      'invitar-agente.invitar-correos-novalidos',
      'invitar-agente.invitar-correos-enviados',
      'invitar-agente.invitar-correos-error',
      'crea-actualiza-agente.actualiza-agencia-exito',
      'crea-actualiza-agente.registro-agencia-exito'
    ])
    .subscribe((trads) => {
      this.T = trads;
    });

    this.formAgenciasActualiza.get('agenciaActualiza')?.valueChanges.subscribe((a)  =>{
      this.agenciaSeleccionada = this.agencias.find(x => x.texto ==a);
      if(a){
        this.formAgenciasActualiza.patchValue({
          nombreActualiza: a
        });
      }else{
        this.formAgenciasActualiza.patchValue({
          nombreActualiza:''
        });
      }
    });

  }

  obtieniendoCatalogos(){
    this.spinner.show('spinner-invitaciones');
    this.apiPersona.perfil().pipe(first()).subscribe((cs) =>
      {
        this.catalogos = cs
        this.obtenerAgencias();
        this.formAgenciasActualiza.get('agenciaActualiza').setValue('');
        this.formAgenciasInvitacion.get('agenciaActualiza').setValue('');
      });
    this.spinner.hide('spinner-invitaciones');
  }

  obtenerAgencias(){
    this.agencias = this.catalogos.find((x) => x.tipoPropiedad == 'agencias').elementos;
  }

  registraAgencia(){
    this.spinner.show('spinner-invitaciones');
    if(this.formAgenciasRegistro.value.nombreRegistro != null || this.formAgenciasRegistro.value.nombreRegistro != undefined){
      this.apiPersona.inserta(this.formAgenciasRegistro.value.nombreRegistro).subscribe((e) => {
        this.spinner.hide('spinner-invitaciones');
        this.obtieniendoCatalogos();
        this.toastService.success(this.T['crea-actualiza-agente.registro-agencia-exito'], { position: 'bottom-center'});
      },(err) => {
        this.spinner.hide('spinner-invitaciones');
        this.toastService.error(this.T['invitar-agente.invitar-correos-error'], { position: 'bottom-center'});
      });
    }else{
      this.spinner.hide('spinner-invitaciones');
    }
    this.agenciaSeleccionada = undefined;
  }

  actualizaAgencia(){
    this.spinner.show('spinner-invitaciones');
    if(this.agenciaSeleccionada != null || this.agenciaSeleccionada != undefined){
      this.apiPersona.actualiza(this.formAgenciasActualiza.value.nombreActualiza, this.agenciaSeleccionada.clave).subscribe((e =>{
        this.spinner.hide('spinner-invitaciones');
        this.obtieniendoCatalogos();
        this.toastService.success(this.T['crea-actualiza-agente.actualiza-agencia-exito'], { position: 'bottom-center'});
      }),(err) => {
        this.spinner.hide('spinner-invitaciones');
        this.toastService.error(this.T['invitar-agente.invitar-correos-error'], { position: 'bottom-center'});
      });
    }else{
      this.spinner.hide('spinner-invitaciones');
    }
    this.agenciaSeleccionada = undefined;
  }



  enviarInvitaciones(){
    this.spinner.show('spinner-invitaciones');
    const lista = this.formAgenciasInvitacion.value.correos.split("\n").join("").trim();
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
        const agenciaId = this.agencias.find(e => e.texto == this.formAgenciasInvitacion.value.agencia);
        const usuarioAgencia = {
          email : e,
          nombre : e,
          rol : TipoRolCliente.Agencia,
          agenciaId: agenciaId.clave
        }
        this.registro.registroPost(usuarioAgencia).subscribe((data) => {
          this.spinner.hide('spinner-invitaciones');
          this.formAgenciasInvitacion.get('correos').setValue('');
          this.toastService.success(this.T['invitar-agente.invitar-correos-enviados'], { position: 'bottom-center'});
        },(err) => {
          this.spinner.hide('spinner-invitaciones');
          this.toastService.error(this.T['invitar-agente.invitar-correos-error'], { position: 'bottom-center'});
        });
      });
    }else{
      this.spinner.hide('spinner-invitaciones');

      this.toastService.error(this.T['invitar-agente.invitar-correos-novalidos'], { position: 'bottom-center'});
    }
  }
}
