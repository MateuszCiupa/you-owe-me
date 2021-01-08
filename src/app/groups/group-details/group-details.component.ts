import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Group } from 'src/app/core/models/group.model';
import { GroupService } from 'src/app/core/services/group.service';

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.scss'],
})
export class GroupDetailsComponent implements OnInit {
  group: Group | null = null;

  constructor(private groupService: GroupService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(({ groupId }) => {
      if (groupId) {
        this.groupService.getGroupDetails(groupId).subscribe((group) => {
          this.group = group;
        });
      }
    });
  }

  openAddGroupMemberDialog(): void {}
}
