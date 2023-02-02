import { Component, Input, OnInit } from '@angular/core';
import { NAV_ITEM } from '../../../../core/common/enum/operator';
import { MenuItemModel } from '../../../../public/models/external/menu-item.model';

@Component({
  selector: 'app-desktop-menu',
  templateUrl: './desktop-menu.component.html',
  styleUrls: ['./desktop-menu.component.scss'],
})
export class DesktopMenuComponent implements OnInit {
  @Input() menuItems: MenuItemModel[];
  @Input() selectedNavItem: NAV_ITEM;

  constructor() {}

  ngOnInit(): void {}
}
