import { Observable, of } from 'rxjs';

export const friendServiceMock = {
  getFriends(): Observable<[]> {
    return of([]);
  },
};
