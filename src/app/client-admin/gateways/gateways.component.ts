import { Component, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, finalize } from 'rxjs';
import { AreaService } from 'src/app/shared/services/area.service';
import { UserService } from 'src/app/shared/services/user.service';
import { GatewayService } from 'src/app/shared/services/gateway.service';
import { SocketService } from 'src/app/shared/services/socket.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
@Component({
  selector: 'app-gateways',
  templateUrl: './gateways.component.html',
  styleUrls: ['./gateways.component.css']
})
export class GatewaysComponent {
  modalReference: any = '';
  areas: any[] = [];
  gatewayForm: FormGroup;
  user: any;
  private gatewaySubject = new BehaviorSubject<any[]>([]);
  gateways: any[] = [];
  query: string = ''; // The search query entered by the user
  errorMessage: string = ''; // To store error messages
  hasGateways: boolean = true;
  constructor(private modalService: NgbModal, private fb: FormBuilder, private areaService: AreaService, private userService: UserService, private gatewayService: GatewayService, private socketService: SocketService, private toastr: NotificationService) {

    this.userService.user$.subscribe((user) => {
      this.user = user.user; // Update user info dynamically
    });
    // Initialize the form
    this.gatewayForm = this.fb.group({
      area: ['', [Validators.required]],
      macAddress: ['', [Validators.required, Validators.minLength(12)]],
      minRSSI: ['', [Validators.required, Validators.pattern('^-?[0-9]*$')]], // Numeric and optional negative
      maxRSSI: ['', [Validators.required, Validators.pattern('^-?[0-9]*$')]],
      gatewayStatus: [true]
    }, {
      validators: this.rssiRangeValidator('minRSSI', 'maxRSSI') // Custom range validator
    });

  }

  rssiRangeValidator(minKey: string, maxKey: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const minRSSI = formGroup.get(minKey)?.value;
      const maxRSSI = formGroup.get(maxKey)?.value;

      if (minRSSI !== null && maxRSSI !== null && minRSSI > maxRSSI) {
        return { invalidRange: true }; // Error key if validation fails
      }

      return null; // No error
    };
  }

  // Triggered when the Gateways types in the search field
  onKeySearch() {
    this.gatewayService.searchGateways(this.query, this.user.clientId).subscribe(
      (response: any) => {
        this.gateways = response.gateways; // Set the found areas
        this.errorMessage = ''; // Clear any previous error
        this.hasGateways = true;
      },
      (error) => {
        this.gateways = []; // Clear areas if search fails
        this.errorMessage = 'No Areas found or an error occurred.';
        this.hasGateways = false;
      }
    );
  }

  creategatewaysAction(content: any) {
    this.modalReference = this.modalService.open(content, {
      size: 'lg',
    });

    this.modalReference.result.then(
      (result: any) => {
        // Logic to execute when modal is closed with "close"
        this.gatewayForm.reset(); // You can call your custom method here
      },
      (reason: any) => {
        // Logic to execute when modal is dismissed (e.g., by clicking outside or pressing ESC)
        this.gatewayForm.reset(); // Call your custom dismiss method
      }
    );
  };

  ngOnInit(): void {

    this.loadGateways(this.user.clientId)
    this.loadAreas(this.user.clientId);
    // Listen for gateway status updates
    this.socketService.onGatewayStatus().subscribe((status) => {
      console.log('Received gateway status:', status);
      this.updateGatewayStatus(status);
    });
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
  loadGateways(clientId: any): void {
    this.gatewayService.getGateways(clientId).subscribe(
      (data) => {
        this.gateways = data;
        this.gatewaySubject.next(this.gateways);
        this.hasGateways = true;
      },
      (error) => {
        this.gateways = [];
        this.hasGateways = false;
        console.error('Error fetching gateways:', error);
        //this.hasGateways = false;
      }
    );
  }

  // Update gateway status
  private updateGatewayStatus(newStatus: any) {

    const currentGateways = this.gatewaySubject.getValue();
    const updatedGateways = currentGateways.map(gateway =>
      gateway.macAddress === newStatus.id.toUpperCase() ? { ...gateway, connected: newStatus.connected, connectedStatus: newStatus.connected } : gateway
    );
    this.gatewaySubject.next(updatedGateways);

    this.gateways = this.gatewaySubject.getValue();
  }

  ViewDataForEdit(gateway: any, modalcontent: any) {
    this.gatewayForm.controls["area"].setValue(gateway.areaId);
    this.gatewayForm.controls["macAddress"].setValue(gateway.macAddress);
    this.gatewayForm.controls["minRSSI"].setValue(gateway.minRSSI);
    this.gatewayForm.controls["maxRSSI"].setValue(gateway.maxRSSI);
    this.gatewayForm.controls["gatewayStatus"].setValue(gateway.status == "Active" ? true : false);
    this.modalReference = this.modalService.open(modalcontent, {
      size: 'lg',
    });

    this.modalReference.result.then(
      (result: any) => {
        // Logic to execute when modal is closed with "close"
        this.gatewayForm.reset(); // You can call your custom method here
      },
      (reason: any) => {
        // Logic to execute when modal is dismissed (e.g., by clicking outside or pressing ESC)
        this.gatewayForm.reset(); // Call your custom dismiss method
      }
    );
  }

  // This function is called when the switch is toggled
  onStatusChange(event: any, gateway: any) {
    const status = event ? 'Active' : 'InActive'; // Get the new status
    const gatewayInfo = { macAddress: gateway.macAddress, status: status, clientId: this.user.clientId }
    this.gatewayService.GatewayStatusChange(gatewayInfo).subscribe(
      (response) => {
        gateway.status = status;
      },
      (error) => {
        console.error('Error changing status:', error);
      }
    );
  }

  onSubmit(modal: any) {
    if (this.gatewayForm.valid) {

      const macAddress = this.gatewayForm.controls["macAddress"].value;
      const minRSSI = this.gatewayForm.controls["minRSSI"].value;
      const maxRSSI = this.gatewayForm.controls["maxRSSI"].value;
      const area = this.gatewayForm.controls["area"].value;
      const gatewayStatus = this.gatewayForm.controls["gatewayStatus"].value ? 'Active' : 'InActive';
      const clientId = this.user.clientId;
      const newGateway = {
        "macAddress": macAddress,
        "minRSSI": minRSSI,
        "maxRSSI": maxRSSI,
        "areaId": area,
        "status": gatewayStatus,
        "clientId": clientId
      };

      this.gatewayService.createGateway(newGateway).subscribe(
        (response) => {
          this.gatewayForm.reset();
          modal.close();
          console.log('Gateway created:', response);
          // Subscribe to gateway status updates
          this.loadGateways(this.user.clientId);
          this.toastr.showSuccess("Gateway Created Successfully", "Success");
        },
        (error) => {
          console.error('Error creating Gateway:', error);
          this.toastr.showError(error, "Error");
        }
      );

    } else {
      this.gatewayForm.markAllAsTouched(); // Highlight validation errors
    }
  }
}
