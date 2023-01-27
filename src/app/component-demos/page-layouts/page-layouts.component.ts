import { Component } from '@angular/core';

@Component({
  selector: 'app-page-layouts',
  templateUrl: './page-layouts.component.html',
  styleUrls: ['./page-layouts.component.scss'],
})
export class PageLayoutsComponent {
  basePageLayout =
    `<mad-main-container>
        <mad-content-header>
          <div class="flex-row align-items-center place-content-center-space-between">
            <div class="flex-row align-items-center place-content-center gap-1">
              <button mat-button>
                <mat-icon color="primary">arrow_back</mat-icon>
              </button>
              <h2 class="title">Base Pagelayout</h2>
            </div>
          </div>
        </mad-content-header>
        <mad-content-panel-container>
          <mad-content-panel-container-content>
            <p>Define the page content here</p>
          </mad-content-panel-container-content>
          <mad-content-panel-container-footer class="flex-row align-items-center place-content-center-space-between">
            <p>Footer here</p>
          </mad-content-panel-container-footer>
       </mad-content-panel-container>
     </mad-main-container>`;

  flowBarLayout = `
    <mad-main-container>
        <mad-content-header>
            <div class="flex-row align-items-center place-content-center-space-between">
                <div class="flex-row align-items-center place-content-center gap-1">
                    <button mat-button>
                        <mat-icon color="primary">arrow_back</mat-icon>
                    </button>
                    <h2 class="title">Flow Bar layout</h2>
                </div>
            </div>
        </mad-content-header>
        <mad-flowbar #flowBar [steps]="steps" [activeStep]="activeStep" (activeStepChange)="activeStepChanged($event)"
        (headerClick)="selectStep($event)">
        </mad-flowbar>
        <mad-content-panel-container>
            <mad-content-panel-container-content>
            <p *ngFor="let a of [1, 2, 3]">
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut
                labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et
                ea rebum.
                Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit
                amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna
                aliquyam
                erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd
                gubergren,
                no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur
                sadipscing
                elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
                voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea
                takimata sanctus
                est
                Lorem ipsum dolor sit amet.
            </p>
            </mad-content-panel-container-content>
            <mad-content-panel-container-footer class="flex-row align-items-center place-content-center-space-between">
                <div class="flex-row gap-1">
                    <mad-outline-button (click)="flowBar.previous()" *ngIf="flowBar.isPreviousAvailable()">
                        Previous
                    </mad-outline-button>
                    <mad-primary-button(click)="flowbar.next()" *ngIf="!flowBar.isLastStep()">
                        Next
                    </mad-primary-button>
                </div>
            </mad-content-panel-container-footer>
        </mad-content-panel-container>
    </mad-main-container>`;

  sidebarPageLayout =
    `<mad-main-container>
  <mad-content-header>
    <div class="flex-row align-items-center place-content-center-space-between">
      <div class="flex-row align-items-center place-content-center gap-1">
        <button mat-button>
          <mat-icon color="primary" (click)="goToPreviousPage()">arrow_back</mat-icon>
        </button>
        <h2 class="title">Sidebar layout</h2>
      </div>
      <div class="flex-row align-items-center place-content-center gap-1">
        <button mat-button>
          <mat-icon color="primary">history</mat-icon>
        </button>
        <mad-outline-button>Action A</mad-outline-button>
        <mad-outline-button>Action B</mad-outline-button>
      </div>
    </div>
  </mad-content-header>
  <mad-content-panel-container>

    <mad-content-panel-container-sidebar>
      <mad-sidebar>
        <a mad-sidebar-item routerLink="/full-page-layouts/sidebar-page-layout/1" routerLinkActive="active">item 1</a>
        <a mad-sidebar-item routerLink="/full-page-layouts/sidebar-page-layout/2" routerLinkActive="active">item 2</a>
        <a mad-sidebar-item href="#">A very very long name is here</a>

      </mad-sidebar>
    </mad-content-panel-container-sidebar>
    <mad-content-panel-container-content>
      <!--<router-outlet></router-outlet>-->
      <p>Define the page content here</p>
    </mad-content-panel-container-content>

  </mad-content-panel-container>
</mad-main-container>
`;

}
