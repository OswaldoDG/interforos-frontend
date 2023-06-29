import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentoPersonaComponent } from './documento-persona.component';

describe('DocumentoPersonaComponent', () => {
  let component: DocumentoPersonaComponent;
  let fixture: ComponentFixture<DocumentoPersonaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentoPersonaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentoPersonaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
