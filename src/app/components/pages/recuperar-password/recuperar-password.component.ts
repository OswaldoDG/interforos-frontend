import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import {
  AccesoClient,
  InvitacionRegistro,
  RegistroClient,
  SolicitudSoporteUsuario,
} from 'src/app/services/api/api-promodel';
import { CustomValidators } from 'src/app/services/custom-validators';

@Component({
  selector: 'app-confirmacion',
  templateUrl: './recuperar-password.component.html',
  styleUrls: ['./recuperar-password.component.scss'],
})
export class RecuperarPasswordComponent implements OnInit {
  activada: boolean = false;
  confirmando: boolean = true;
  confirmacionValida: boolean = false;
  id: string;
  T: any;
  invitacion: SolicitudSoporteUsuario;

  inCall: boolean = false;
  showPass: boolean = false;

  swapShowPass() {
    this.showPass = !this.showPass;
  }

  registroForm: FormGroup = this.fb.group(
    {
      contrasena: [
        '',
        Validators.compose([
          Validators.required,
          CustomValidators.patternValidator(/\d/, { hasNumber: true }),
          CustomValidators.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
          CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
          CustomValidators.patternValidator(/[!@#$%^&*()_+-={};':,.<>?]/, {
            hasSpecialCharacters: true,
          }),
          Validators.minLength(6),
        ]),
      ],
      confcontrasena: ['', Validators.compose([Validators.required])],
      email: [''],
    },
    {
      // check whether our password and confirm password match
      validator: CustomValidators.passwordMatchValidator,
    }
  );

  get registroFormControl() {
    return this.registroForm.controls;
  }

  constructor(
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private registro: RegistroClient,
    private translate: TranslateService,
    private toastService: HotToastService,
    private fb: FormBuilder,
    private acceso: AccesoClient,
  ) {}

  ngOnInit(): void {
    this.spinner.show('spregistro');
    this.translate
      .get([
        'recuperacion.no-encontrada',
        'recuperacion.crear-invitacion',
        'recuperacion.datos-incorrectos',
        'recuperacion.cuenta-activada',
        'recuperacion.error-activada',
      ])
      .subscribe((ts) => {
        this.T = ts;
        this.errorContent[0].title = this.T['recuperacion.no-encontrada'];
        this.errorContent[0].paragraph =
          this.T['recuperacion.crear-invitacion'];
      });

    this.route.params.pipe(first()).subscribe((params) => {
      this.id = params['id'];
      this.validarConfirmacion(this.id);
    });
  }

  // Crea el registro del usuario a partir de la invitación
  creaRegistro() {
    if (!this.registroForm.valid) {
      this.toastService.info(this.T['recuperacion.datos-incorrectos'], {
        position: 'bottom-center',
      });
      return;
    }

    this.inCall = true;
    const data = {
      contrasena: this.registroForm.get('contrasena').getRawValue(),
    };

    this.acceso
      .id(this.id, data.contrasena)
      .pipe(first())
      .subscribe(
        (r) => {
          this.activada = true;
          this.toastService.success(this.T['recuperacion.cuenta-activada'], {
            position: 'bottom-center',
          });
          this.spinner.hide('spregistro');
          this.inCall = false;
        },
        (err) => {
          this.toastService.error(this.T['recuperacion.error-activada'], {
            position: 'bottom-center',
          });
          this.spinner.hide('spregistro');
          this.inCall = false;
        }
      );
  }

  // Varifica que el id de la invitación sea válido
  validarConfirmacion(id: string) {
    this.acceso
      .passwordGet(id)
      .pipe(first())
      .subscribe(
        (r) => {
          this.invitacion = r;
          this.confirmacionValida = true;
          this.confirmando = false;
          this.spinner.hide('spregistro');
        },
        (err) => {
          this.confirmando = false;
          this.confirmacionValida = false;
          this.spinner.hide('spregistro');
        }
      );
  }

  pageTitleContent = [
    {
      title: 'recuperacion.titulo',
      backgroundImage: 'assets/img/page-title/page-title2-d.jpg',
    },
  ];

  errorContent = [
    {
      img: 'assets/img/error.png',
      title: '',
      paragraph: '',
    },
  ];

  activadaContent = [
    {
      img: 'assets/img/error.png',
      title: '',
      paragraph: '',
    },
  ];

}
