import {
  Component,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

import { API_BASE_URL, Persona } from 'src/app/services/api/api-promodel';
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
  apiBaseUrl: string = '';

  constructor(private bks: BreakpointObserver, @Inject(API_BASE_URL) baseUrl?: string) {
    this.apiBaseUrl = baseUrl ?? '';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.persona != null && this.persona?.elementoMedioPrincipalId) {
      this.avatarUrl = `${this.apiBaseUrl}/contenido/bucket/modelos/${this.persona.id}/foto/${this.persona.elementoMedioPrincipalId}-mini.png`;
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

  IGUsername(input : string): string | null{
    if (input.startsWith("https://www.instagram.com/")) {
      const instagramRegex = /https:\/\/(?:www\.)?instagram\.com\/([^\/]+)/;
      const match = input.match(instagramRegex);
      if (match && match[1]) {
        return match[1];
      }
    }else if(input.startsWith("instagram.com/")) {
      const instagramSimpleRegex = /instagram\.com\/([^\/]+)/;
      const match = input.match(instagramSimpleRegex);
      if (match && match[1]) {
        return match[1];
      }
    }else if(input.startsWith("@")) {
      const atSymbolRegex = /@([a-zA-Z0-9_]+)/;
      const match = input.match(atSymbolRegex);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  }

  INUsername(input : string): string | null{
    const regex = /https:\/\/(?:[a-zA-Z0-9\-]+\.)?linkedin\.com\/in\/([^\/]+)/;
    const match = input.match(regex);

    if (match && match[1]) {
      return match[1];
    }

    return null;
  }

  XUsername(input : string): string | null{
    if (input.startsWith("https://www.twitter.com/") || input.startsWith("https://x.com/")) {
      const twitterRegex = /https:\/\/(?:www\.)?twitter\.com|x\.com\/([^\/\?]+)/;
      const match = input.match(twitterRegex);
      if (match && match[1]) {
        return match[1];
      }
    }else if (input.startsWith("twitter.com/") || input.startsWith("x.com/")) {
      const twitterSimpleRegex = /(?:twitter\.com|x\.com)\/([^\/\?]+)/;
      const match = input.match(twitterSimpleRegex);
      if (match && match[1]) {
        return match[1];
      }
    }else if (input.startsWith("@")) {
      const atSymbolRegex = /@([a-zA-Z0-9_]+)/;
      const match = input.match(atSymbolRegex);
      if (match && match[1]) {
        return match[1]; 
      }
    }

    return null;
  }

  FBUsername(input : string): string | null{
    if (input.startsWith("https://www.facebook.com/")) {
      const facebookRegex = /https:\/\/www\.facebook\.com\/([^\/\?]+)/;
      const match = input.match(facebookRegex);
      if (match && match[1]) {
        return match[1];
      }

      const facebookShareRegex = /https:\/\/www\.facebook\.com\/share\/([^\/]+)/;
      const match2 = input.match(facebookShareRegex);
      if (match2 && match2[1]) {
        return match2[1];
      }
      
      const profileIdRegex = /https:\/\/www\.facebook\.com\/profile\.php\?id=(\d+)/;
      const match3 = input.match(profileIdRegex);
    
      if (match3 && match3[1]) {
        return match3[1];
      }

    }else if (input.startsWith("facebook.com/")) {
      const facebookSimpleRegex = /facebook\.com\/([^\/\?]+)/;
      const match = input.match(facebookSimpleRegex);
      if (match && match[1]) {
        console.log(match[1]);
        return match[1];
      }
    }

    return null;
  }


}
