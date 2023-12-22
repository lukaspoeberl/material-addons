import { Directive, OnDestroy, OnInit, TemplateRef } from "@angular/core";
import { DataTableTemplateColumnDefinition } from "./data-table-template-column-definition.directive";

@Directive({
  selector: "[madCellDef]",
})
export class DataTableTemplateCellDefinition implements OnInit, OnDestroy {
  constructor(
    private templateRef: TemplateRef<any>,
    private columnDef: DataTableTemplateColumnDefinition
  ) {}

  ngOnInit(): void {
    this.columnDef.register(this);
  }

  ngOnDestroy(): void {
    this.columnDef.unregister();
  }

  getCellTemplate(): TemplateRef<any> {
    return this.templateRef;
  }
}
