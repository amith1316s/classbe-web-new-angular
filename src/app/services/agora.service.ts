import { Injectable } from '@angular/core';
import AgoraRTC, { IAgoraRTCClient } from 'agora-rtc-sdk-ng';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AgoraService {
  rtc = {
    // For the local client.
    client: null,
    // For the local audio and video tracks.
    localAudioTrack: null,
    localVideoTrack: null,
  };

  constructor() {
    this.rtc.client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
  }

  async startBasicCall() {
    const uid = await this.rtc.client.join(
      environment.agora.appId,
      environment.agora.channel,
      environment.agora.token,
      null
    );

    try {
      // Create an audio track from the audio sampled by a microphone.
      this.rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    } catch (error) {
      console.log('Audio error', error);
    }

    try {
      // Create a video track from the video captured by a camera.
      this.rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
    } catch (error) {
      console.log('Video error', error);
    }

    // Publish the local audio and video tracks to the channel.
    try {
      const tracks = [];
      if (this.rtc.localAudioTrack) {
        tracks.push(this.rtc.localAudioTrack);
      }
      if (this.rtc.localVideoTrack) {
        tracks.push(this.rtc.localVideoTrack);
      }
      await this.rtc.client.publish(tracks);
    } catch (error) {
      console.log('Publish error', error);
    }

    console.log('publish success!');
  }

  // onRemote() {
  //   return this.rtc.client.on(
  //     'user-published',
  //     async (user: any, mediaType: string) => {
  //       // Subscribe to a remote user.
  //       await this.rtc.client.subscribe(user, mediaType);
  //       console.log('subscribe success');

  //       return {
  //         user,
  //         mediaType,
  //       };
  //     }
  //   );
  // }
}
