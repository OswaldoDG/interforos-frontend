import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {
  AccesoClient,
  EstablecerContrasena,
} from 'src/app/services/api/api-promodel';

@Component({
  selector: 'app-modal-cambiar-password',
  templateUrl: './modal-cambiar-password.component.html',
  styleUrls: ['./modal-cambiar-password.component.scss'],
})
export class ModalCambiarPasswordComponent implements OnInit {
  //modal
  modalRef?: BsModalRef;
  confirmacionModalEliminar?: boolean = false;
  @ViewChild('modalPass') myTemplate: TemplateRef<any>;
  @Output() modalConfirm = new EventEmitter();
  passwordForm: FormGroup;
  showPass: boolean = false;
  showPassNew: boolean = false;
  T: any[];
  estadoBoton : boolean = false;

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private accesoCliente: AccesoClient
  ) {
    this.showPass = false;

    this.passwordForm = this.fb.group(
      {
        contrasenaActual: ['', [Validators.required]],
        contrasenaNueva: ['', [Validators.required, Validators.minLength(6)]],
        contrasenaConfirmar: ['', Validators.required],
      },
      {
        validator: this.passwordMatchValidator,
      }
    );
  }

  ngOnInit(): void {}
  swapShowPass() {
    this.showPass = !this.showPass;
  }
  swapShowPassNew() {
    this.showPassNew = !this.showPassNew;
  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
    this.clearForm();
  }

  confirm(): void {
    this.estadoBoton = true;
    var data: EstablecerContrasena = {
      actual: this.passwordForm.get('contrasenaActual').value,
      nueva: this.passwordForm.get('contrasenaNueva').value,
    };
    this.accesoCliente.establecer(data).subscribe(
      (data) => {
        this.modalConfirm.emit('Y');
        this.clearForm();
        this.estadoBoton = false;
        this.modalRef?.hide();
      },
      (error) => {
        this.modalConfirm.emit(error.error);
        this.estadoBoton = false;
      }
    );
  }

  decline(): void {
    this.clearForm();
    this.modalRef?.hide();
  }
  clearForm() {
    this.passwordForm.get('contrasenaNueva').setValue('');
    this.passwordForm.get('contrasenaConfirmar').setValue('');
    this.passwordForm.get('contrasenaActual').setValue('');
  }

  public passwordMatchValidator(formGroup: FormGroup) {
    const passwordNuevo = formGroup.get('contrasenaNueva').value;
    const confirmPassword = formGroup.get('contrasenaConfirmar').value;
    if (passwordNuevo === confirmPassword) {
      return null;
    } else {
      return { mismatch: true };
    }
  }
}
