import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaEditorCastingComponent } from './pagina-editor-casting.component';

describe('PaginaEditorCastingComponent', () => {
  let component: PaginaEditorCastingComponent;
  let fixture: ComponentFixture<PaginaEditorCastingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaginaEditorCastingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginaEditorCastingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
