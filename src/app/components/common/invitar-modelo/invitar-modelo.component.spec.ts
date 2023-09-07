import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitarModeloComponent } from './invitar-modelo.component';

describe('InvitarModeloComponent', () => {
  let component: InvitarModeloComponent;
  let fixture: ComponentFixture<InvitarModeloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvitarModeloComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvitarModeloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
