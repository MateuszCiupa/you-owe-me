import { Pipe, PipeTransform } from '@angular/core';
import { DocumentChangeAction } from '@angular/fire/firestore';

@Pipe({ name: 'fdoc' })
export class FirestoreDocPipe implements PipeTransform {
  transform(value: DocumentChangeAction<any> | DocumentChangeAction<any>[] | null): any | null {
    if (!value) {
      return value;
    } else if (Array.isArray(value)) {
      return value.map((x) => x.payload.doc.data());
    } else {
      return value.payload.doc.data();
    }
  }
}
