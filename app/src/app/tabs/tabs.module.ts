import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabsPage } from './tabs.page';
import { TabsRoutingModule } from './tabs.router.module';
import { AgmCoreModule } from '@agm/core';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabsRoutingModule,
    AgmCoreModule
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
