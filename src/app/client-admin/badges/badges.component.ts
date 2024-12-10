import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-badges',
  templateUrl: './badges.component.html',
  styleUrls: ['./badges.component.css']
})
export class BadgesComponent {
  modalReference: any = '';
  constructor(private modalService: NgbModal,private fb: FormBuilder){ }

  createBadgesAction(content:any){
    this.modalReference = this.modalService.open(content, {
      size: 'lg',
    });
  };

  ngOnInit(): void {}
  
  onSubmit(){ }
}
