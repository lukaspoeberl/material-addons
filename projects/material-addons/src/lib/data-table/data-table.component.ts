import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { DataTableColumn } from "./data-table-column";
import { DataTableAction } from "./data-table-action";
import { DataTableActionType } from "./data-table-action-type";
import { SelectionModel } from "@angular/cdk/collections";
import { v4 as uuidV4 } from "uuid";
import { MatDialog } from "@angular/material/dialog";
import { DataTableColumnsModalComponent } from "./data-table-columns-modal/data-table-columns-modal.component";
import {
  DataTableColumnDefinition,
  DataTableColumnDefinitionChange,
  DataTableDialogData,
} from "./data-table-column-definition";
import { DataTableRow } from "./data-table-row";
import { DataTableHeaderType } from "./data-table-header-type";
import { DataTableFilterMode } from "./data-table-filter-mode";
import { DataTableTemplateColumnDefinition } from "./data-table-template/data-table-template-column-definition.directive";
import { DataTableFilterObject } from "./data-table-filter/data-table-filter-object";
import { DataTableFilter } from "./data-table-filter/data-table-filter.directive";
import { DataTableSelectionEmitType } from "./data-table-selection-emit-type";
import { DataTableSelectionEmitMode } from "./data-table-selection-emit-mode";
import { DataTableSelectionMode } from "./data-table-selection-mode";

