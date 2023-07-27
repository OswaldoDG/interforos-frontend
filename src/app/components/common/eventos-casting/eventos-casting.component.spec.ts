import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventosCastingComponent } from './eventos-casting.component';

describe('EventosCastingComponent', () => {
  let component: EventosCastingComponent;
  let fixture: ComponentFixture<EventosCastingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventosCastingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventosCastingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
