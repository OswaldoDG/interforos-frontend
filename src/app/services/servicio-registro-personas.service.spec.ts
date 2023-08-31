import { TestBed } from '@angular/core/testing';

import { ServicioRegistroPersonasService } from './servicio-registro-personas.service';

describe('ServicioRegistroPersonasService', () => {
  let service: ServicioRegistroPersonasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicioRegistroPersonasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
