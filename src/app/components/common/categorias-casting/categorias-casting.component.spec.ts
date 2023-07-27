import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriasCastingComponent } from './categorias-casting.component';

describe('CategoriasCastingComponent', () => {
  let component: CategoriasCastingComponent;
  let fixture: ComponentFixture<CategoriasCastingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoriasCastingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriasCastingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
