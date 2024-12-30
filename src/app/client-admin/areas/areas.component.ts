import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { AreaService } from 'src/app/shared/services/area.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UserService } from 'src/app/shared/services/user.service';
@Component({
  selector: 'app-areas',
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.css']
})
export class AreasComponent {
  modalReference: any = '';
  areas: any[] = [];
  enums: string[] = [];
  users: any[] = [];
  query: string = ''; // The search query entered by the user
  errorMessage: string = ''; // To store error messages
  areaForm: FormGroup;
  area: any;
  user:any;
  hasAreas:boolean=true;
  selectedUsers:any;
  isClassRoom:boolean=false;
  constructor(private modalService: NgbModal,private fb: FormBuilder,private areaService:AreaService,private userService:UserService, private toastr: NotificationService){ 

    this.userService.user$.subscribe((user) => {
      this.user = user.user; // Update user info dynamically
    });
    // Initialize the form
    this.areaForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      type:['', [Validators.required]],
      users:['', [Validators.required]],
      areaStatus:[true]
    });

  }

  // Triggered when the Area types in the search field
  onKeySearch() {
    this.areaService.searchAreas(this.query,this.user.clientId).subscribe(
      (response: any) => {
        this.areas = response.areas; // Set the found areas
        this.errorMessage = ''; // Clear any previous error
        this.hasAreas  = true;
      },
      (error) => {
        this.areas = []; // Clear areas if search fails
        this.errorMessage = 'No Areas found or an error occurred.';
        this.hasAreas = false;
      }
    );
  }

  createAreasAction(content:any){
    this.modalReference = this.modalService.open(content, {
      size: 'lg',
    });
    this.modalReference.result.then(
      (result:any) => {
        // Logic to execute when modal is closed with "close"
        this.areaForm.reset(); // You can call your custom method here
        this.isClassRoom=false;
      },
      (reason:any) => {
        // Logic to execute when modal is dismissed (e.g., by clicking outside or pressing ESC)
        this.areaForm.reset(); // Call your custom dismiss method
        this.isClassRoom=false;
      }
    );
  };

  ngOnInit(): void {

    this.loadAreaEnums();
    this.loadAreas(this.user.clientId);
    this.loadUsers(this.user.clientId);
  }
  
  // Load all areas
   loadAreas(clientId:any): void {
    this.areaService.getAreas(clientId).subscribe(
      (data) => {
        this.areas = data;
        this.hasAreas = true;
        console.log(this.areas)
      },
      (error) => {
       this.areas = [];
       this.hasAreas = false;
        console.error('Error fetching areas:', error);
      }
    );
  }

  // Load clients
  loadUsers(clientId:any): void {
    this.userService.getUsers(clientId).subscribe(
      (data) => {
        this.users = data.filter((item:any)=>{return item.role==="Teacher"});
        console.log(this.users)
      },
      (error) => {
        console.error('Error fetching clients:', error);
      }
    );
  }

  ViewDataForEdit(user:any,modalcontent:any)
  {
      this.areaForm.controls["name"].setValue(user.name);
      this.areaForm.controls["type"].setValue(user.type);
      //this.areaForm.controls["users"].setValue(user.classteacher);
      this.isClassRoom=false;
    if (user.classteacher) {
      const userId = this.users.filter((item: any) => { return item._id === user.classteacher })[0]._id;
      this.selectedUsers = userId;
      this.areaForm.controls["users"].setValue(userId);
      this.isClassRoom = true;
    }
      this.areaForm.controls["areaStatus"].setValue(user.status=="Active"?true:false);
      this.modalReference = this.modalService.open(modalcontent, {
        size: 'lg',
      });
      this.modalReference.result.then(
        (result:any) => {
          // Logic to execute when modal is closed with "close"
          this.areaForm.reset(); // You can call your custom method here
        },
        (reason:any) => {
          // Logic to execute when modal is dismissed (e.g., by clicking outside or pressing ESC)
          this.areaForm.reset(); // Call your custom dismiss method
        }
      );
  }

  onAreaTypeChange(event: Event): void {
    const selectedType = (event.target as HTMLSelectElement).value;
    console.log('Selected Type:', selectedType);

    // Perform any action based on the selected value
    if (selectedType === 'Classroom') {
      this.isClassRoom = true;
    }
    else
    {
      this.isClassRoom = false;
    }

  }


  // Load enums (optional)
  loadAreaEnums(): void {
    this.areaService.getAreaEnums().subscribe(
      (data) => {
        this.enums = data;
      },
      (error) => {
        console.error('Error fetching enums:', error);
      }
    );
  }

  // This function is called when the switch is toggled
  onStatusChange(event: any,area:any) {
    const status = event ? 'Active' : 'InActive'; // Get the new status
    const areaInfo = { name: area.name,status: status ,clientId : this.user.clientId}
    this.areaService.AreaStatusChange(areaInfo).subscribe(
      (response) => {
        area.status = status;
      },
      (error) => {
        console.error('Error changing Status:', error);
      }
    );
  }
  
  onSubmit(modal:any){ 

    if (this.areaForm.valid) {
      
      const name = this.areaForm.controls["name"].value;
      const type = this.areaForm.controls["type"].value;
      const classteacher = this.areaForm.controls["users"].value;
      const areaStatus =  this.areaForm.controls["areaStatus"].value?'Active':'InActive';
      const clientId =  this.user.clientId;
      const newUser = {
        "name": name,
        "type":type,
        "classteacher":classteacher,
        "status": areaStatus,
        "clientId":clientId
      };
  
      this.areaService.createArea(newUser).subscribe(
        (response) => {
          this.areaForm.reset();
          modal.close();
          console.log('User created:', response);
          this.loadAreas(this.user.clientId); // Refresh the list
          this.toastr.showSuccess("Area Created Successfully", "Success");
        },
        (error) => {
          console.error('Error creating Area:', error);
          this.toastr.showError(error, "Error");
        }
      );
      
    } else {
      this.areaForm.markAllAsTouched(); // Highlight validation errors
    }
  }
  
}
