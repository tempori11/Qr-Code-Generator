import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { AddBalancePage } from './add-balance.page';
import { AddBalancePageRoutingModule } from './add-balance-routing.module';

@NgModule({
  declarations: [AddBalancePage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddBalancePageRoutingModule,
    ReactiveFormsModule,
  ],
})
export class AddBalancePageModule {}
