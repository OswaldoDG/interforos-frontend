import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import { AccesoClient, PersonaClient, TipoRolCliente } from 'src/app/services/api/api-promodel';
import { SessionQuery } from 'src/app/state/session.query';
import { SessionService } from 'src/app/state/session.service';

@Component({
  selector: 'app-pagina-login',
  templateUrl: './pagina-login.component.html',
  styleUrls: ['./pagina-login.component.scss']
})
export class PaginaLoginComponent implements OnInit {
  T: any[];
  inCall: boolean = false;
  userName: string = '';
  existeEmail: boolean = false;
  modoRestablecerContrasena = false;
  modoLogin = true;
  showPass: boolean = false;
  loginForm: FormGroup = this.fb.group({
    usuario: ['', [Validators.email, Validators.required]],
    contrasena: ['', [Validators.required, Validators.minLength(6)]],
  });

  restableceForm : FormGroup = this.fb.group({
    email: ['', [Validators.email, Validators.required]]
  });

  constructor(
        private fb: FormBuilder,
        private translate: TranslateService,
        private toastService: HotToastService,
        private acceso: AccesoClient,
        private session: SessionService,
        private persona: PersonaClient,
        private router: Router,
        private query: SessionQuery,
        private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.translate
    .get([
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
  }

  swapShowPass() {
    this.showPass = !this.showPass;
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

  restablecerPassword(){
    this.modoRestablecerContrasena = true;
    this.modoLogin = false;
  }

  modLogin(){
    this.modoRestablecerContrasena = false;
    this.modoLogin = true;
  }

  solicitudPassword() {
    if (this.restableceForm.value.email != '') {
      this.runLogin(true);
      this.acceso
        .passwordPost(this.restableceForm.value.email)
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
          this.runLogin(false);
        },(err) => {
          this.toastService.error(this.T['solicitud.solicitud-conflicto'], {
            position: 'bottom-center',
          });
          this.runLogin(false);
        });
      this.existeEmail = false;
    } else {
      this.existeEmail = true;
    }
  }




  pageTitleContent = [
    {
      title: 'pagina-login.pagina-login-titulo',
      backgroundImage: 'assets/img/page-title/page-title2-d.jpg',
      error: 'confirmacion.error'
    },
  ];

  pageTitleContentRestablece = [
    {
      title: 'pagina-login.pagina-login-restablece',
      backgroundImage: 'assets/img/page-title/page-title2-d.jpg',
      error: 'confirmacion.error'
    },
  ];

}
