import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionbarLayoutComponent } from './actionbar-layout.component';
import { MatIconModule } from '@angular/material/icon';
import { ContentPanelModule } from '../content-panel/content-panel.module';

@NgModule({
  declarations: [ActionbarLayoutComponent],
  exports: [ActionbarLayoutComponent],
  imports: [CommonModule, ContentPanelModule, MatIconModule],
})
export class ActionbarLayoutModule {}
