import { Component } from '@angular/core';

@Component({
  selector: 'sidebar-page-layouts',
  templateUrl: './sidebar-page-layout.component.html',
})
export class SidebarPageLayoutComponent {
  sidebarPageLayout = `<mad-main-container>
  <mad-content-header>
    <div class="flex-row align-items-center place-content-center-space-between">
      <div class="flex-row align-items-center place-content-center fx-gap-1em">
        <button mat-button>
          <mat-icon color="primary" (click)="goToPreviousPage()">arrow_back</mat-icon>
        </button>
        <h2 class="title">Sidebar layout</h2>
      </div>
      <div class="flex-row align-items-center place-content-center fx-gap-1em">
        <mad-icon-button>
          <mat-icon color="primary">history</mat-icon>
        </mad-icon-button>
        <mad-outline-button>Action A</mad-outline-button>
        <mad-outline-button color="warn">Action B</mad-outline-button>
      </div>
    </div>
  </mad-content-header>
  <mad-content-panel-container>
    <mad-content-panel-container-sidebar>
      <mad-sidebar>
        <a mad-sidebar-item routerLink="/full-page-layouts/sidebar-page-layout/1" routerLinkActive="active-sidebar-item">Item 1</a>
        <a mad-sidebar-item routerLink="/full-page-layouts/sidebar-page-layout/2" routerLinkActive="active-sidebar-item">Item 2</a>
        <a mad-sidebar-item href="#">A very very long name is here</a>
      </mad-sidebar>
    </mad-content-panel-container-sidebar>
    <mad-content-panel-container-content>
      <router-outlet></router-outlet>
    </mad-content-panel-container-content>
  </mad-content-panel-container>
</mad-main-container>`;
}
