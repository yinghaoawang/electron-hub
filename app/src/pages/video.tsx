import '@livekit/components-styles';
import {
  ControlBar,
  GridLayout,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  VideoConference,
  useTracks
} from '@livekit/components-react';
import { Track } from 'livekit-client';
import { useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch';
import { VideoAPIBody, VideoAPIResData } from '../../../shared/shared-types';

const { VITE_LK_SERVER_URL, VITE_API_URL } = import.meta.env;

export default function VideoPage() {
  const [lkToken, setLkToken] = useState<string | null>(null);
  const fetch = useFetch();

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const body: VideoAPIBody = {
          roomId: 1n
        };
        const res = await fetch(`${VITE_API_URL}/video`, {
          method: 'POST',
          body: JSON.stringify(body)
        });
        const data: VideoAPIResData = await res.json();
        setLkToken(data.lkToken);
      } catch (error) {
        console.error(error);
      }
    };
    fetchToken();
  }, []);
  return (
    <div className='flex page-content'>
      <div className='grow'>
        <div className='flex flex-col h-screen'>
          {lkToken && <LkRoom lkToken={lkToken} />}
          {!lkToken && 'Loading...'}
        </div>
      </div>
    </div>
  );
}

function LkRoom({ lkToken }: { lkToken: string }) {
  return (
    <LiveKitRoom
      video={false}
      audio={false}
      token={lkToken}
      serverUrl={VITE_LK_SERVER_URL}
      // Use the default LiveKit theme for nice styles.
      data-lk-theme='default'
      style={{ height: '100vh' }}
    >
      {/* Your custom component with basic video conferencing functionality. */}
      <MyVideoConference />
      {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
      <RoomAudioRenderer />
      {/* Controls for the user to start/stop audio, video, and screen 
      share tracks and to leave the room. */}
      <ControlBar controls={{ screenShare: false }} />
    </LiveKitRoom>
  );
}

function MyVideoConference() {
  // `useTracks` returns all camera and screen share tracks. If a user
  // joins without a published camera track, a placeholder track is returned.
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true }
      // { source: Track.Source.ScreenShare, withPlaceholder: false }
    ],
    { onlySubscribed: false }
  );
  return (
    <GridLayout
      tracks={tracks}
      style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}
    >
      {/* The GridLayout accepts zero or one child. The child is used
      as a template to render all passed in tracks. */}
      <ParticipantTile />
    </GridLayout>
  );
}
