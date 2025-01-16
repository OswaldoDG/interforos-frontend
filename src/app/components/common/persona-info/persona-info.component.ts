import {
  Component,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

import { Persona } from 'src/app/services/api/api-promodel';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-persona-info',
  templateUrl: './persona-info.component.html',
  styleUrls: ['./persona-info.component.scss'],
})
export class PersonaInfoComponent implements OnInit, OnChanges {
  @Input() persona: Persona = null;
  mobile: boolean = false;
  avatarUrl: string = 'assets/img/avatar-404.png';
  constructor(private bks: BreakpointObserver) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.persona != null && this.persona?.elementoMedioPrincipalId) {
      this.avatarUrl = `https://apis.com/interforos/modelos/${this.persona.id}/foto/${this.persona.elementoMedioPrincipalId}-mini.png`;
    }
  }

  ngOnInit(): void {
    this.bks
      .observe(['(min-width: 500px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.mobile = false;
        } else {
          this.mobile = true;
        }
      });
  }
}
