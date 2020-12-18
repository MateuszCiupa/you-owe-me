import { of } from 'rxjs';

export const authServiceMock = {
  signIn(): void {},
  signUp(): void {},
  googleSignIn(): void {},
  signOut(): void {},
  user$: of(null),
};
