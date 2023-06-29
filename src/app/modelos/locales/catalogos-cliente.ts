import { CatalogoBase } from "src/app/services/api/api-promodel";

export interface CatalogosCliente {
    url: string;
    catalogos: CatalogoBase[];
    fecha: Date; 
}