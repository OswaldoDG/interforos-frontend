import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import {
  Dimensions,
  ImageCroppedEvent,
  ImageTransform,
  LoadedImage,
  base64ToFile,
} from 'ngx-image-cropper';
import { PersonaClient } from 'src/app/services/api/api-promodel';
import { SessionQuery } from 'src/app/state/session.query';

@Component({
  selector: 'app-perfil-colaborador',
  templateUrl: './perfil-colaborador.component.html',
  styleUrls: ['./perfil-colaborador.component.scss'],
})
export class PerfilColaboradorComponent implements OnInit {
  avatar: any = '';
  avatar2: string;
  nameImg: any;
  ditry: boolean = false;
  isImageLoading: boolean = false;
  formPerfil: FormGroup;
  constructor(
    private sesion: SessionQuery,
    private personaClient: PersonaClient,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer
  ) {
    this.formPerfil = this.fb.group({
      nombre: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.traerAvatar();
  }

  //evento de input para cargar la imagen
  handleUpload(event) {
    const file = event.target.files[0];
    this.nameImg = event.target.files[0].name;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.avatar = reader.result.toString();
      this.ditry = true;
      this.isImageLoading = true;
    };
  }

  //agregar o actuliza el imagen
  actualizarDatos() {
    if (this.formPerfil.dirty) {
      console.log('actualizando datos');
    }
  }

  actualizarAvatar() {
    console.log(this.avatar2);
    if (this.ditry) {
      this.personaClient.avatarPost(this.avatar2).subscribe();
    }
    this.ditry = false;
  }

  traerAvatar() {
    this.personaClient.avatarGet(this.sesion.UserId).subscribe((data) => {
      if (data != null) {
        this.avatar = data;
        this.isImageLoading = true;
      } else {
        this.isImageLoading = false;
      }
    });
  }
  guardar() {
    this.actualizarAvatar();
  }

  imgChangeEvt: any = '';
  onFileChange(event: any): void {
    this.imgChangeEvt = event;
    this.ditry = true;
    this.isImageLoading = true;
  }
  cropImg(e: ImageCroppedEvent) {
    const reader = new FileReader();
    reader.readAsDataURL(e.blob);
    reader.onload = () => {
      this.avatar2 = reader.result.toString();
      this.ditry = true;
      this.isImageLoading = true;
    };
    this.avatar = this.sanitizer.bypassSecurityTrustUrl(e.objectUrl);
  }
  imgLoad() {
    // display cropper tool
  }
  initCropper() {
    // init cropper
  }

  imgFailed() {
    // error msg
  }
}
