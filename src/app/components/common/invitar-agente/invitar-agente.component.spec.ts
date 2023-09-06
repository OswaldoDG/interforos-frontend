import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitarAgenteComponent } from './invitar-agente.component';

describe('InvitarAgenteComponent', () => {
  let component: InvitarAgenteComponent;
  let fixture: ComponentFixture<InvitarAgenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvitarAgenteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvitarAgenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
