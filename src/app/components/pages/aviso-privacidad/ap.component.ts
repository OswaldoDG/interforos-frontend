import {
  Component,
  EventEmitter,
  InjectionToken,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ClienteViewVacio } from 'src/app/modelos/entidades-vacias';
import { ClienteView } from 'src/app/services/api/api-promodel';
import { SessionQuery } from 'src/app/state/session.query';


export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');

@Component({
  selector: 'app-ap-component',
  templateUrl: './ap.html',
  styleUrls: ['./ap-component.scss'],
})
export class APComponent implements OnInit {
  private destroy$ = new Subject();
  autenticado: boolean = false;
  idiomaActual = '';
  tituloActual: any = null;

  contenidoActual: any[] = [];

  sectionTitle = [
      {
          title: 'Términos, aviso y privacidad',
          i: 'es-mx'
      },
      {
          title: 'Terms, notice and privacy',
          i: 'en-us'
      }
  ]

howItWorksSections = [
    {
        icon: 'flaticon-support',
        title: 'Información que es recogida',
        i: 'es-mx',
        content: `<p>Nuestro sitio web podrá recoger información personal por ejemplo: Nombre, información de contacto como su dirección de correo electrónico e información demográfica. Así mismo cuando sea necesario podrá ser requerida información específica para procesar algún pedido o realizar una entrega o facturación.</p>`
    },
    {
        icon: 'flaticon-project',
        title: 'Uso de la información recogida',
        i: 'es-mx',
        content: `<p>Nuestro sitio web emplea la información con el fin de proporcionar el mejor servicio posible, particularmente para mantener un registro de usuarios, de pedidos en caso que aplique, y mejorar nuestros productos y servicios. Es posible que sean enviados correos electrónicos periódicamente a través de nuestro sitio con ofertas especiales, nuevos productos y otra información publicitaria que consideremos relevante para usted o que pueda brindarle algún beneficio, estos correos electrónicos serán enviados a la dirección que usted proporcione y podrán ser cancelados en cualquier momento.</p><p>Interforos está altamente comprometido para cumplir con el compromiso de mantener su información segura. Usamos los sistemas más avanzados y los actualizamos constantemente para asegurarnos que no exista ningún acceso no autorizado.</p>`
    },
    {
        icon: 'flaticon-attorney',
        title: 'Control de su información personal',
        i: 'es-mx',
        content: `<p>En cualquier momento usted puede restringir la recopilación o el uso de la información personal que es proporcionada a nuestro sitio web. Cada vez que se le solicite rellenar un formulario, como el de alta de usuario, puede marcar o desmarcar la opción de recibir información por correo electrónico. En caso de que haya marcado la opción de recibir nuestro boletín o publicidad usted puede cancelarla en cualquier momento.</p><p>Esta compañía no venderá, cederá ni distribuirá la información personal que es recopilada sin su consentimiento, salvo que sea requerido por un juez con un orden judicial.</p><p>Interforos se reserva el derecho de cambiar los términos de la presente Política de Privacidad en cualquier momento.</p>`
    },
    {
        icon: 'flaticon-www',
        title: 'Cookies',
        i: 'es-mx',
        content: `<p>Una cookie se refiere a un fichero que es enviado con la finalidad de solicitar permiso para almacenarse en su ordenador, al aceptar dicho fichero se crea y la cookie sirve entonces para tener información respecto al tráfico web, y también facilita las futuras visitas recurrentes. Otra función que tienen las cookies es que con ellas las webs pueden reconocerte individualmente y por tanto brindarte el mejor servicio personalizado de su web.</p><p>Nuestro sitio web emplea las cookies para poder identificar las páginas que son visitadas y su frecuencia. Esta información es empleada únicamente para análisis estadístico y después la información se elimina de forma permanente. Usted puede eliminar las cookies en cualquier momento desde su ordenador. Sin embargo las cookies ayudan a proporcionar un mejor servicio de los sitios web, estas no dan acceso a información de su ordenador ni de usted, a menos de que usted así lo quiera y la proporcione directamente.</p>`
    },
    {
        icon: 'flaticon-share',
        title: 'Enlaces a Terceros',
        i: 'es-mx',
        content: `<p>Este sitio web pudiera contener enlaces a otros sitios que pudieran ser de su interés. Una vez que usted dé clic en estos enlaces y abandone nuestra página, ya no tenemos control sobre el sitio al que es redirigido y por lo tanto no somos responsables de los términos, privacidad ni de la protección de sus datos en esos otros sitios terceros. Dichos sitios están sujetos a sus propias políticas de privacidad por lo cual es recomendable que los consulte para confirmar que usted está de acuerdo con estas.</p>`
    },
    {
        icon: 'flaticon-support',
        title: 'Information That is Collected',
        i: 'en-us',
        content: `<p>Our website may collect personal information such as Name, contact information like your email address, and demographic information. Likewise, when necessary, specific information may be required to process an order or to carry out a delivery or billing.</p>`
    },
    {
        icon: 'flaticon-project',
        title: 'Use of the Collected Information',
        i: 'en-us',
        content: `<p>We use the information in order to provide the best possible service, particularly to maintain a record of users, of orders (if applicable), and to improve our products and services. Periodic emails may be sent through our site with special offers, new products and other advertising information that we deem relevant for you or that may offer you a benefit. These emails will be sent to the address you provide and may be canceled at any time.</p><p>Interforos is deeply committed to fulfilling its promise of keeping your information secure. We use the most advanced systems and regularly update them to ensure there is no unauthorized access.</p>`
    },
    {
        icon: 'flaticon-attorney',
        title: 'Control Over Your Personal Information',
        i: 'en-us',
        content: `<p>At any time you may restrict the collection or use of the personal information provided to our website. Whenever you are asked to complete a form, such as during user registration, you may check or uncheck the option to receive information by email. If you have previously marked the option to receive our newsletter or advertising, you may cancel it at any time.</p><p>This company will not sell, assign, or distribute the personal information collected without your consent, unless required by a judge with a court order.</p><p>Interforos reserves the right to change the terms of this Privacy Policy at any time.</p>`
    },
    {
        icon: 'flaticon-www',
        title: 'Cookies',
        i: 'en-us',
        content: `<p>A cookie refers to a small file that is sent to ask for permission to be stored on your computer. Once accepted, the cookie is created and helps provide information about web traffic, and it also facilitates future recurrent visits. Another function of cookies is that websites can use them to recognize you individually and therefore offer you a more personalized service.</p><p>Our website uses cookies to identify which pages are visited and how often. This information is used only for statistical analysis and is then permanently deleted. You may delete cookies at any time from your computer. However, cookies help deliver a better web service; they do not provide access to your computer or personal information unless you choose to provide it.</p>`
    },
    {
        icon: 'flaticon-share',
        title: 'Third-Party Links',
        i: 'en-us',
        content: `<p>This website may contain links to other sites that might be of interest to you. Once you click on these links and leave our page, we no longer have control over the site to which you are redirected and therefore are not responsible for its terms, privacy, or the protection of your data on those third‑party sites. Such sites are subject to their own privacy policies, so it is advisable to review them to ensure you agree with them.</p>`
    }
  ]
  constructor(
        private query: SessionQuery,
  ) {
  }

  ngOnInit(): void {
    this.query.autenticado$.pipe(takeUntil(this.destroy$)).subscribe((u) => {
      this.autenticado = u;
    });
    this.query.idioma$
      .pipe(takeUntil(this.destroy$))
      .subscribe(idioma => {
        if (idioma) {
          this.idiomaActual = idioma;
          this.contenidoActual = this.howItWorksSections.filter(c => c.i === this.idiomaActual);
          this.tituloActual = this.sectionTitle.find(t => t.i === this.idiomaActual);
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}