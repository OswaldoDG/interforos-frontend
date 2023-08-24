import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Route, Router } from '@angular/router';

@Component({
  selector: 'app-pagina-editor-casting',
  templateUrl: './pagina-editor-casting.component.html',
  styleUrls: ['./pagina-editor-casting.component.scss'],
})
export class PaginaEditorCastingComponent implements OnInit {
  id: string;
  CastingId: string = null;
  constructor(private rutaActiva: ActivatedRoute, private ruta: Router) {
    // Verificar si viene parametreo id y si existe establece la propiedad this.CastingId
    this.rutaActiva.params.subscribe((params: Params) => {
      this.id = params['id'];
    });

    if (this.id != null) {
      this.CastingId = this.id;
    }
  }
  regresar() {
    this.ruta.navigateByUrl('/castings');
  }

  ngOnInit(): void {}
}
