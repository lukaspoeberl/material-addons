import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionBarLayoutComponent } from './action-bar-layout.component';
import {MatIconModule} from '@angular/material/icon';
import {ContentPanelModule} from "../../content-panel/content-panel.module";



@NgModule({
  declarations: [
    ActionBarLayoutComponent
  ],
  exports: [
    ActionBarLayoutComponent
  ],
  imports: [
    CommonModule,
    ContentPanelModule,
    MatIconModule,
  ]
})
export class ActionBarLayoutModule { }
