import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'mad-actionbar-layout',
  templateUrl: './action-bar-layout.component.html',
  styleUrls: ['./action-bar-layout.component.scss']
})
export class ActionBarLayoutComponent {

  @Input() title: string = '';
  @Input() hasBackButton = true;


  constructor(private router: Router, private location: Location) {
  }


  public goToPreviousPage(): void {
    this.router.navigate([''], {skipLocationChange: true}).then(canRedirect => {
      if (canRedirect) {
        this.location.back();
      }
    });
  }
}
