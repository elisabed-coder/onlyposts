import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from '../interfaces/post.interface';
import { NgForm } from '@angular/forms';
import { Postservice } from 'src/app/posts.service';

@Component({
  selector: 'app-edot-post',
  templateUrl: './edot-post.component.html',
  styleUrls: ['./edot-post.component.scss'],
})
export class EdotPostComponent implements OnInit {
  post: Post | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postservice: Postservice
  ) {}

  ngOnInit(): void {
    const routeId = this.route.snapshot.paramMap.get('id');
    if (routeId) {
      const postId = parseInt(routeId, 10);
      this.postservice.getPostById(postId).subscribe((post) => {
        this.post = post;
      });
    }
  }
  goBack(): void {
    this.router.navigate([`/posts`]);
  }
  saveChanges() {
    console.log(this.post);
    this.postservice.updatePost(this.post);
    //   console.log('Post updated successfully');
    // });
    this.goBack();
  }
}
