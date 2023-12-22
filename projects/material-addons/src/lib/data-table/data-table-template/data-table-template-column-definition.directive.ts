import { Directive, Input } from "@angular/core";
import { DataTableTemplateCellDefinition } from "./data-table-template-cell-definition.directive";

@Directive({
  selector: "[madColumnDef]",
})
export class DataTableTemplateColumnDefinition {
  @Input()
  madColumnDef: string;

  cellDef: DataTableTemplateCellDefinition | null;

  register(cellDef: DataTableTemplateCellDefinition) {
    this.cellDef = cellDef;
  }

  unregister() {
    this.cellDef = null;
  }
}
