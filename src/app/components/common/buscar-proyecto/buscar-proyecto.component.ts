import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BuscarProyectoDTO } from 'src/app/modelos/locales/buscar-proyecto-dto';
import { SessionQuery } from 'src/app/state/session.query';
import { SessionService } from 'src/app/state/session.service';

@Component({
  selector: 'app-buscar-proyecto',
  templateUrl: './buscar-proyecto.component.html',
  styleUrls: ['./buscar-proyecto.component.scss'],
})
export class BuscarProyectoComponent implements OnInit {
  @Output() Query: EventEmitter<BuscarProyectoDTO> = new EventEmitter();

  inCall: boolean = false;

  constructor(
    private fb: FormBuilder,
    private sessionService: SessionService,
    private session: SessionQuery
  ) {}

  formBuscar: FormGroup = this.fb.group({
    nombre: [null],
    fechaApertura: [null],
    fechaCierre: [null],
    activo: [true],
  });

  ngOnInit(): void {}

  buscar() {}
}
