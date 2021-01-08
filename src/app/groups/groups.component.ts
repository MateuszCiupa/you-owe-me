import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { DocumentChangeAction } from '@angular/fire/firestore';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Group } from '../core/models/group.model';
import { GroupService } from '../core/services/group.service';
import { CreateGroupDialogComponent } from './create-group-dialog/create-group-dialog.component';
// import { CreateGroupDialogData } from './create-group-dialog/create-group-dialog.model';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
})
export class GroupsComponent implements OnInit, AfterViewInit {
  groups: Group[] = [];
  groupDataSource: MatTableDataSource<Group>;
  displayedColumns: string[] = ['photoURL', 'displayName', 'description', 'memberNo'];
  groupNameControl: FormControl;

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  getMemberNo = (data: Group): string => String(data.userIds.length);

  constructor(private groupService: GroupService, private dialog: MatDialog) {
    this.groupDataSource = new MatTableDataSource<Group>([]);
    this.groupNameControl = new FormControl('');
  }

  ngOnInit(): void {
    this.groupService.getUserGroups().subscribe((data: DocumentChangeAction<Group>[]) => {
      this.groups = data.map((x) => ({ ...x.payload.doc.data(), id: x.payload.doc.id }));
      this.groupDataSource.data = this.groups;
    });
  }

  ngAfterViewInit(): void {
    if (this.paginator && this.sort) {
      this.groupDataSource.paginator = this.paginator;
      this.groupDataSource.sort = this.sort;
    }
  }

  openCreateGroupDialog(): void {
    const dialogRef = this.dialog.open(CreateGroupDialogComponent, {
      width: '600px',
    });
    dialogRef.afterClosed().subscribe((data: Group | '' | undefined) => {
      if (!!data) {
        this.groupService.createGroup(data);
      }
    });
  }

  applyGroupFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.groupDataSource.filter = filterValue.trim().toLowerCase();

    if (this.groupDataSource.paginator) {
      this.groupDataSource.paginator.firstPage();
    }
  }
}
