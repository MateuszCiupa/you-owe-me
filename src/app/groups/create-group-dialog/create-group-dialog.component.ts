import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DocumentChangeAction } from '@angular/fire/firestore';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Group } from 'src/app/core/models/group.model';

import { User } from 'src/app/core/models/user.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { FriendService } from 'src/app/core/services/friend.service';

@Component({
  selector: 'app-create-group-dialog',
  templateUrl: './create-group-dialog.component.html',
  styleUrls: ['./create-group-dialog.component.scss'],
})
export class CreateGroupDialogComponent implements OnInit {
  user: User | null = null;
  friends$: Observable<DocumentChangeAction<User>[]>;
  groupControl: FormGroup;
  groupUsers: User[] = [];
  friendControl: FormControl;

  @ViewChild('friendInput') friendInput?: ElementRef<HTMLInputElement>;

  constructor(
    private dialogRef: MatDialogRef<CreateGroupDialogComponent>,
    private authService: AuthService,
    private friendService: FriendService,
    private fb: FormBuilder
  ) {
    this.friends$ = this.friendService.getFriends();
    this.friendControl = new FormControl('');
    this.groupControl = this.fb.group({
      displayName: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      description: ['', [Validators.maxLength(100)]],
    });
  }

  ngOnInit(): void {
    this.authService.user$.subscribe((user: User | null | undefined) => {
      if (!!user) {
        this.user = user;
        this.groupUsers.push(user);
      }
    });
  }

  get displayNameControl(): FormControl {
    return this.groupControl.get('displayName') as FormControl;
  }

  get descriptionControl(): FormControl {
    return this.groupControl.get('description') as FormControl;
  }

  removeGroupUser(uid: string): void {
    this.groupUsers = this.groupUsers.filter((x) => x.uid !== uid);
  }

  friendSelected(event: MatAutocompleteSelectedEvent): void {
    this.groupUsers.push(event.option.value);
    this.friendControl.reset('');
    if (this.friendInput) {
      this.friendInput.nativeElement.value = '';
    }
  }

  isFriendFiltered(friend: User): boolean {
    const isFilteredByInput = !(friend.displayName.toLowerCase().indexOf(this.friendControl.value.toLowerCase()) >= 0);
    const isFilteredByArray = !!this.groupUsers.find((x) => x.uid === friend.uid);
    return isFilteredByInput || isFilteredByArray;
  }

  onSubmit(): void {
    if (this.groupControl.valid) {
      const data: Group = {
        ...this.groupControl.value,
        userIds: this.groupUsers.map((x) => x.uid),
        date: new Date(),
      };
      this.dialogRef.close(data);
    }
  }
}
