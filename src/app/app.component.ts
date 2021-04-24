import { Component, OnInit } from '@angular/core';
import { AgoraService } from './services/agora.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'agora-box';

  constructor(private agora: AgoraService) {}

  ngOnInit(): void {
    this.append();
  }

  append() {
    this.agora.rtc.client.on('user-published', async (user, mediaType) => {
      // Subscribe to a remote user.
      await this.agora.rtc.client.subscribe(user, mediaType);
      console.log('subscribe success');

      // If the subscribed track is video.
      if (mediaType === 'video') {
        // Get `RemoteVideoTrack` in the `user` object.
        const remoteVideoTrack = user.videoTrack;
        // Dynamically create a container in the form of a DIV element for playing the remote video track.
        const playerContainer = document.createElement('div');
        // Specify the ID of the DIV container. You can use the `uid` of the remote user.
        playerContainer.id = user.uid.toString();
        playerContainer.style.width = '640px';
        playerContainer.style.height = '480px';
        document.body.append(playerContainer);

        // Play the remote video track.
        // Pass the DIV container and the SDK dynamically creates a player in the container for playing the remote video track.
        remoteVideoTrack.play(playerContainer);

        // Or just pass the ID of the DIV container.
        // remoteVideoTrack.play(playerContainer.id);
      }

      // If the subscribed track is audio.
      if (mediaType === 'audio') {
        // Get `RemoteAudioTrack` in the `user` object.
        const remoteAudioTrack = user.audioTrack;
        // Play the audio track. No need to pass any DOM element.
        remoteAudioTrack.play();
      }
    });
  }
}
