import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { NgScrollbarModule } from 'ngx-scrollbar';
import { LanguageService } from './language.service';
import { TranslateModule } from '@ngx-translate/core';
import { TopbarComponent } from './topbar/topbar.component';


@NgModule({
  declarations: [SidebarComponent, TopbarComponent],
  imports: [
    CommonModule,
    SharedRoutingModule,
    NgScrollbarModule,
    NgbDropdownModule,
    TranslateModule
  ],
  exports:[SidebarComponent, TopbarComponent],
  providers:[LanguageService]
})
export class SharedModule { }
