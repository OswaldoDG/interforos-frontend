import { ClienteView, ElementoCatalogo } from '../services/api/api-promodel';

export function ClienteViewVacio(): ClienteView {
  return {
    nombre: '',
    url: '',
    activo: true,
    webLogoBase64: '',
    mailLogoURL: '',
    contacto: {
      direccion: '',
      email: '',
      telefono: '',
      twitter: '',
      faceBook: '',
      linkedIn: '',
      instagram: '',
    },
  };
}


export function CatalogoTipoCuerpo(): ElementoCatalogo[] {
   const l: ElementoCatalogo[] = [];

   l.push( { clave: 'Bajo' } );
   l.push( { clave: 'Normal' } );
   l.push( { clave: 'Sobrepeso' } );
   l.push( { clave: 'Obeso' } );


   return l;
}