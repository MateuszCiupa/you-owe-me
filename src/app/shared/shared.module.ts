import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { FirestoreDocPipe } from './pipes/firestore-doc.pipe';

@NgModule({
  declarations: [FirestoreDocPipe],
  imports: [CommonModule],
  exports: [FirestoreDocPipe, FlexLayoutModule],
})
export class SharedModule {}
