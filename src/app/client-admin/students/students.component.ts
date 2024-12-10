import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { AreaService } from 'src/app/shared/services/area.service';
import { UserService } from 'src/app/shared/services/user.service';
import { StudentService } from 'src/app/shared/services/student.service';
@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css'],
})
export class StudentsComponent {
  modalReference: any = '';
  selectedAreas:any;
  areas: any[] = [];
  user: any;
  query: string = ''; // The search query entered by the user
  errorMessage: string = ''; // To store error messages
  studentForm: FormGroup;
  students:any[]=[];
  area:any=null;
  hasStudents:boolean=true;
  constructor(private modalService: NgbModal, private fb: FormBuilder, private areaService: AreaService, private userService: UserService,private studentService:StudentService) {
    this.userService.user$.subscribe((user) => {
      this.user = user.user; // Update user info dynamically
    });

    // Initialize the form
    this.studentForm = this.fb.group({
      studentRegistrationNo: ['', [Validators.required]],
      bleDeviceId: ['', [Validators.required, Validators.minLength(12)]],
      studentName: ['', [Validators.required]], // Numeric and optional negative
      rollNo: ['', [Validators.required]],
      classroom:['',[Validators.required]],
      address: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern('^-?[0-9]*$')]],
      email: ['', [Validators.required, , Validators.email]],
      authorizedAreas: ['', [Validators.required]],
      studentStatus: [true]
    });
  }


  createStudentAction(content: any) {
    this.modalReference = this.modalService.open(content, {
      size: 'lg',
    });
  };

  ngOnInit(): void {

    this.loadStudents(this.user.clientId,this.area);
    this.loadAreas(this.user.clientId);
  }

  // Load all areas
  loadAreas(clientId: any): void {
    this.areaService.getAreas(clientId).subscribe(
      (data) => {
        this.areas = data;
        console.log(this.areas)
      },
      (error) => {
        console.error('Error fetching areas:', error);
      }
    );
  }

   // Load all Gateways
   loadStudents(clientId: any,areaId:any): void {
    this.studentService.getStudents(clientId,areaId).subscribe(
      (data) => {
        this.students = data;
        this.hasStudents = true;
        console.log(this.students)
      },
      (error) => {
        this.students = [];
        this.hasStudents = false;
        console.error('Error fetching gateways:', error);
      }
    );
  }

  // Triggered when the Gateways types in the search field
  onKeySearch() {
    this.studentService.searchStudent(this.query,this.user.clientId,this.area).subscribe(
      (response: any) => {
        this.students = response.students; // Set the found areas
        this.hasStudents = true;
        this.errorMessage = ''; // Clear any previous error
      },
      (error) => {
       // this.areas = []; // Clear areas if search fails
        this.students=[];
        this.hasStudents=false;
        this.errorMessage = 'No Areas found or an error occurred.';
      }
    );
  }

  ViewDataForEdit(student:any,modalcontent:any)
  {
      this.studentForm.controls["studentRegistrationNo"].setValue(student.studentRegistrationNo);
      this.studentForm.controls["studentName"].setValue(student.studentName);
      this.studentForm.controls["rollNo"].setValue(student.rollNo);
      this.studentForm.controls["classroom"].setValue(student.classRoom);
      this.studentForm.controls["address"].setValue(student.address);
      this.studentForm.controls["phone"].setValue(student.contact.phone);
      this.studentForm.controls["email"].setValue(student.contact.email);
      this.studentForm.controls["bleDeviceId"].setValue(student.bleDeviceId);
      //this.studentForm.controls["authorizedAreas"].setValue(student.authorizedAreas);      
      this.selectedAreas = student.authorizedAreas.filter((item:any) =>{return item !== student.classRoom});;
      this.studentForm.controls["studentStatus"].setValue(student.status=="Active"?true:false);
      this.modalReference = this.modalService.open(modalcontent, {
        size: 'lg',
      });
  }

   // This function is called when the switch is toggled
   onStatusChange(event: any,student:any) {
    const status = event ? 'Active' : 'InActive'; // Get the new status
    const studentInfo = { studentRegistrationNo: student.studentRegistrationNo,status: status ,clientId : this.user.clientId}
    this.studentService.StudentStatusChange(studentInfo).subscribe(
      (response) => {
        student.status = status;
      },
      (error) => {
        console.error('Error changing status:', error);
      }
    );
  }

  onSelectionChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    console.log('Selected Value:', target.value);
    if(target.value!="null")
    {
    this.area = target.value;
    }
    else
    {
      this.area=null;
    }
    this.loadStudents(this.user.clientId,this.area);
    // Perform any additional logic here
  }

  onSubmit(modal:any) { 
    if (this.studentForm.valid) {
      const studentRegistrationNo = this.studentForm.controls["studentRegistrationNo"].value;
      const studentName = this.studentForm.controls["studentName"].value;
      const rollNo = this.studentForm.controls["rollNo"].value;
      const classroom = this.studentForm.controls["classroom"].value;
      const address = this.studentForm.controls["address"].value;
      const contact = {phone:this.studentForm.controls["phone"].value,email:this.studentForm.controls["email"].value};
      const bleDeviceId = this.studentForm.controls["bleDeviceId"].value;
      const authorizedAreas = this.studentForm.controls["authorizedAreas"].value;
      const status =  'Active';
      const clientId =  this.user.clientId;
      const newStudent = {
        "studentRegistrationNo": studentRegistrationNo,
        "studentName":studentName,
        "rollNo":rollNo,
        "classRoom":classroom,
        "address":address,
        "contact":contact,
        "bleDeviceId": bleDeviceId,
        "clientId":clientId,
        "authorizedAreas":authorizedAreas,
        "status":status
      };
  
      this.studentService.createStudent(newStudent).subscribe(
        (response) => {
          this.studentForm.reset();
          modal.close();
          console.log('Student created:', response);
          this.loadStudents(this.user.clientId,this.area); // Refresh the list
        },
        (error) => {
          console.error('Error creating Student:', error);
        }
      );
      
    } else {
      this.studentForm.markAllAsTouched(); // Highlight validation errors
    }
  }

}
