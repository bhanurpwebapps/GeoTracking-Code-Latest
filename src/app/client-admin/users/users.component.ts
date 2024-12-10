import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  modalReference: any = '';
  users: any[] = [];
  query: string = ''; // The search query entered by the user
  errorMessage: string = ''; // To store error messages
  userForm: FormGroup;
  user: any;
  constructor(private modalService: NgbModal,private fb: FormBuilder,private userService:UserService){ 
    this.userService.user$.subscribe((user) => {
      this.user = user.user; // Update user info dynamically
    });
    // Initialize the form
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      username:['', [Validators.required, Validators.minLength(8)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      userrole:['', [Validators.required]],
      userStatus:[true]
    });

  }

  // Triggered when the user types in the search field
  onKeySearch() {
    this.userService.searchUsers(this.query,this.user.clientId).subscribe(
      (response: any) => {
        this.users = response.users; // Set the found users
        this.errorMessage = ''; // Clear any previous error
      },
      (error) => {
        this.users = []; // Clear users if search fails
        this.errorMessage = 'No clients found or an error occurred.';
      }
    );
  }

  createUserAction(content:any){
    this.modalReference = this.modalService.open(content, {
      size: 'lg',
    });
  };

  ngOnInit(): void {
    this.loadUsers(this.user.clientId);
  }
  
  // Load clients
  loadUsers(clientId:any): void {
    this.userService.getUsers(clientId).subscribe(
      (data) => {
        this.users = data;
        console.log(this.users)
      },
      (error) => {
        console.error('Error fetching clients:', error);
      }
    );
  }

  ViewDataForEdit(user:any,modalcontent:any)
  {
      this.userForm.controls["name"].setValue(user.name);
      this.userForm.controls["username"].setValue(user.username);
      this.userForm.controls["email"].setValue(user.email);
      this.userForm.controls["phoneNumber"].setValue(user.contactNumber);
      this.userForm.controls["userrole"].setValue(user.role);
      this.userForm.controls["userStatus"].setValue(user.status=="Active"?true:false);
      this.modalReference = this.modalService.open(modalcontent, {
        size: 'lg',
      });
  }

  // This function is called when the switch is toggled
  onStatusChange(event: any,user:any) {
    const status = event ? 'Active' : 'InActive'; // Get the new status
    const userInfo = { username: user.username, status }
    this.userService.userStatusChange(userInfo).subscribe(
      (response) => {
        user.status = status;
      },
      (error) => {
        console.error('Error creating client:', error);
      }
    );
  }
  
  onSubmit(modal:any){ 

    if (this.userForm.valid) {
      
      const name = this.userForm.controls["name"].value;
      const username = this.userForm.controls["username"].value;
      const email =  this.userForm.controls["email"].value;
      const phoneNumber =  this.userForm.controls["phoneNumber"].value;
      const userrole =  this.userForm.controls["userrole"].value;
      const userstatus =  this.userForm.controls["userStatus"].value?'Active':'InActive';
      const clientId =  this.user.clientId;
      const newUser = {
        "name": name,
        "username":username,
        "email": email,
        "contactNumber": phoneNumber,
        "role": userrole,
        "status": userstatus,
        "clientId":clientId
      };
  
      this.userService.createUser(newUser).subscribe(
        (response) => {
          this.userForm.reset();
          modal.close();
          console.log('User created:', response);
          this.loadUsers(this.user.clientId); // Refresh the list
        },
        (error) => {
          console.error('Error creating client:', error);
        }
      );
      
    } else {
      this.userForm.markAllAsTouched(); // Highlight validation errors
    }
  }
}
