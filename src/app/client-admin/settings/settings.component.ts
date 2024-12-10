import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import {NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { AreaService } from 'src/app/shared/services/area.service';
import { UserService } from 'src/app/shared/services/user.service';
import { SchoolService } from 'src/app/shared/services/school.service';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent {
    modalReference: any = '';
    schoolStartAtTime: NgbTimeStruct = { hour: 8, minute: 0, second: 0 };
    schoolEndAtTime: NgbTimeStruct = { hour: 15, minute: 30, second: 0 };
    classroomPresenceTimeoutTime: NgbTimeStruct = { hour: 0, minute: 0, second: 10 };
    absenceTimeoutTime: NgbTimeStruct = { hour: 0, minute: 1, second: 0 };
    lateDetectionTimeoutTime: NgbTimeStruct = { hour: 0, minute: 1, second: 0 };
    unauthorizedZoneTimeoutTime: NgbTimeStruct = { hour: 0, minute: 1, second: 0 };
    sensitiveAreaTimeoutTime: NgbTimeStruct = { hour: 0, minute: 1, second: 0 };
    hourStep = 1;
    minuteStep = 1;
    secondStep = 1;
    user: any;
    schoolForm: FormGroup;
    isLoading = false;
    successMessage = '';
    errorMessage = '';
    showHours: boolean = false;  // Control visibility of hours
  showMinutes: boolean = true;  // Control visibility of minutes
  constructor(private fb: FormBuilder, private userService: UserService,private schoolService:SchoolService){

    this.userService.user$.subscribe((user) => {
      this.user = user.user; // Update user info dynamically
    });
    // Initialize the form
    this.schoolForm = this.fb.group({
      schoolStartAt: ['08:00 AM', Validators.required],
      schoolEndAt: ['03:00 PM', Validators.required],
      classroomPresenceTimeout: [10, [Validators.required, Validators.min(1)]],
      absenceTimeout: [60, [Validators.required, Validators.min(1)]],
      lateDetectionTimeout: [15, [Validators.required, Validators.min(1)]],
      unauthorizedZoneTimeout: [5, [Validators.required, Validators.min(1)]],
      sensitiveAreaTimeout: [2, [Validators.required, Validators.min(1)]],
    },
    { validators: this.startTimeAfterEndTimeValidator });
   }

   ngOnInit(): void {}

  // Load school configuration
  loadConfig(): void {
    const clientId = this.schoolForm.get('clientId')?.value;
    if (clientId) {
      this.isLoading = true;
      this.schoolService.getSchoolConfig(clientId).subscribe({
        next: (data) => {
          this.schoolForm.patchValue(data.data);
          this.successMessage = 'School configuration loaded successfully.';
          this.errorMessage = '';
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Failed to load school configuration.';
          this.successMessage = '';
        },
        complete: () => (this.isLoading = false),
      });
    }
  }

 // Method to format time into 12-hour AM/PM format
 formatTime(time: { hour: number, minute: number, second: number }): string {
  const hours = time.hour;
  const minutes = time.minute;
  const seconds = time.second;

  // Calculate AM/PM suffix
  const ampm = hours >= 12 ? 'PM' : 'AM';

  // Convert 24-hour format to 12-hour format
  let hour12 = hours % 12;
  hour12 = hour12 ? hour12 : 12;  // '0' hour should be 12 for AM/PM format

  // Format the minutes and seconds to always show two digits
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

  // Return formatted time in 'h:mm:ss AM/PM' format
  return `${hour12}:${formattedMinutes}:${formattedSeconds} ${ampm}`;
}

  // Save or update school configuration
  saveConfig(): void {
    if (this.schoolForm.valid) {
      const schoolStartAt = this.formatTime(this.schoolForm.value.schoolStartAt);
      const schoolEndAt= this.formatTime(this.schoolForm.value.schoolEndAt);
      const classroomPresenceTimeout= this.schoolForm.value.classroomPresenceTimeout["second"];
      const absenceTimeout= this.schoolForm.value.absenceTimeout["minute"];
      const lateDetectionTimeout= this.schoolForm.value.lateDetectionTimeout["minute"];
      const unauthorizedZoneTimeout= this.schoolForm.value.unauthorizedZoneTimeout["minute"];
      const sensitiveAreaTimeout= this.schoolForm.value.sensitiveAreaTimeout["minute"];
      const clientId = this.user.clientId;
      let payload = {
        schoolStartAt:schoolStartAt,
        schoolEndAt:schoolEndAt,
        classroomPresenceTimeout:classroomPresenceTimeout,
        absenceTimeout:absenceTimeout,
        lateDetectionTimeout:lateDetectionTimeout,
        unauthorizedZoneTimeout:unauthorizedZoneTimeout,
        sensitiveAreaTimeout : sensitiveAreaTimeout,
        clientId : clientId
      }
      this.schoolService.upsertSchoolConfig(payload).subscribe({
        next: (response) => {
          this.successMessage = 'School configuration saved successfully.';
          this.errorMessage = '';
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Failed to save school configuration.';
          this.successMessage = '';
        },
      });
    }
  }

  // Delete school configuration
  deleteConfig(): void {
    const clientId = this.schoolForm.get('clientId')?.value;
    if (clientId) {
      this.schoolService.deleteSchoolConfig(clientId).subscribe({
        next: (response) => {
          this.successMessage = 'School configuration deleted successfully.';
          this.errorMessage = '';
          this.schoolForm.reset();
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Failed to delete school configuration.';
          this.successMessage = '';
        },
      });
    }
  }

  // Custom Validator to check if start time is not after end time
  startTimeAfterEndTimeValidator(formGroup: FormGroup) {
    const start = formGroup.get('schoolStartAt')?.value;
    const end = formGroup.get('schoolEndAt')?.value;

    if (start && end) {
      const startTimeInMinutes = start.hour * 60 + start.minute;
      const endTimeInMinutes = end.hour * 60 + end.minute;

      if (startTimeInMinutes >= endTimeInMinutes) {
        return { startAfterEnd: true };
      }
    }
    return null;  // If validation passes, return null
  }
}
