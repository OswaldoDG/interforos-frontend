import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilModeloComponent } from './perfil-modelo.component';

describe('PerfilModeloComponent', () => {
  let component: PerfilModeloComponent;
  let fixture: ComponentFixture<PerfilModeloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerfilModeloComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilModeloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
