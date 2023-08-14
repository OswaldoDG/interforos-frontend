import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {
  CastingClient,
  ComentarioCategoriaModeloCasting,
} from 'src/app/services/api/api-promodel';
import { CastingStaffServiceService } from 'src/app/services/casting-staff-service.service';
import { ModalConfirmacionComponent } from '../modal-confirmacion/modal-confirmacion.component';

@Component({
  selector: 'app-comentario-persona-casting',
  templateUrl: './comentario-persona-casting.component.html',
  styleUrls: ['./comentario-persona-casting.component.scss'],
})
export class ComentarioPersonaCastingComponent implements OnInit {
  comentariosPersona: comentarioFull[] = [];
  @Input() personaId: string = null;
  //Modal
  @ViewChild(ModalConfirmacionComponent) componenteModal;
  editar: boolean;
  formComentario: FormGroup;
  idSeleccinadoEliminar: string;
  constructor(
    private servicio: CastingStaffServiceService,
    private castingService: CastingClient,
    private fb: FormBuilder
  ) {
    this.formComentario = this.fb.group({
      texto: ['', Validators.required],
    });
    this.editar = this.servicio.GetModoTrabajo();
  }

  ngOnInit(): void {
    this.traerComentarios();
    this.servicio.CategoriaSub().subscribe((c) => {
      if (c) {
        this.traerComentarios();
      }
    });
  }

  //agregar un cometario a una categoria
  agregarComentario() {
    if (this.servicio.personaEnCategoria(this.personaId) >= 0) {
      const casting = this.servicio.CastingIdActual();
      const categoria = this.servicio.CategoriActual();
      const persona = this.personaId;
      const texto = this.formComentario.get('texto').value;
      this.castingService
        .comentarioPost(casting, categoria, persona, texto)
        .subscribe((c) => {
          this.servicio.agregarComentario(c);
          this.traerComentarios();
        });
    } else {
    }
    this.clearForm();
  }
  //remueve un comentario de una categoria
  removerComentario(comentarioId: string) {
    const casting = this.servicio.CastingIdActual();
    const categoria = this.servicio.CategoriActual();
    const persona = this.personaId;
    this.castingService
      .comentarioDelete(casting, categoria, persona, comentarioId)
      .subscribe((c) => {
        this.servicio.removerComentario(comentarioId, categoria);
        this.traerComentarios();
      });
  }
  //limpia el form
  clearForm() {
    this.formComentario.get('texto').setValue(null);
  }

  //obtine los comentarios de una persona en la categoria actual
  traerComentarios() {
    this.comentariosPersona = [];
    this.servicio
      .ComentariosCategoriaPersonaId(
        this.personaId,
        this.servicio.CategoriActual()
      )
      .forEach((c) => {
        const coment: comentarioFull = {
          comentario: c,
          emisor: this.servicio.nombreUsuarioId(c.usuarioId),
          editable: c.usuarioId == this.servicio.getUserId(),
        };
        this.comentariosPersona.push(coment);
      });
  }

  //confirma  el remover un comentario
  confirmar(comentarioId: string) {
    this.componenteModal.openModal(
      this.componenteModal.myTemplate,
      'el comentario'
    );
    this.idSeleccinadoEliminar = comentarioId;
  }
  // Auxiliares UI
  recibidoDelModal(r: string) {
    if (r == 'Y') {
      this.removerComentario(this.idSeleccinadoEliminar);
    }
    this.idSeleccinadoEliminar = '';
  }
}
interface comentarioFull {
  comentario: ComentarioCategoriaModeloCasting;
  emisor: string;
  editable: boolean;
}
