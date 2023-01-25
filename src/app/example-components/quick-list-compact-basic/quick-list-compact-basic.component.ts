import { Component } from '@angular/core';
import { QuickListItem } from '@porscheinformatik/material-addons/lib/quick-list/base-quick-list.component';

interface QuickListDemoItem extends QuickListItem {
  firstName: string;
  lastName: string;
}

@Component({
  selector: 'app-quick-list-compact',
  templateUrl: './quick-list-compact-basic.component.html',
  styleUrls: ['./quick-list-compact-basic.component.scss', '../../flex-utility.scss'],
})
export class QuickListCompactBasicComponent {
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
