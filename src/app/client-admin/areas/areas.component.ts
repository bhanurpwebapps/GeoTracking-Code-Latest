import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { AreaService } from 'src/app/shared/services/area.service';
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
  query: string = ''; // The search query entered by the user
  errorMessage: string = ''; // To store error messages
  areaForm: FormGroup;
  area: any;
  user:any;
  hasAreas:boolean=true;
  constructor(private modalService: NgbModal,private fb: FormBuilder,private areaService:AreaService,private userService:UserService){ 

    this.userService.user$.subscribe((user) => {
      this.user = user.user; // Update user info dynamically
    });
    // Initialize the form
    this.areaForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      type:['', [Validators.required]],
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
  };

  ngOnInit(): void {

    this.loadAreaEnums();
    this.loadAreas(this.user.clientId);
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

  ViewDataForEdit(user:any,modalcontent:any)
  {
      this.areaForm.controls["name"].setValue(user.name);
      this.areaForm.controls["type"].setValue(user.type);
      this.areaForm.controls["areaStatus"].setValue(user.status=="Active"?true:false);
      this.modalReference = this.modalService.open(modalcontent, {
        size: 'lg',
      });
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
      const areaStatus =  this.areaForm.controls["areaStatus"].value?'Active':'InActive';
      const clientId =  this.user.clientId;
      const newUser = {
        "name": name,
        "type":type,
        "status": areaStatus,
        "clientId":clientId
      };
  
      this.areaService.createArea(newUser).subscribe(
        (response) => {
          this.areaForm.reset();
          modal.close();
          console.log('User created:', response);
          this.loadAreas(this.user.clientId); // Refresh the list
        },
        (error) => {
          console.error('Error creating Area:', error);
        }
      );
      
    } else {
      this.areaForm.markAllAsTouched(); // Highlight validation errors
    }
  }
  
}
