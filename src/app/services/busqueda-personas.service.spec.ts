import { TestBed } from '@angular/core/testing';

import { BusquedaPersonasService } from './busqueda-personas.service';

describe('BusquedaPersonasService', () => {
  let service: BusquedaPersonasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusquedaPersonasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
