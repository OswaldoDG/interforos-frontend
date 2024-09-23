import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PersistState } from '@datorama/akita';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import {
  Consentimiento,
  InvitacionRegistro,
  RegistroClient,
  TipoRolCliente,
} from 'src/app/services/api/api-promodel';
import { CustomValidators } from 'src/app/services/custom-validators';
import { SessionQuery } from 'src/app/state/session.query';
import { SessionService } from 'src/app/state/session.service';

@Component({
  selector: 'app-confirmacion',
  templateUrl: './confirmacion.component.html',
  styleUrls: ['./confirmacion.component.scss'],
})
export class ConfirmacionComponent implements OnInit {
  activada: boolean = false;
  confirmando: boolean = true;
  confirmacionValida: boolean = false;
  id: string;
  T: any;
  invitacion: InvitacionRegistro = { registro: { nombre: '', email: '' } };
  LlamarBackend = true;
  inCall: boolean = false;
  showPass: boolean = false;
  consentimiento: Consentimiento;
  rutaConfirmacion: string;
  logOutFlag: boolean = false;
  showError: string = '';


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
      nombreUsuario: ['', Validators.required],
    },
    {
      // check whether our password and confirm password match
      validator: CustomValidators.passwordMatchValidator,
    }
  );

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
    private sesion: SessionQuery,
    private sesionService: SessionService,
    private router: Router,
  ) { }

  ngOnInit(): void {

    this.spinner.show('spregistro');
    this.translate
      .get([
        'confirmacion.no-encontrada',
        'confirmacion.crear-invitacion',
        'confirmacion.datos-incorrectos',
        'confirmacion.cuenta-activada',
        'confirmacion.error-activada',
      ])
      .subscribe((ts) => {
        this.T = ts;
        this.errorContent[0].title = this.T['confirmacion.no-encontrada'];
        this.errorContent[0].paragraph =
          this.T['confirmacion.crear-invitacion'];
      });

    this.route.params.pipe(first()).subscribe((params) => {
      this.id = params['id'];
      this.rutaConfirmacion = '/confirmacion/' + this.id;
      if (this.sesion.UserId != undefined) {
        this.logOut(this.rutaConfirmacion);
      }
      this.validarConfirmacion(this.id);
    });
  }

  logOut(id: string) {
    this.sesionService.logOut();
    this.router.navigateByUrl(this.rutaConfirmacion).then(() => {
      window.location.reload();
    });
  }

  // Crea el registro del usuario a partir de la invitación
  creaRegistro() {
    if (!this.registroForm.valid) {
      this.toastService.info(this.T['confirmacion.datos-incorrectos'], {
        position: 'bottom-center',
      });
      return;
    }

    this.inCall = true;
    const data = {
      email: this.invitacion.registro.email,
      contrasena: this.registroForm.get('contrasena').getRawValue(),
      nombreUsuario: this.registroForm.get('nombreUsuario').getRawValue(),
    };

    this.registro
      .completar(this.invitacion.id, data)
      .pipe(first())
      .subscribe(
        (r) => {
          this.activada = true;
          this.toastService.success(this.T['confirmacion.cuenta-activada'], {
            position: 'bottom-center',
          });
          this.spinner.hide('spregistro');
          this.inCall = false;
        },
        (err) => {
          this.toastService.error(this.T['confirmacion.error-activada'], {
            position: 'bottom-center',
          });
          this.spinner.hide('spregistro');
          this.inCall = false;
        }
      );
  }

  // Varifica que el id de la invitación sea válido
  validarConfirmacion(id: string) {
    this.registro
      .registroGet(id)
      .pipe(first())
      .subscribe(
        (r) => {
          // this.registroForm.get('email').setValue(r.registro.email);
          this.invitacion = r;
          if (r.registro.rol == TipoRolCliente.Modelo) {
            this.consentimiento = this.sesion.GetConsentimientoModelo;
          } else {
            this.consentimiento = this.sesion.GetConsentimientoAgencia;
          }
          this.confirmacionValida = true;
          this.confirmando = false;
          this.spinner.hide('spregistro');

        },
        (err) => {
          this.confirmando = false;
          this.confirmacionValida = false;
          this.spinner.hide('spregistro');
          this.showError = 'show';
        }
      );
  }


  pageTitleContent = [
    {
      title: 'confirmacion.titulo',
      backgroundImage: 'assets/img/page-title/page-title2-d.jpg',
      error: 'confirmacion.error'
    },
  ];
}
