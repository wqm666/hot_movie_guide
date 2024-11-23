import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageComponent } from './manage/manage.component';
import { AdminRoutingModule } from './admin-routing.module';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';  // 确保导入 FormsModule 以便使用 ngModel

@NgModule({
  declarations: [
    ManageComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    RouterModule,
    FormsModule  // 导入 FormsModule
  ]
})
export class AdminModule { }
