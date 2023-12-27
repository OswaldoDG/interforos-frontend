export interface ElementoMediaView {
    id?: string | undefined;
    extension?: string | undefined;
    mimeType?: string | undefined;
    imagen?: boolean;
    video?: boolean;
    principal?: boolean;
    landscape?: boolean;
    permanente?: boolean;
    url?:string;
    urlFull?:string;
    titulo?:string;
    castingId?:string;
}
