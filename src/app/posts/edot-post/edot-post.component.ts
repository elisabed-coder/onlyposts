import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Postservice } from 'src/app/posts.service';
import { Post } from '../interfaces/post.interface';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-edot-post',
  templateUrl: './edot-post.component.html',
  styleUrls: ['./edot-post.component.scss'],
})
export class EdotPostComponent implements OnInit {
  @Output() updatePost: EventEmitter<Post> = new EventEmitter<Post>();
  @Output() initialUpdatedPostEmitter: EventEmitter<Post> =
    new EventEmitter<Post>();

  post!: any;
  // postId!: any;
  constructor(
    private route: ActivatedRoute,
    private service: Postservice,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const postId = +params['id'];
      this.post = this.service.getPostById(postId) || {
        id: postId,
        title: '',
        body: '',
      };
    });
  }

  goBack(): void {
    this.router.navigate([`/posts`]);
  }
  postUpdated(): void {
    console.log(this.post);
    this.updatePost.emit(this.post);
    this.goBack();
  }
}
