import { AccessToken, TrackSource } from 'livekit-server-sdk';

const { LK_API_KEY, LK_API_SECRET } = process.env;

export const createLKToken = ({
  roomName,
  participantName
}: {
  roomName: string; // if this room doesn't exist, it'll be automatically created when the first client joins
  participantName: string; // identifier to be used for participant. it's available as LocalParticipant.identity with livekit-client SDK
}) => {
  const at = new AccessToken(LK_API_KEY, LK_API_SECRET, {
    identity: participantName
  });
  at.addGrant({
    roomJoin: true,
    room: roomName
    // canPublishSources: [TrackSource.CAMERA, TrackSource.MICROPHONE]
  });

  return at.toJwt();
};
