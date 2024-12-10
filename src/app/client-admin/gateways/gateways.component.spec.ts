import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewaysComponent } from './gateways.component';

describe('GatewaysComponent', () => {
  let component: GatewaysComponent;
  let fixture: ComponentFixture<GatewaysComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GatewaysComponent]
    });
    fixture = TestBed.createComponent(GatewaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
