import { Component } from '@angular/core';
import { QuickListItem } from '@porscheinformatik/material-addons/lib/quick-list/base-quick-list.component';

interface QuickListDemoItem extends QuickListItem {
  firstName: string;
  lastName: string;
}

@Component({
  selector: 'app-quick-list-extended',
  templateUrl: './quick-list-extended.component.html',
  styleUrls: ['./quick-list-extended.component.scss','../../flex-utility.scss'],
})
export class QuickListExtendedComponent {
  items: QuickListDemoItem[] = [{ id: '1', firstName: '', lastName: '' }];
  textIsEditable = true;

  // eslint-disable-next-line
  onItemAdded(item: QuickListDemoItem): void {
    // updated items will be available in this.items
  }

  // eslint-disable-next-line
  onItemRemoved(item: QuickListDemoItem): void {
    // updated items will be available in this.items
  }
}
