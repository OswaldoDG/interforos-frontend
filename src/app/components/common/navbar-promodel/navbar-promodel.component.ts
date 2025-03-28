import { PersistState, isEmpty } from '@datorama/akita';
import { Component, ElementRef, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { first, takeUntil } from 'rxjs/operators';
import {
  AccesoClient,
  ClienteView,
  HttpCode,
  InformacionPerfil,
  PersonaClient,
  RegistroClient,
  TipoRolCliente,
} from 'src/app/services/api/api-promodel';
import { SessionQuery } from 'src/app/state/session.query';
import { SessionService } from 'src/app/state/session.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Title } from '@angular/platform-browser';
import { ClienteViewVacio } from 'src/app/modelos/entidades-vacias';
import { ModalCambiarPasswordComponent } from '../modal-cambiar-password/modal-cambiar-password.component';
import { ReCaptchaV3Service, RecaptchaErrorParameters } from 'ng-recaptcha';
@Component({
  selector: 'app-navbar-promodel',
  templateUrl: './navbar-promodel.component.html',
  styleUrls: ['./navbar-promodel.component.scss'],
})
export class NavbarPromodelComponent implements OnInit {
  @ViewChild('closemodal') closemodal;
  //Modal
  @ViewChild(ModalCambiarPasswordComponent) componenteModal;
  private destroy$ = new Subject();
  cliente: ClienteView = ClienteViewVacio();
  token: string | undefined;
  auntenticado: boolean = false;
  modelo: boolean = false;
  admin: boolean = false;
  staff: boolean = false;
  revisor: boolean = false;
  agencia:boolean=false;
  mobile: boolean = false;
  userName: string = '';
  showPass: boolean = false;
  T: any[];
  inCall: boolean = false;
  autenticado: boolean = false;
  documentosCompletos : boolean = false;
  existeEmail: boolean = false;
  private getScreenWidth: any;
  private getScreenHeight: any;
  swapShowPass() {
    this.showPass = !this.showPass;
  }

  registroForm: FormGroup = this.fb.group({
    email: ['', [Validators.email, Validators.required]],
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    recaptchaReactive: new FormControl(null, Validators.required),
    rol: ['Modelo'],
  });

  loginForm: FormGroup = this.fb.group({
    usuario: ['', [Validators.email, Validators.required]],
    contrasena: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    @Inject('persistStorage') private persistStorage: PersistState[],
    private titleService: Title,
    private bks: BreakpointObserver,
    private router: Router,
    private query: SessionQuery,
    private session: SessionService,
    private registro: RegistroClient,
    private acceso: AccesoClient,
    private persona: PersonaClient,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private translate: TranslateService,
    private toastService: HotToastService,
    private recaptchaV3Service: ReCaptchaV3Service,
  ) {
    this.token = undefined;
  }

  ngOnInit(): void {
    this.translate
      .get([
        'navbar.registro-creado',
        'navbar.datos-incorrectos-login',
        'navbar.login-incorrecto',
        'solicitud.solicitud-enviada',
        'solicitud.solicitud-conflicto',
        'solicitud.solicitud-cambio-contrasenia',
        'solicitud.solicitud-cambio-contrasenia-error',
      ])
      .subscribe((trads) => {
        this.T = trads;
      });

    this.bks
      .observe(['(min-width: 500px)'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.mobile = false;
        } else {
          this.mobile = true;
        }
      });

    this.query.autenticado$.pipe(takeUntil(this.destroy$)).subscribe((u) => {
      this.autenticado = u;
    });

    this.query.cliente$.pipe(takeUntil(this.destroy$)).subscribe((cl) => {
      this.titleService.setTitle(cl.nombre);
      this.cliente = cl;
    });

    this.query.perfil$.pipe(takeUntil(this.destroy$)).subscribe((p) => {
      if (p != null && p != undefined) {
        if (p.roles) {
          this.admin = p.roles.indexOf(TipoRolCliente.Administrador) >= 0;
          this.staff = p.roles.indexOf(TipoRolCliente.Staff) >= 0;
          this.modelo = p.roles.indexOf(TipoRolCliente.Modelo) >= 0;
          this.revisor = p.roles.indexOf(TipoRolCliente.RevisorExterno) >= 0;
          this.agencia = p.roles.indexOf(TipoRolCliente.Agencia) >= 0;
        }
        this.userName = p.alias;
      }
    });
    if(this.query.autenticado)
      {
        this.documentosCompletos = this.query.getValue().perfil.datosCompletos;
      }

      this.getScreenWidth = window.innerWidth;
      this.getScreenHeight = window.innerHeight;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    let element = document.getElementsByClassName('grecaptcha-badge');
    element[0].setAttribute('id', 'grecaptcha_badge');
    document.getElementById('grecaptcha_badge').style.display = 'none';
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
  }

  permitirVer():boolean{
    if(this.getScreenWidth<= 1199){
      return false;
    }

    return true;
  }

  switchLanguage(languageCode: string): void {
    this.translate.use(languageCode);
    this.session.actualizaIdioma(languageCode);
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

  runLogin(running: boolean) {
    this.inCall = running;
    if (running) {
      this.spinner.show('splogin');
      this.loginForm.disable();
    } else {
      this.spinner.hide('splogin');
      this.loginForm.enable();
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
          this.closemodal.nativeElement.click();
        },
        (err) => {
          console.log(err);
          this.runRegistro(false);
        }
      );
  }

  logout() {
    this.persistStorage.forEach((s) => {
      s.clearStore();
    });
    this.router.navigateByUrl('/').then(() => {
      window.location.reload();
    });
  }

  login() {
    if (!this.loginForm.valid) {
      this.toastService.warning(this.T['navbar.datos-incorrectos-login'], {
        position: 'bottom-center',
      });
      return;
    }
    this.runLogin(true);
    this.acceso
      .login({
        usuario: this.loginForm.get('usuario').getRawValue(),
        contrasena: this.loginForm.get('contrasena').getRawValue(),
      })
      .pipe(first())
      .subscribe(
        (r) => {
          this.closemodal.nativeElement.click();
          this.session.loginExitoso(r);
          this.persona
            .perfilusuario()
            .pipe(first())
            .subscribe(
              (u) => {
                this.userName = u.alias;
                this.session.establecePerfil(u);
                if (u.requirePerfil == true) {
                  if (u.roles.indexOf(TipoRolCliente.RevisorExterno) >= 0) {
                    this.router.navigateByUrl('/staff');
                  if (u.tienePerfil) {
                    if (u.roles.indexOf(TipoRolCliente.Staff) >= 0) {
                      this.router.navigateByUrl('/staff');
                    } else {
                      this.router.navigateByUrl('/model');
                    }
                  } else {
                    this.router.navigateByUrl('/perfil');
                  }
                } else {
                  if (u.roles.indexOf(TipoRolCliente.RevisorExterno) >= 0) {

                    this.router.navigateByUrl('/staff');

                  }
                  if (u.roles.indexOf(TipoRolCliente.Staff) >= 0) {
                    this.router.navigateByUrl('/revisor');
                  } else {
                    this.router.navigateByUrl('/model');
                  }
                 }
                }else{
                  this.navegarRutaRol();
                }
                this.runLogin(false);
              },
              (err) => {
                this.userName = this.loginForm.get('usuario').getRawValue();
                console.error(err);
              }
            );
        },
        (err) => {
          this.toastService.warning(this.T['navbar.login-incorrecto'], {
            position: 'bottom-center',
          });
          this.runLogin(false);
        }
      );
  }

  navegarRutaRol(){
    this.query.getValue().perfil.roles.forEach(e=>{
      if(e == TipoRolCliente.Administrador || e == TipoRolCliente.Staff || e == TipoRolCliente.RevisorExterno){
        this.router.navigateByUrl('/castings');
      }else{
        this.router.navigateByUrl('/agencia');
      }
    });
  }
  public solicitudPassword() {
    if (this.loginForm.value.usuario != '') {
      this.acceso
        .passwordPost(this.loginForm.value.usuario)
        .subscribe((data) => {
          if (data.ok == true) {
            this.toastService.success(this.T['solicitud.solicitud-enviada'], {
              position: 'bottom-center',
            });
          } else {
            this.toastService.error(this.T['solicitud.solicitud-conflicto'], {
              position: 'bottom-center',
            });
          }
        });
      this.existeEmail = false;
    } else {
      this.existeEmail = true;
    }
  }

  //confirma  el remover un comentario
  confirmar() {
    this.componenteModal.openModal(this.componenteModal.myTemplate);
  }

  navegarRutas(){
    this.router.navigateByUrl('/staff');
  }

  // Auxiliares UI
  recibidoDelModal(r: string) {
    if (r == 'Y') {
      this.toastService.success(
        this.T['solicitud.solicitud-cambio-contrasenia'],
        {
          position: 'bottom-center',
        }
      );
    } else {
      if (r == 'E0') {
        this.toastService.error(
          this.T['solicitud.solicitud-cambio-contrasenia-error'],
          {
            position: 'bottom-center',
          }
        );
      }
    }
  }

}
