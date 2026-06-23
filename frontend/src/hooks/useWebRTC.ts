import { useEffect, useRef, useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

interface PeerConnection {
  socketId: string;
  pc: RTCPeerConnection;
}

export const useWebRTC = (roomId: string, isHost: boolean) => {
  const { socket } = useSocket();
  const { user } = useAuth();
  
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string>('');

  const localStreamRef = useRef<MediaStream | null>(null);
  const peersRef = useRef<PeerConnection[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Public Google STUN servers
  const iceServers = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  };

  useEffect(() => {
    if (!socket || !user) return;

    // We join the room here
    socket.emit('wt-join-room', { roomId, isHost });

    socket.on('wt-room-info', () => {
      // If we are host, we need to create peer connections for existing viewers? 
      // Actually, standard mesh is: Viewers wait for host to offer.
    });

    socket.on('wt-user-joined', async (participant) => {
      if (isHost && localStreamRef.current) {
        // Create peer connection for the new viewer and send offer
        createPeerAndOffer(participant.socketId, localStreamRef.current);
      }
    });

    socket.on('wt-user-left', ({ socketId }) => {
      const pcObj = peersRef.current.find(p => p.socketId === socketId);
      if (pcObj) {
        pcObj.pc.close();
        peersRef.current = peersRef.current.filter(p => p.socketId !== socketId);
      }
    });

    socket.on('wt-offer', async ({ senderSocketId, offer }) => {
      if (!isHost) {
        // Viewer receives offer from Host
        const pc = createPeerConnection(senderSocketId);
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit('wt-answer', { targetSocketId: senderSocketId, answer });
      }
    });

    socket.on('wt-answer', async ({ senderSocketId, answer }) => {
      if (isHost) {
        const pcObj = peersRef.current.find(p => p.socketId === senderSocketId);
        if (pcObj) {
          await pcObj.pc.setRemoteDescription(new RTCSessionDescription(answer));
        }
      }
    });

    socket.on('wt-ice-candidate', ({ senderSocketId, candidate }) => {
      const pcObj = peersRef.current.find(p => p.socketId === senderSocketId);
      if (pcObj && candidate) {
        pcObj.pc.addIceCandidate(new RTCIceCandidate(candidate)).catch(e => console.error(e));
      }
    });

    socket.on('wt-stream-status', ({ isStreaming: status }) => {
      if (!isHost) {
        setIsStreaming(status);
        if (status) {
          socket.emit('wt-request-offer', { roomId });
        } else {
          setRemoteStream(null);
        }
      }
    });

    socket.on('wt-request-offer', ({ viewerSocketId }) => {
      if (isHost && localStreamRef.current) {
        createPeerAndOffer(viewerSocketId, localStreamRef.current);
      }
    });

    return () => {
      socket.emit('wt-leave-room', { roomId });
      socket.off('wt-room-info');
      socket.off('wt-user-joined');
      socket.off('wt-user-left');
      socket.off('wt-offer');
      socket.off('wt-answer');
      socket.off('wt-ice-candidate');
      socket.off('wt-stream-status');
      socket.off('wt-request-offer');
      
      stopStream();
    };
  }, [socket, user, roomId, isHost]);

  const createPeerConnection = (targetSocketId: string, streamToHost?: MediaStream) => {
    const pc = new RTCPeerConnection(iceServers);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.emit('wt-ice-candidate', { targetSocketId, candidate: event.candidate });
      }
    };

    pc.ontrack = (event) => {
      if (!isHost) {
        setRemoteStream(event.streams[0]);
      }
    };

    if (streamToHost) {
      streamToHost.getTracks().forEach(track => {
        pc.addTrack(track, streamToHost);
      });
    }

    peersRef.current.push({ socketId: targetSocketId, pc });
    return pc;
  };

  const createPeerAndOffer = async (targetSocketId: string, stream: MediaStream) => {
    const pc = createPeerConnection(targetSocketId, stream);
    const offer = await pc.createOffer({ offerToReceiveVideo: false, offerToReceiveAudio: false });
    await pc.setLocalDescription(offer);
    socket?.emit('wt-offer', { targetSocketId, offer });
  };

  const startScreenShare = async () => {
    if (!isHost) return;
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: { ideal: 1920, max: 1920 },
          height: { ideal: 1080, max: 1080 },
          frameRate: { ideal: 30, max: 60 }
        },
        audio: true
      });

      localStreamRef.current = stream;
      setLocalStream(stream);
      setIsStreaming(true);
      socket?.emit('wt-stream-status', { roomId, isStreaming: true });

      // When user clicks "Stop sharing" on the browser bar
      stream.getVideoTracks()[0].onended = () => {
        stopStream();
      };

      // Connect to all currently connected peers
      // Note: We'd need to ask the server for current participants if we didn't track them, 
      // but in this simplified mesh, we'll wait for viewers to request or we broadcast to known.
      // A better way is: host tells room "I started streaming", viewers request offer.
      // But for simplicity, we just say streaming started. Viewers will reconnect or we just rely on new joins.
      // Wait, we need to send offers to all existing peers.
      // Since we don't have the list of sockets readily available here, let's just trigger a reload or rely on socket events.
      // For MVP, viewers who are already in room will need to refresh, OR we can emit 'wt-stream-started' and have viewers emit 'wt-request-offer'.
    } catch (err: any) {
      setError(err.message || 'Failed to capture screen');
    }
  };

  const stopStream = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
      setLocalStream(null);
    }
    peersRef.current.forEach(p => p.pc.close());
    peersRef.current = [];
    setIsStreaming(false);
    if (isHost) {
      socket?.emit('wt-stream-status', { roomId, isStreaming: false });
    }
  };

  return {
    startScreenShare,
    stopStream,
    localStream,
    remoteStream,
    isStreaming,
    error,
    videoRef
  };
};
