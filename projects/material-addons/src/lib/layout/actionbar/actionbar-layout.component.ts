import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'mad-actionbar-layout',
  templateUrl: './actionbar-layout.component.html',
  styleUrls: ['./actionbar-layout.component.scss'],
})
export class ActionbarLayoutComponent {
  @Input() title: string = '';
  @Input() hasBackButton = true;

  constructor(
    private router: Router,
    private location: Location,
  ) {}

  public goToPreviousPage(): void {
    this.router.navigate([''], { skipLocationChange: true }).then((canRedirect) => {
      if (canRedirect) {
        this.location.back();
      }
    });
  }
}
