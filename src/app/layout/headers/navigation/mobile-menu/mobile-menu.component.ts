import { Component, Input, OnInit } from '@angular/core';
import { NAV_ITEM } from '../../../../core/common/enum/operator';
import { MenuItemModel } from '../../../../public/models/external/menu-item.model';

@Component({
  selector: 'app-mobile-menu',
  templateUrl: './mobile-menu.component.html',
  styleUrls: ['./mobile-menu.component.scss'],
})
export class MobileMenuComponent implements OnInit {
  @Input() menuItems: MenuItemModel[];
  @Input() selectedNavItem: NAV_ITEM;

  constructor() {}

  ngOnInit(): void {}
}
