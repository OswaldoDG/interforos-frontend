import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';
import {
  ImageCroppedEvent,
} from 'ngx-image-cropper';
import {
  PerfilPublicoUsuario,
  PersonaClient,
} from 'src/app/services/api/api-promodel';
import { SessionQuery } from 'src/app/state/session.query';

@Component({
  selector: 'app-perfil-colaborador',
  templateUrl: './perfil-colaborador.component.html',
  styleUrls: ['./perfil-colaborador.component.scss'],
})
export class PerfilColaboradorComponent implements OnInit {
  perfilPublico: PerfilPublicoUsuario;
  isImageLoading: boolean = false;
  avatar: string;
  formPerfil: FormGroup;
  T: any[];
  imgChangeEvt: any = '';

  constructor(
    private sesion: SessionQuery,
    private personaClient: PersonaClient,
    private fb: FormBuilder,
    private translate: TranslateService,
    private toastService: HotToastService
  ) {
    this.formPerfil = this.fb.group({
      nombre: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.translate
      .get([
        'perfil.colaborador-datos-no-guardados',
        'perfil.colaborador-datos-guardados',
      ])
      .subscribe((trads) => {
        this.T = trads;
      });
    this.traerPerfil();
  }
  //trae los datos del usuario ne sesion
  traerPerfil() {
    this.personaClient
      .perfilpublicoGet(this.sesion.UserId)
      .subscribe((data) => {
        if (data != null) {
          this.perfilPublico = data;
          this.avatar = data.avatar;
          this.formPerfil.get('nombre').setValue(this.perfilPublico.nombre);
        } else {
        }
      });
  }
  //actualiza los datos del usuario en sesion
  guardar() {
    if (this.isImageLoading || this.formPerfil.dirty) {
      this.perfilPublico.nombre = this.formPerfil.get('nombre').value;
      this.perfilPublico.avatar = this.avatar;
      this.personaClient.perfilpublicoPost(this.perfilPublico).subscribe(
        (data) => {
          this.toastService.warning(
            this.T['perfil.colaborador-datos-guardados'],
            {
              position: 'bottom-center',
            }
          );
          this.isImageLoading = false;
        },
        (error) => {
          this.toastService.warning(
            this.T['perfil.colaborador-datos-no-guardados'],
            {
              position: 'bottom-center',
            }
          );
        }
      );
    }
  }

  cancel() {
    this.avatar = this.perfilPublico.avatar;
    this.isImageLoading = false;
  }

  onFileChange(event: any): void {
    this.isImageLoading = true;
    this.imgChangeEvt = event;
  }
  cropImg(e: ImageCroppedEvent) {
    const reader = new FileReader();
    reader.readAsDataURL(e.blob);
    reader.onload = () => {
      this.avatar = reader.result.toString();
      this.isImageLoading = true;
    };
  }
}
