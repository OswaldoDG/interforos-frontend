import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComentarioPersonaCastingComponent } from './comentario-persona-casting.component';

describe('ComentarioPersonaCastingComponent', () => {
  let component: ComentarioPersonaCastingComponent;
  let fixture: ComponentFixture<ComentarioPersonaCastingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComentarioPersonaCastingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComentarioPersonaCastingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
