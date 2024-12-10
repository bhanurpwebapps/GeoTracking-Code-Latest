import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { ClientService } from 'src/app/shared/services/client.service';
@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent {
  modalReference: any = '';
  clients: any[] = [];
  clientForm: FormGroup;
  query: string = ''; // The search query entered by the user
  errorMessage: string = ''; // To store error messages
  constructor(private modalService: NgbModal,private fb: FormBuilder,private clientService:ClientService){ 

    // Initialize the form
    this.clientForm = this.fb.group({
      clientName: ['', [Validators.required, Validators.minLength(3)]],
      clientAddress: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      clientStatus:[true]
    });

  }

  

  // Triggered when the user types in the search field
  onKeySearch() {
    this.clientService.searchClients(this.query).subscribe(
      (response: any) => {
        this.clients = response.clients; // Set the found clients
        this.errorMessage = ''; // Clear any previous error
      },
      (error) => {
        this.clients = []; // Clear clients if search fails
        this.errorMessage = 'No clients found or an error occurred.';
      }
    );
  }
  createClientsAction(content:any){
    this.clientForm.reset();
    this.modalReference = this.modalService.open(content, {
      size: 'lg',
    });
  };

  ngOnInit(): void {
    //this.createClient();
    this.loadClients();
  }

  // Load clients
  loadClients(): void {
    this.clientService.getClients().subscribe(
      (data) => {
        this.clients = data;
        console.log(this.clients)
      },
      (error) => {
        console.error('Error fetching clients:', error);
      }
    );
  }

  ViewDataForEdit(clinet:any,modalcontent:any)
  {
    this.clientForm.controls["clientName"].setValue(clinet.name);
    this.clientForm.controls["email"].setValue(clinet.email);
    this.clientForm.controls["phoneNumber"].setValue(clinet.contactNumber);
    this.clientForm.controls["clientAddress"].setValue(clinet.address);
    this.clientForm.controls["clientStatus"].setValue(clinet.status=="Active"?true:false);
    this.modalReference = this.modalService.open(modalcontent, {
      size: 'lg',
    });
  }

  // This function is called when the switch is toggled
  onStatusChange(event: any,client:any) {
    const status = event ? 'Active' : 'InActive'; // Get the new status
    const clientInfo = { name: client.name, status }
    this.clientService.clientStatusChange(clientInfo).subscribe(
      (response) => {
        client.status = status;
      },
      (error) => {
        console.error('Error creating client:', error);
      }
    );
  }
  
  onSubmit(modal:any){ 

    if (this.clientForm.valid) {
      
      const clientName = this.clientForm.controls["clientName"].value;
      const email = this.clientForm.controls["email"].value;
      const phoneNumber =  this.clientForm.controls["phoneNumber"].value;
      const clientAddress =  this.clientForm.controls["clientAddress"].value;
      const clientStatus =  this.clientForm.controls["clientStatus"].value?'Active':'InActive';
      const newClient = {
        "name": clientName,
        "email": email,
        "contactNumber": phoneNumber,
        "address": clientAddress,
        "subscriptionPlan": 'Basic',
        "status": clientStatus
      };
  
      this.clientService.createClient(newClient).subscribe(
        (response) => {
          this.clientForm.reset();
          modal.close();
          console.log('Client created:', response);
          this.loadClients(); // Refresh the list
        },
        (error) => {
          console.error('Error creating client:', error);
        }
      );
      
    } else {
      this.clientForm.markAllAsTouched(); // Highlight validation errors
    }
  }
}
