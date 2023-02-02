import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonexProductListComponent } from './monex-product-list.component';

describe('MonexProductListComponent', () => {
  let component: MonexProductListComponent;
  let fixture: ComponentFixture<MonexProductListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonexProductListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonexProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
