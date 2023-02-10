import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActionGroupComponent} from './action-group.component';


@NgModule({
  declarations: [
    ActionGroupComponent
  ],
  exports: [
    ActionGroupComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ActionGroupModule {
}
