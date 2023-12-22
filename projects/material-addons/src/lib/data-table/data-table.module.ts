import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatTableModule } from "@angular/material/table";
import { MatSortModule } from "@angular/material/sort";
import { MatPaginatorModule } from "@angular/material/paginator";
import { DataTableComponent } from "./data-table.component";
import { TranslateModule } from "@ngx-translate/core";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatBadgeModule } from "@angular/material/badge";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { DataTableColumnsModalComponent } from "./data-table-columns-modal/data-table-columns-modal.component";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { FormsModule } from "@angular/forms";
import { DataTableFilterModule } from "./data-table-filter/data-table-filter.module";
import { DataTableTemplateCellDefinition } from "./data-table-template/data-table-template-cell-definition.directive";
import { DataTableTemplateColumnDefinition } from "./data-table-template/data-table-template-column-definition.directive";
import { MatRadioModule } from "@angular/material/radio";
import {ButtonModule} from '../button/button.module';

@NgModule({
  declarations: [
    DataTableComponent,
    DataTableColumnsModalComponent,
    DataTableTemplateColumnDefinition,
    DataTableTemplateCellDefinition,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatProgressSpinnerModule,
    ButtonModule,
    TranslateModule,
    MatCheckboxModule,
    MatRadioModule,
    MatBadgeModule,
    DragDropModule,
    FormsModule,
    DataTableFilterModule,
  ],
  exports: [
    DataTableComponent,
    DataTableColumnsModalComponent,
    DataTableTemplateColumnDefinition,
    DataTableTemplateCellDefinition,
  ],
})
export class DataTableModule {}
