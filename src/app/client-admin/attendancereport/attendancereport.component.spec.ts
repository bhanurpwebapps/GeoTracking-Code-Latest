import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendancereportComponent } from './attendancereport.component';

describe('AttendancereportComponent', () => {
  let component: AttendancereportComponent;
  let fixture: ComponentFixture<AttendancereportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AttendancereportComponent]
    });
    fixture = TestBed.createComponent(AttendancereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
