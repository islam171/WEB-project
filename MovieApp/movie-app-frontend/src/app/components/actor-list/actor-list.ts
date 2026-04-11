import { Component } from '@angular/core';
import { ActorItem } from '../actor-item/actor-item';

@Component({
  selector: 'app-actor-list',
  imports: [ActorItem],
  templateUrl: './actor-list.html',
  styleUrl: './actor-list.css',
})
export class ActorList {
  actors = [
    {
      id: '1',
      name: 'Actor 1',
      img: 'https://avatars.mds.yandex.net/get-kinopoisk-image/4486362/3b9759cf-6c81-4f6c-92f3-c44f25621e35/280x420',
    },
    {
      id: '1',
      name: 'Actor 1',
      img: 'https://avatars.mds.yandex.net/get-kinopoisk-image/4486362/3b9759cf-6c81-4f6c-92f3-c44f25621e35/280x420',
    },
    {
      id: '1',
      name: 'Actor 1',
      img: 'https://avatars.mds.yandex.net/get-kinopoisk-image/4486362/3b9759cf-6c81-4f6c-92f3-c44f25621e35/280x420',
    },
    {
      id: '1',
      name: 'Actor 1',
      img: 'https://avatars.mds.yandex.net/get-kinopoisk-image/4486362/3b9759cf-6c81-4f6c-92f3-c44f25621e35/280x420',
    },
  ];
}
