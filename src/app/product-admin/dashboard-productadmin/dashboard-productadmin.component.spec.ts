import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardProductadminComponent } from './dashboard-productadmin.component';

describe('DashboardProductadminComponent', () => {
  let component: DashboardProductadminComponent;
  let fixture: ComponentFixture<DashboardProductadminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardProductadminComponent]
    });
    fixture = TestBed.createComponent(DashboardProductadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
