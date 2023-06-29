import { TestBed } from '@angular/core/testing';

import { PersonaInfoService } from './persona-info.service';

describe('PersonaInfoService', () => {
  let service: PersonaInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersonaInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