@Component({
  /* eslint-disable @angular-eslint/component-selector */
  selector: "mad-data-table",
  templateUrl: "./data-table.component.html",
  styleUrls: ["./data-table.component.scss"],
})
export class DataTableComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() id: string;

  // Translations
  @Input() filterLabel = "Filter";
  @Input() filterPlaceholder = "";
  @Input() filterColumnsLabel = "Filter";
  @Input() filterColumnsPlaceHolder = "Filter available columns";
  @Input() deleteFilterLabel = "Delete filter";
  @Input() showEmptyTable = false;
  @Input() noDataText = "No matching data found";
  @Input() columnSettingsModalTitleLabel = "Column settings";
  @Input() selectedLabel = "Selected columns";
  @Input() availableLabel = "Available columns";
  @Input() saveLabel = "Save";
  @Input() deleteLabel = "Delete";
  @Input() cancelLabel = "Cancel";
  @Input() infoTextLabel = "Drag and drop a column to select or reorder it.";
  @Input() tableClass: string;

  @Input() translateLabels = true;

  @Input() defaultSort: Sort;
  @Input() externalFilter: any;
  @Input() pageSizeOptions = [5, 10, 15];

  @Input() actions: DataTableAction[] = [];
  @Input() selectionEmitType: DataTableSelectionEmitType = "ID";
  @Input() showDeleteFilterAction: boolean = true;
  @Input() idGenerator: any;
  @Input() parentIdGenerator: any;
  @Input() deleteDefinitionAllowed = false;

  @Input() useAsync = false;
  @Input() stateful = false;

  @Input() set filterValue(filterValue: string) {
    const filterString = "" + filterValue;
    if (this.dataSource) {
      this.setFilterValue(filterString);
    }
  }

  @Input() set displayedColumns(cols: DataTableColumn[]) {
    if (!this.displayedColumnDefinition) {
      this.columns = cols ? [...cols] : [];
      this.columnIds = this.columns.map((column) => column.id);
      this.columnIds.unshift(this.ACTION_COLUMN_NAME);
    }
  }

  @Input() set displayedColumnDefinition(def: DataTableColumnDefinition) {
    this.selectedColumnDefinion = def;
    this.columns = def.displayedColumns;
    this.columnIds = this.columns.map((column) => column.id);
    this.columnIds.unshift(this.ACTION_COLUMN_NAME);
  }

  @Input() set tableData(data: any) {
    this._tableData = data ? data : [];
  }

  get tableData() {
    return this._tableData;
  }

  @Input() selection: string[] | any[];

  @Input() set page(page: PageEvent) {
    if (!!page) {
      this.paginatorPageIndex = page.pageIndex;
      this.paginatorPageSize = page.pageSize;
      this.paginatorLength = page.length;
    }
  }

  @Input() set columnDefinitions(definitions: DataTableColumnDefinition[]) {
    this.editableColumnDefinitions = [];
    this.viewableColumnDefinitions = [];
    this.allColumnDefinitions = [...definitions];
    for (const definition of definitions) {
      if (definition.editable) {
        this.editableColumnDefinitions.push(definition);
      }
      if (definition.displayedColumns?.length > 0) {
        this.viewableColumnDefinitions.push(definition);
      }
    }
  }

  @Input() set loading(isLoading: boolean) {
    this.isLoading = isLoading;
  }

  @Input() set defaultPageSize(defaultSize: number) {
    this.paginatorPageSize = defaultSize;
  }

  @Input() set externalPaginator(paginator: any) {
    this.extPaginator = paginator;
  }

  @Input() set paginationEnabled(isPaginationEnabled: boolean) {
    this.isPaginationEnabled = isPaginationEnabled;
  }

  @Input() set allColumns(allColumns: DataTableColumn[]) {
    this.allAvailableColumns = allColumns;
    if (allColumns && this.showColumnModal) {
      this.openColumnModal();
    }
  }

  /**
   * @deprecated
   * Please use "filterMode" instead
   */
  @Input()
  set filterEnabled(isFilterEnabled: boolean) {
    this._filterMode = !this.useAsync && isFilterEnabled ? "TABLE_BASED" : "NONE";
    this.initializeFiltering();
  }

  @Input()
  set filterMode(filterMode: DataTableFilterMode) {
    this._filterMode = this.useAsync && filterMode === "TABLE_BASED" ? "NONE" : filterMode;
    this.initializeFiltering();
  }

  get filterMode() {
    return this._filterMode;
  }

  @Input() selectionEmitMode: DataTableSelectionEmitMode = "NONE";

  /**
   * @deprecated
   * This function mixes up 2 responsibilities:
   *  - determining if actions should be displayed / handled
   *  - determining whether actions are row based (single) or table based (batch)
   * Please use a combination of "selectionEmitMode" and "selectionMode" instead:
   *  - selectionEmitMode determines how selected items are handled (as part of actions, as selections or not at all)
   *  - selectionMode determines if selected items are treated separately (single) or together (batch)
   */
  @Input()
  set forceMode(mode: string) {
    if (mode === this.SINGLE || mode === this.BATCH) {
      this.selectionEmitMode = "ON_ACTION";
    }

    if (mode === this.SINGLE || mode === this.BATCH || mode === this.NONE) {
      this.initSelectionMode(mode);
    }
  }

  @Input()
  set forceSelectionMode(selectionMode: DataTableSelectionMode) {
    this.initSelectionMode(selectionMode);
  }

  @Output() sortEvent = new EventEmitter<Sort>();
  @Output() filterEvent = new EventEmitter<DataTableFilterObject>();
  @Output() actionEvent = new EventEmitter<DataTableAction>();
  @Output() selectionEvent = new EventEmitter<any[]>();
  @Output() pageEvent = new EventEmitter<PageEvent>();
  @Output() allColumnsEvent = new EventEmitter<void>();
  @Output() columnDefinitionChangeEvent = new EventEmitter<DataTableColumnDefinitionChange>();
  @Output() viewDefinitionChangeEvent = new EventEmitter<DataTableColumnDefinition>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(DataTableFilter) filter: DataTableFilter;
  @ContentChildren(DataTableTemplateColumnDefinition) columnDefs: QueryList<DataTableTemplateColumnDefinition>;

  readonly ACTION_COLUMN_NAME = "__action__";
  readonly SINGLE = DataTableActionType.SINGLE;
  readonly BATCH = DataTableActionType.BATCH;
  readonly NONE = DataTableActionType.NONE;
  tableActions: DataTableAction[][] = [];
  rowActions: DataTableAction[] = [];
  columns: DataTableColumn[] = [];
  allSelected = false;
  selected: [];
  _forceSelectionMode: string;
  rowMap = new Map<string, DataTableRow>();
  dataSource: MatTableDataSource<any[]>;
  selectionModel = new SelectionModel<string>(true);
  columnIds: string[];
  allColumnDefinitions: DataTableColumnDefinition[] = [];
  editableColumnDefinitions: DataTableColumnDefinition[];
  viewableColumnDefinitions: DataTableColumnDefinition[];
  selectedColumnDefinion: DataTableColumnDefinition;
  allAvailableColumns: DataTableColumn[];
  selectedDefinition: DataTableColumnDefinition;
  defaultAction: DataTableAction;
  _filterMode: DataTableFilterMode = "NONE";
  isPaginationEnabled = false;
  selectionMode = this.NONE;
  isRowClickable = false;
  showColumnModal = false;
  isLoading = false;
  extPaginator: MatPaginator;

  paginatorLength = 0;
  paginatorPageIndex = 0;
  paginatorPageSize = 50;

  private _tableData: any[];

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private matDialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource<any>();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ("tableData" in changes) {
      this.createDataMapsAndSetDisplayedDataSourceData(this._tableData);
      this.updateSelectionModel(this.getSelection("ID"));
    }
    if ("idGenerator" in changes || "displayedColumns" in changes) {
      this.createDataMapsAndSetDisplayedDataSourceData(this._tableData);
    }
    if ("selection" in changes) {
      this.updateSelectionModel(this.selection);
    }
    if ("tableData" in changes || "paginationEnabled" in changes || "useAsync" in changes) {
      this.unsetPageSizeIfNecessary();
    }
    if ("forceMode" in changes || "forceSelectionMode" in changes || "actions" in changes) {
      this.setActions();
    }
  }

  getDataTableHeaderType(column: DataTableColumn): DataTableHeaderType {
    if (column.isSortable && !column.isFilterable) {
      return "SORT";
    }
    if (!column.isSortable && column.isFilterable) {
      return "FILTER";
    }
    if (column.isSortable && column.isFilterable) {
      return "SORT_AND_FILTER";
    }
    return "PLAIN";
  }

  getCustomCellTemplate(columnId: string): TemplateRef<any> | null {
    const columnDef = this.columnDefs.find((it) => it.madColumnDef === columnId);
    return columnDef && columnDef.cellDef ? columnDef.cellDef.getCellTemplate() : null;
  }

  private initSelectionMode(selectionMode: string) {
    this._forceSelectionMode = selectionMode;
    this.selectionMode = selectionMode;
    this.selectionModel.clear();
  }

  private initializeFiltering(): void {
    if (this._filterMode === "COLUMN_BASED") {
      this.dataSource.filterPredicate = this.columnBasedFilterPredicate.bind(this);
    }

    this.setFilterValue("");
  }

  private columnBasedFilterPredicate(row: any, filterString: string): boolean {
    const actualData = this.rowMap.get(row.rowId)?.actualData;
    const displayedData = row;
    const filters: DataTableFilterObject = JSON.parse(filterString);
    return Object.entries(filters).every(
      ([key, value]) => !value || this.contains(actualData, key, value) || this.contains(displayedData, key, value)
    );
  }

  private contains(data: any, key: string, searchTerm: string): boolean {
    return (String((data as any)[key]) ?? "").toLowerCase().includes(searchTerm.toLowerCase());
  }

  onFilteringEvent(filter: DataTableFilterObject | undefined): void {
    if (this.useAsync) {
      this.filterEvent.emit(filter);
    } else {
      this.allSelected = false;
      this.selectionModel.clear();
      this.setFilterValue(JSON.stringify(filter));
    }

    if (this.stateful) {
      this.persistFilter(filter);
    }
  }

  static compare(a: Record<string, any>, b: Record<string, any>, sort: Sort): number {
    const x = a[sort.active];
    const y = b[sort.active];
    const ascending = sort.direction === "asc";
    switch (typeof x) {
      case "number":
        return DataTableComponent.compareNumber(x, y, ascending);
      case "string":
        return DataTableComponent.compareString(x, y, ascending);
      case "boolean":
        return DataTableComponent.compareBoolean(x, y, ascending);
      default:
        // cannot compare -> return equal
        return 0;
    }
  }

  static compareNumber(x: number, y: number, ascending: boolean): number {
    return ascending ? x - y : y - x;
  }

  static compareString(x: string, y: string, ascending: boolean): number {
    return ascending ? x.localeCompare(y) : y.localeCompare(x);
  }

  static compareBoolean(x: boolean, y: boolean, ascending: boolean): number {
    if (x === y) {
      return 0;
    }
    if (ascending) {
      // true first
      return x ? -1 : 1;
    } else {
      // false first
      return x ? 1 : -1;
    }
  }

  static transformData(value: any, transformer: any, transformerParams: any): any {
    if (!transformer || !(transformer instanceof Function)) {
      return value;
    }
    return transformer(value, transformerParams);
  }

  static generateRowId(): string {
    return uuidV4();
  }

  static isClickOnRowMenuIcon(event: MouseEvent): boolean {
    return (event?.target as HTMLElement)?.classList.contains("mat-icon");
  }

  ngOnInit(): void {
    this.setTableMode();
    this.setSelectionMode();
    if (this.selectionMode !== this.NONE) {
      this.isRowClickable = true;
      this.defaultAction = this.rowActions[0];
    }
  }

  ngAfterViewInit(): void {
    if (!this.useAsync) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
    this.initializeState();
  }

  onColumnSettings(definition?: DataTableColumnDefinition): void {
    this.showColumnModal = true;
    this.selectedDefinition = definition ? definition : this.allColumnDefinitions[0];
    if (this.allAvailableColumns) {
      this.openColumnModal();
    } else {
      // if no complete definitions have been loaded yet send an event so the app can load it
      this.allColumnsEvent.emit();
    }
  }

  onViewDefinition(definition: DataTableColumnDefinition): void {
    this.selectedDefinition = definition;
    this.viewDefinitionChangeEvent.emit(definition);
  }

  isCurrentDefinition(definition: DataTableColumnDefinition): boolean {
    return this.selectedDefinition && this.selectedDefinition.id === definition.id;
  }

  get selectedCount(): number {
    return this.selectionModel?.selected ? this.selectionModel.selected.length : 0;
  }

  get rowCount(): number {
    return this.getAllDataSourceRowsOfCurrentPage() ? this.getAllDataSourceRowsOfCurrentPage().length : 0;
  }

  getAllDataSourceRowsOfCurrentPage(): any[] {
    // only use filtered data
    return this.dataSource?._pageData(this.dataSource.filteredData);
  }

  getSelectedCount(actionType: string): string {
    const count = this.selectedCount;
    if (actionType !== this.BATCH || count < 2) {
      return "";
    }
    return " (" + count + ")";
  }

  updateSelectionModel(selection: string[] | any[]) {
    this.selectionModel.clear();
    selection?.forEach((it) => {
      const item = this.rowMap.get(it) || [...this.rowMap.values()].find((row) => row.actualData === it);
      if (!!item) {
        this.updateSelection(item.id);
      }
    });
  }

  isHidden(action: DataTableAction): boolean {
    return !!action.isHidden && action.isHidden(this.getSelection("DATA"));
  }

  isDisabled(action: DataTableAction): boolean {
    return (
      this.isDisabledForActionType(action.type) || (!!action.isDisabled && action.isDisabled(this.getSelection("DATA")))
    );
  }

  getSelection(selectionEmitType: DataTableSelectionEmitType): any[] {
    const selection = [];
    for (const selected of this.selectionModel.selected) {
      // if ID-generator is provided, return the ID, else return the ACTUAL data
      selection.push(this.idGenerator && selectionEmitType === "ID" ? selected : this.rowMap.get(selected)?.actualData);
    }
    return selection;
  }

  isDisabledForActionType(actionType: string): boolean {
    switch (actionType) {
      case this.SINGLE:
        return this.selectedCount !== 1;
      case this.BATCH:
        return this.selectedCount < 1;
      default:
        return false;
    }
  }

  onToggleSelectAll(): void {
    // clear all selection first
    this.selectionModel.clear();
    // toggle all checkbox
    this.allSelected = !this.allSelected;
    if (this.allSelected) {
      // select all rows of the current page
      this.getAllDataSourceRowsOfCurrentPage().forEach((row) => {
        if (!row.parentId) {
          this.selectionModel.select("" + row.rowId);
        }
      });
    }
  }

  isSelected(rowId: string): boolean {
    return this.selectionModel.isSelected(rowId);
  }

  deleteFilter(): void {
    this.onFilteringEvent(undefined);
    this.filter.updateFilterables(undefined);
  }

  updateFilterValue(event: Event): void {
    this.setFilterValue((event.target as HTMLTextAreaElement).value);
  }

  setFilterValue(value: string): void {
    this.dataSource.filter = this._filterMode === "TABLE_BASED" ? value?.trim().toLowerCase() : value;
  }

  onRowEvent(event: MouseEvent, row: any, action = this.defaultAction): void {
    if (row?.parentId) {
      return;
    }

    this.updateSelection(row.rowId);
    this.processSelection(action, event);
  }

  private processSelection(action: DataTableAction, event: MouseEvent) {
    if (
      this.selectionEmitMode === "ON_ACTION" &&
      this.selectionMode === "SINGLE" &&
      !!action &&
      !DataTableComponent.isClickOnRowMenuIcon(event)
    ) {
      this.emitTableAction(action);
    }

    if (this.selectionEmitMode === "ON_SELECTION") {
      this.selectionEvent.emit(this.getSelection(this.selectionEmitType));
    }
  }

  updateSelection(id: any) {
    switch (this.selectionMode) {
      case this.BATCH:
        this.selectionModel.toggle(id);
        break;
      case this.SINGLE:
        this.selectionModel.clear();
        this.selectionModel.toggle(id);
        break;
    }
  }

  onSortingEvent(sort: Sort): void {
    if (this.useAsync) {
      this.sortEvent.emit(sort);
    } else {
      this.internalSort(sort);
    }

    if (this.stateful) {
      this.persistSort(sort);
    }
  }

  onPageEvent(event: PageEvent): void {
    if (this.useAsync) {
      this.pageEvent.emit(event);
    }

    if (this.stateful) {
      this.persistPageSize(event.pageSize);
    }
  }

  onTableAction(tableAction: DataTableAction): void {
    if (!!tableAction) {
      tableAction.selected = this.getSelection(this.selectionEmitType);
      this.actionEvent.emit(tableAction);
    }
  }

  private emitTableAction(action: DataTableAction): void {
    const emitAction = { ...action };
    if (action.type !== this.NONE) {
      emitAction.selected = this.getSelection(this.selectionEmitType);
    }
    this.actionEvent.emit(emitAction);
  }

  private generateDisplayedDataElement(rowId: string, parentId: string, actualDataElement: any): any {
    const displayedDataElement: { [key: string]: any } = {};
    displayedDataElement["rowId"] = rowId;
    displayedDataElement["parentId"] = parentId;
    // keep non displayed data in row
    for (const key of Object.keys(actualDataElement)) {
      const column = this.columns.find((it) => it.dataPropertyName === key);
      const actualValue = actualDataElement[key];
      displayedDataElement[key] = DataTableComponent.transformData(
        actualValue,
        column?.transformer,
        column?.transformerParams
      );
    }
    return displayedDataElement;
  }

  private internalSort(sort: Sort): void {
    const sortedData = [...this.dataSource.data].sort((a, b) => DataTableComponent.compare(a, b, sort));
    this.dataSource.data = [...sortedData];
  }

  private setActions(): void {
    const rowActions = [];
    const tableActions = [];
    for (const action of this.actions) {
      if (this.selectionMode !== action.hiddenInMode) {
        switch (action.type) {
          case this.SINGLE:
            if (this.selectionMode === this.SINGLE) {
              rowActions.push(action);
            } else {
              tableActions.push(action);
            }
            break;
          case this.BATCH:
            if (this.selectionMode !== this.SINGLE) {
              tableActions.push(action);
            }
            break;
          default:
            tableActions.push(action);
        }
      }
    }

    this.setRowActions(rowActions);
    this.setTableActions(tableActions);
  }

  private setRowActions(rowActions: DataTableAction[]): void {
    this.rowActions = rowActions;
  }

  private setTableActions(tableActions: DataTableAction[]): void {
    this.tableActions = Object.values(
      tableActions.reduce((result: { [key: number]: DataTableAction[] }, current) => {
        const index = Object.entries(result).findIndex(([, actions]) =>
          actions.find((it) => !!current.groupId && it.groupId === current.groupId)
        );
        const key = index !== -1 ? index : Object.keys(result).length || 0;
        (result[key] = result[key] || []).push(current);
        return result;
      }, {})
    );
  }

  private createDataMapsAndSetDisplayedDataSourceData(data: any[]): void {
    const displayedDataList: any[] = [];
    this.rowMap.clear();
    if (data?.length > 0) {
      for (const dataEntry of data) {
        const rowId = (
          !!this.idGenerator ? this.idGenerator(dataEntry) : DataTableComponent.generateRowId()
        ).toString();
        const parentId = this.parentIdGenerator ? this.parentIdGenerator(dataEntry) : undefined;
        const displayedDataElement = this.generateDisplayedDataElement(rowId, parentId, dataEntry);
        const dataRow: DataTableRow = {
          id: rowId,
          parentId: parentId,
          actualData: dataEntry,
          displayedData: displayedDataElement,
        };
        this.rowMap.set(rowId, dataRow);
        displayedDataList.push(displayedDataElement);
      }
    }
    this.dataSource.data = displayedDataList;
  }

  private openColumnModal(): void {
    const dialogData: DataTableDialogData = {
      allColumns: this.allAvailableColumns,
      definition: this.selectedDefinition,
      deleteDefinitionAllowed: this.deleteDefinitionAllowed,
      filterColumnsLabel: this.filterColumnsLabel,
      filterColumnsPlaceHolder: this.filterColumnsPlaceHolder,
      noDataText: this.noDataText,
      titleLabel: this.columnSettingsModalTitleLabel,
      selectedLabel: this.selectedLabel,
      availableLabel: this.availableLabel,
      saveLabel: this.saveLabel,
      deleteLabel: this.deleteLabel,
      cancelLabel: this.cancelLabel,
      infoTextLabel: this.infoTextLabel,
    };
    const dialog = this.matDialog.open(DataTableColumnsModalComponent, { data: dialogData });
    dialog.afterClosed().subscribe((result) => {
      // no event on CANCEL
      if (result) {
        this.columnDefinitionChangeEvent.emit(result);
      }
    });
  }

  // We need this for backwards compatibility
  private setTableMode(): void {
    if (this.selectionEmitMode === "NONE" && this.actions && !this.actions.every((it) => it.type === "NONE")) {
      this.selectionEmitMode = "ON_ACTION";
    }
  }

  private setSelectionMode(): void {
    if (this._forceSelectionMode) {
      this.selectionMode = this._forceSelectionMode;
    } else {
      this.selectionMode = this.determineTreatmentMode();
    }
  }

  private determineTreatmentMode(): "BATCH" | "SINGLE" {
    return this.actions.find((it) => it.type === "BATCH") ? "BATCH" : "SINGLE";
  }

  private unsetPageSizeIfNecessary(): void {
    if (!this.useAsync && !this.isPaginationEnabled) {
      const dataCount = this.dataSource.data ? this.dataSource.data.length : 0;
      this.paginatorPageSize = dataCount;
      this.paginatorLength = dataCount;
    } else if (!!this.page) {
      this.paginatorPageSize = this.page.pageSize;
      this.paginatorLength = this.page.length;
    }
  }

  private persistPageSize(pageSize: number): void {
    localStorage.setItem(`${this.id}.pageSize`, JSON.stringify(pageSize));
  }

  private persistSort(sort: Sort): void {
    localStorage.setItem(`${this.id}.sort`, JSON.stringify(sort));
  }

  private persistFilter(filter: DataTableFilterObject | undefined): void {
    !!filter
      ? localStorage.setItem(`${this.id}.filter`, JSON.stringify(filter))
      : localStorage.removeItem(`${this.id}.filter`);
  }

  private initializeState(): void {
    // only set default sort if there is no other sort persisted
    if (!!this.defaultSort && !this.loadSort()?.direction) {
      this.setSort(this.defaultSort);
    }

    if (this.stateful) {
      this.initializePaginatorState();
      this.initializeSortState();
      this.initializeFilterState();
    }

    this.changeDetectorRef.detectChanges();
  }

  private initializePaginatorState(): void {
    const page = this.loadPage();
    if (!!page.pageSize) {
      this.page = page;
      this.paginator.page.emit(page);
    }
  }

  private initializeSortState(): void {
    const sort = this.loadSort();
    if (!!sort) {
      this.setSort(sort);
    }
  }

  private setSort(sort: Sort): void {
    this.sort.active = sort.active;
    this.sort.direction = sort.direction;
    this.sort.sortChange.emit(sort);
  }

  private initializeFilterState(): void {
    const filter = this.loadFilter();
    this.filter.updateFilterables(filter);
  }

  private loadPage(): PageEvent {
    const storedPageSize = localStorage.getItem(`${this.id}.pageSize`);
    const pageSize = !!storedPageSize ? JSON.parse(storedPageSize) : this.paginatorPageSize;
    return { pageIndex: 0, pageSize: pageSize, length: 0 };
  }

  private loadSort(): Sort | undefined {
    const sort = localStorage.getItem(`${this.id}.sort`);
    return !!sort ? JSON.parse(sort) : undefined;
  }

  private loadFilter(): DataTableFilterObject | undefined {
    const filter = localStorage.getItem(`${this.id}.filter`);
    return !!filter ? JSON.parse(filter) : undefined;
  }
}
