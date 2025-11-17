import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Hospedaje } from './hospedaje';

describe('Hospedaje', () => {
  let component: Hospedaje;
  let fixture: ComponentFixture<Hospedaje>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Hospedaje]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Hospedaje);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
