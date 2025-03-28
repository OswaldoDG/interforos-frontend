import { Component } from '@angular/core';
import { TranslateService} from "@ngx-translate/core";
import { SessionService } from 'src/app/state/session.service';
import { SessionQuery } from 'src/app/state/session.query';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.scss'],
})
export class LanguageSwitcherComponent {
  languages = [
    { code: 'es-mx', name: 'Español', flag: '🇪🇸', icon: 'mx-flag.png' },
    { code: 'en-us', name: 'English', flag: 'en', icon: 'uk-flag.png' }
  ];

  currentLanguage = 'es-mx';

  constructor(private session: SessionService, private sQuery: SessionQuery, private translate: TranslateService) {
    const savedLanguage = sQuery.Idioma;
    console.log(savedLanguage);
    if (savedLanguage) {
      this.currentLanguage = savedLanguage;
    }
  }

  switchLanguage(languageCode: string): void {
    this.currentLanguage = languageCode;
    this.translate.use(languageCode);
    this.session.actualizaIdioma(languageCode);
  }

  getFlag(languageCode: string): string {
    const language = this.languages.find((lang) => lang.code === languageCode.toLocaleLowerCase());
    return language ? language.flag : '';
  }

  getFlagIcon(languageCode: string): string {
    languageCode = languageCode.toLowerCase();
    if(languageCode) {
      const language = this.languages.find((lang) => lang.code === languageCode);
      return language ? '/assets/img/' + language.icon : '/assets/img/' + language.icon;
    } else {
      return '/assets/img/empty-flag.png';
    }
  }
}