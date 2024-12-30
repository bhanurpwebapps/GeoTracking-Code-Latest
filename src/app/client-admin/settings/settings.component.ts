import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { AreaService } from 'src/app/shared/services/area.service';
import { UserService } from 'src/app/shared/services/user.service';
import { SchoolService } from 'src/app/shared/services/school.service';
import { AuthService } from 'src/app/auth/auth.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
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
  changePasswordForm: FormGroup;
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  showHours: boolean = false;  // Control visibility of hours
  showMinutes: boolean = true;  // Control visibility of minutes
  constructor(private fb: FormBuilder, private userService: UserService, private schoolService: SchoolService,private authService:AuthService, private toastr: NotificationService) {

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

      this.changePasswordForm = this.fb.group(
        {
          currentPassword: ['', Validators.required],
          newPassword: ['', [Validators.required, Validators.minLength(6)]],
          confirmPassword: ['', Validators.required],
        },
        { validators: this.passwordMatchValidator }
      );
  }

  ngOnInit(): void {
    this.loadConfig();
  }

  // Load school configuration
  loadConfig(): void {
    const clientId = this.user.clientId;//this.schoolForm.get('clientId')?.value;
    if (clientId) {
      this.isLoading = true;
      this.schoolService.getSchoolConfig(clientId).subscribe({
        next: (data) => {
          //console.log(data);
          //this.schoolForm.patchValue(data.data);
          let configData = data.data;
          if (configData) {
            // Parse the start time string
            const startTime = configData.schoolStartAt.split(/[: ]/);
            let hours = parseInt(startTime[0], 10);
            let minutes = parseInt(startTime[1], 10);
            let period = startTime[3];

            // Convert to 24-hour format if needed
            if (period === "PM" && hours !== 12) {
              hours += 12;
            } else if (period === "AM" && hours === 12) {
              hours = 0;
            }
            this.schoolForm.controls['schoolStartAt'].setValue({ hour: hours, minute: minutes });

            // Parse the end time string
            const endTime = configData.schoolEndAt.split(/[: ]/);
            hours = parseInt(endTime[0], 10);
            minutes = parseInt(endTime[1], 10);
            period = endTime[3];

            // Convert to 24-hour format if needed
            if (period === "PM" && hours !== 12) {
              hours += 12;
            } else if (period === "AM" && hours === 12) {
              hours = 0;
            }

            this.schoolForm.controls['schoolEndAt'].setValue({ hour: hours, minute: minutes });

            this.schoolForm.controls['classroomPresenceTimeout'].setValue({ hour: 0, minute: 0, second: configData.classroomPresenceTimeout });
            this.schoolForm.controls['absenceTimeout'].setValue({ hour: 0, minute: configData.absenceTimeout, second: 0 });
            this.schoolForm.controls['lateDetectionTimeout'].setValue({ hour: 0, minute: configData.lateDetectionTimeout, second: 0 });
            this.schoolForm.controls['unauthorizedZoneTimeout'].setValue({ hour: 0, minute: configData.unauthorizedZoneTimeout, second: 0 });
            this.schoolForm.controls['sensitiveAreaTimeout'].setValue({ hour: 0, minute: configData.sensitiveAreaTimeout, second: 0 });
          }
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
      const schoolEndAt = this.formatTime(this.schoolForm.value.schoolEndAt);
      const classroomPresenceTimeout = this.schoolForm.value.classroomPresenceTimeout["second"];
      const absenceTimeout = this.schoolForm.value.absenceTimeout["minute"];
      const lateDetectionTimeout = this.schoolForm.value.lateDetectionTimeout["minute"];
      const unauthorizedZoneTimeout = this.schoolForm.value.unauthorizedZoneTimeout["minute"];
      const sensitiveAreaTimeout = this.schoolForm.value.sensitiveAreaTimeout["minute"];
      const clientId = this.user.clientId;
      let payload = {
        schoolStartAt: schoolStartAt,
        schoolEndAt: schoolEndAt,
        classroomPresenceTimeout: classroomPresenceTimeout,
        absenceTimeout: absenceTimeout,
        lateDetectionTimeout: lateDetectionTimeout,
        unauthorizedZoneTimeout: unauthorizedZoneTimeout,
        sensitiveAreaTimeout: sensitiveAreaTimeout,
        clientId: clientId
      }
      this.schoolService.upsertSchoolConfig(payload).subscribe({
        next: (response) => {
          this.successMessage = 'School configuration saved successfully.';
          this.toastr.showSuccess("School configuration saved successfully.", "Success");
          this.errorMessage = '';
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Failed to save school configuration.';
          this.toastr.showError(this.errorMessage, "Error");
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

  // Custom validator to check if passwords match
  passwordMatchValidator(control: AbstractControl) {
    const newPassword = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (newPassword !== confirmPassword) {
      control.get('confirmPassword')?.setErrors({ mismatch: true });
    } else {
      control.get('confirmPassword')?.setErrors(null);
    }
  }


  // Form Submit Handler
  onFormSubmit() {
    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched(); // Show validation errors
      return;
    }

    const { currentPassword, newPassword, confirmPassword } =
      this.changePasswordForm.value;

    console.log('Form Data:', { currentPassword, newPassword, confirmPassword });

    // Call your service to update the password
    // Example:
    this.authService.changePassword({ username:this.user.username,oldPassword:currentPassword, newPassword:newPassword })
      .subscribe(response => {
        console.log('Password Updated Successfully:', response);
        this.toastr.showSuccess("Password Updated Successfully.", "Success");
      }, error => {
        console.error('Password Update Failed:', error);
        this.toastr.showError(error, "Error");
      });
  }

}
