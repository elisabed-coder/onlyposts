import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Post } from '../interfaces/post.interface';
import { Postservice } from 'src/app/posts.service';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.scss'],
})
export class AddPostComponent implements OnInit {
  @Output()
  CloseForm: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  EmitTaskData: EventEmitter<Post> = new EventEmitter<Post>();

  constructor(private postservice: Postservice) {}

  ngOnInit(): void {}

  OnCloseForm() {
    this.CloseForm.emit(false);
  }

  OnFormSubmitted(form: NgForm) {
    this.postservice.CreateTask(form.value);
    this.EmitTaskData.emit(form.value);
    this.OnCloseForm();
  }
}
