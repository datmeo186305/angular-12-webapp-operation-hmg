import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SystemRoutes } from './system-routing.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(SystemRoutes)],
})
export class SystemModule {}
