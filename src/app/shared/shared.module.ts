import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { NgScrollbarModule } from 'ngx-scrollbar';
import { LanguageService } from './language.service';
import { TranslateModule } from '@ngx-translate/core';
import { TopbarComponent } from './topbar/topbar.component';
import { FilterByTypePipe } from '../filter-by-type.pipe';

@NgModule({
  declarations: [SidebarComponent, TopbarComponent,FilterByTypePipe],
  imports: [
    CommonModule,
    SharedRoutingModule,
    NgScrollbarModule,
    NgbDropdownModule,
    TranslateModule
  ],
  exports:[SidebarComponent, TopbarComponent,FilterByTypePipe],
  providers:[LanguageService]
})
export class SharedModule { }
