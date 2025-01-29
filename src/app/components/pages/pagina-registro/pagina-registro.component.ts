import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import { RegistroClient } from 'src/app/services/api/api-promodel';

@Component({
  selector: 'app-pagina-registro',
  templateUrl: './pagina-registro.component.html',
  styleUrls: ['./pagina-registro.component.scss']
})
export class PaginaRegistroComponent implements OnInit {
  T: any;
  inCall: boolean = false;


  registroForm: FormGroup = this.fb.group({
    email: ['', [Validators.email, Validators.required]],
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    recaptchaReactive: new FormControl(null, Validators.required),
    rol: ['Modelo'],
  });

  constructor(
    private translate: TranslateService,
    private toastService: HotToastService,
    private registro: RegistroClient,
    private recaptchaV3Service: ReCaptchaV3Service,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder

  ) {




   }



  ngOnInit(): void {
    this.translate
    .get([
      'navbar.registro-creado',
      'solicitud.solicitud-enviada',
      'solicitud.solicitud-conflicto',
      'solicitud.solicitud-cambio-contrasenia',
      'solicitud.solicitud-cambio-contrasenia-error',
    ])
    .subscribe((trads) => {
      this.T = trads;
    });
  }

  runRegistro(running: boolean) {
    this.inCall = running;
    if (running) {
      this.spinner.show('spregistro');
      this.registroForm.disable();
    } else {
      this.spinner.hide('spregistro');
      this.registroForm.enable();
    }
  }

  public send() {
    this.recaptchaV3Service.execute('myAction').subscribe(
      (token) => {
        if (token) {
          this.creaRegistro();
        }
      },
      (error) => {
        this.toastService.error('ERROR reCAPTCHA', {
          position: 'bottom-center',
        });
      }
    );
  }

  creaRegistro() {
    this.runRegistro(true);
    this.registro
      .registroPost(this.registroForm.getRawValue())
      .pipe(first())
      .subscribe(
        (r) => {
          this.toastService.info(this.T['navbar.registro-creado'], {
            position: 'bottom-center',
          });
          this.runRegistro(false);
        },
        (err) => {
          console.log(err);
          this.runRegistro(false);
        }
      );
  }



  pageTitleContent = [
    {
      title: 'pagina-registro.pagina-registro-titulo',
      backgroundImage: 'assets/img/page-title/page-title2-d.jpg',
      error: 'confirmacion.error'
    },
  ];

}
