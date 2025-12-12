import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerificarComprobante } from './verificar-comprobante';

describe('VerificarComprobante', () => {
  let component: VerificarComprobante;
  let fixture: ComponentFixture<VerificarComprobante>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerificarComprobante]
    }).compileComponents();

    fixture = TestBed.createComponent(VerificarComprobante);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
