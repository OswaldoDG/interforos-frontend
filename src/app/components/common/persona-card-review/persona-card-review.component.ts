import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import {
  API_BASE_URL,
  CastingClient,
  Persona,
} from 'src/app/services/api/api-promodel';
import { environment } from 'src/environments/environment';

import { PersonaInfoService } from 'src/app/services/persona/persona-info.service';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';
import { SessionQuery } from 'src/app/state/session.query';
import { NgxSpinnerService } from 'ngx-spinner';
import { CastingReviewService } from 'src/app/services/casting-review.service';
import '@mux/mux-player';

@Component({
  selector: 'app-persona-card-review',
  templateUrl: './persona-card-review.component.html',
  styleUrls: ['./persona-card-review.component.scss'],
})
export class PersonaCardReviewComponent implements OnInit {
  @Input() persona: Persona = null;
  @Output() personaEditar: EventEmitter<string> = new EventEmitter();
  @Output() personaRemover: EventEmitter<string> = new EventEmitter();
  @Output() personaCargada: EventEmitter<boolean> = new EventEmitter();
  @Output() uid: EventEmitter<string> = new EventEmitter();
  //Determina si el avatar con la imagen principal del usuario debe mostrarse
  @Input() mostrarAvatar: boolean = true;
  //Determina si la lista de habilidades debe ser mostrada
  @Input() mostrarHabilidades: boolean = true;
  //Determina si los datos de contacto deben mostrase
  @Input() mostrarContacto: boolean = true;
  //Determina si los datos generales deben mostrarse
  @Input() mostrarGenerales: boolean = true;
  //Determina si la galeria debe mostrarse
  @Input() mostrarGaleria: boolean = true;
  //Determina si se muestran los controles de Mismodelos
  @Input() mostarControlesMisModelos: boolean = false;
  //Permisos
  @Input() verRedesSociales: boolean = true;
  @Input() verTelefono: boolean = true;
  @Input() verEmail: boolean = true;
  @Input() verDireccion: boolean = true;
  @Input() verComentarios: boolean = true;
  mobile: boolean = false;
  notFoundURL: any = [
    {
      image: 'assets/img/errorMedio.jpg',
      thumbImage: 'assets/img/errorMedio.jpg',
      title: '',
    },
  ];
  avatarUrl: string = 'assets/img/errorMedio.jpg';
  videoCasting: string;
  fotoCasting: string = 'assets/img/errorMedio.jpg';
  tieneVideo: boolean = false;
  imagenes = [];
  tabHome = '';
  tabHomeBtn = '';
  mostrarBandera: boolean = false;
  configCarousel = {
    height: '250px',
    space: 1,
  };
  enCasting: boolean = null;
  T: any;
  imageObject: any = [
    {
      image: this.avatarUrl,
      thumbImage: this.avatarUrl,
      title: '',
    },
  ];
  enCategoria: boolean = null;
  usuarioFinal: string = undefined;
  apiBaseUrl: string = '';

  constructor(
    private bks: BreakpointObserver,
    private personaService: PersonaInfoService,
    private servicio: CastingReviewService,
    private castingService: CastingClient,
    private toastService: HotToastService,
    private translate: TranslateService,
    private session: SessionQuery,
    private spinner: NgxSpinnerService,
    @Inject(API_BASE_URL) baseUrl?: string
    ) {

      this.apiBaseUrl = baseUrl?? '';
    }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.persona != null) {
      this.usuarioFinal = this.persona.id;

      if (this.persona?.elementoMedioPrincipalId) {
        this.avatarUrl = `${environment.apiRoot}/contenido/${this.usuarioFinal}/${this.persona.elementoMedioPrincipalId}/thumb`;
      }
      this.traerMedios();
    }
  }

  ngOnInit(): void {
    this.spinner.show('loadMedios');
    this.castingService
      .medios(
        this.servicio.CastingIdActual(),
        this.persona.id,
        this.servicio.CategoriActual()
      )
      .subscribe(
        (medios) => {
          if (medios.videoPortadaId) {
            this.videoCasting = medios.videoPortadaId;
            this.tieneVideo = true;

          }
          if (medios.imagenPortadaId) {
            this.fotoCasting = `${this.apiBaseUrl}/contenido/bucket/modelos/${this.persona.id}/foto/${medios.imagenPortadaId}`;
            this.imageObject = [
              {
                image: `${this.fotoCasting}`,
                thumbImage: this.fotoCasting,
                title: '',
              },
            ];
            this.spinner.hide('loadMedios');
          } else {
            this.fotoCasting = this.notFoundURL;
            this.spinner.hide('loadMedios');
          }

        },
        (err) => {
          this.fotoCasting = this.notFoundURL;
          this.spinner.hide('loadMedios');
        }
      );

    this.translate.get(['buscar.categorias-error']).subscribe((ts) => {
      this.T = ts;
    });
    const nombreModelo =
      this.persona.nombre +
      ' ' +
      this.persona.apellido1 +
      ' ' +
      this.persona.apellido2;
    this.servicio.setNombreModelo(nombreModelo);
    if (
      this.verDireccion == false &&
      this.verEmail == false &&
      this.verTelefono == false &&
      this.verRedesSociales == false
    ) {
      this.mostrarContacto = false;
    }
  }
  traerMedios() {
    this.personaService
      .obtieneMediosPErsona(this.usuarioFinal)
      .subscribe((m) => {
        m.elementos.forEach((e) => {
          if (e.imagen) {
            this.imagenes.push({
              image: `${environment.apiRoot}/contenido/${m.usuarioId}/${e.id}/full`,
              thumbImage: `${environment.apiRoot}/contenido/${m.usuarioId}/${e.id}/card`,
            });
          } else {
            if (e.video) {
              this.imagenes.push({
                video: `https://drive.google.com/uc?export=download&id=${e.id}`,
                posterImage: `${environment.apiRoot}/contenido/${m.usuarioId}/${e.frameVideoId}/thumb`,
              });
            }
          }
        });
        this.personaCargada.emit(false);
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
