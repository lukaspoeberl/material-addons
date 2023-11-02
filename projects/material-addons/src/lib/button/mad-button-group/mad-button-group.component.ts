import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'mad-button-group',
  template: '<ng-content></ng-content>',
  styleUrls: [],
})
export class MadButtonGroupComponent {
  @HostBinding('class.mad-button-group') setClass = true;
}
