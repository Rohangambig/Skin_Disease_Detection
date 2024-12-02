import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import io from 'socket.io-client';
import './Index.css';
import Peer from 'peerjs';

const Index = () => {
    const { roomId } = useParams();
    const videoGrid = useRef(null); // Store reference to the video grid
    const localStream = useRef(null); // Store local stream
    const myPeerId = useRef(null); // Store local peer ID
    const localVideoAdded = useRef(false); // Flag to check if local video is already added
    const [peers, setPeers] = useState({}); // Store peer connections
    const socket = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        socket.current = io('http://localhost:2463');

        const peer = new Peer(undefined, {
            host: '/',
            port: '2463',
        });

        peer.on('open', (id) => {
            myPeerId.current = id;
            socket.current.emit('join-room', roomId, id);
        });

        navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((stream) => {
                localStream.current = stream;

                // Add local video only once
                if (!localVideoAdded.current) {
                    const myVideo = createVideoElement();
                    addVideoStream(myVideo, stream, myPeerId.current);
                    localVideoAdded.current = true;
                }

                peer.on('call', (call) => {
                    if (call.peer === myPeerId.current) return; // Ignore calls to self
                    call.answer(stream);
                    const video = createVideoElement();
                    call.on('stream', (userVideoStream) => {
                        addVideoStream(video, userVideoStream, call.peer);
                    });
                });

                socket.current.on('user-connected', (userId) => {
                    if (userId === myPeerId.current) return; // Ignore self
                    connectToNewUser(userId, stream, peer);
                });

                socket.current.on('user-disconnected', (userId) => {
                    if (peers[userId]) {
                        peers[userId].close();
                        removeVideoStream(userId);
                    }
                });

                socket.current.on('all-users', (users) => {
                    users.forEach((userId) => {
                        if (userId === myPeerId.current) return; // Ignore self
                        connectToNewUser(userId, stream, peer);
                    });
                });
            })
            .catch((err) => {
                console.error('Error accessing media devices: ', err);
            });

        return () => {
            socket.current.disconnect();
            if (localStream.current) {
                localStream.current.getTracks().forEach(track => track.stop());
            }
        };
    }, [roomId]);

    const createVideoElement = () => {
        const video = document.createElement('video');
        video.muted = true;
        video.playsInline = true;
        return video;
    };

    const addVideoStream = (video, stream, peerId) => {
        if (videoGrid.current.querySelector(`[data-peer-id="${peerId}"]`)) return; // Prevent duplicate videos
        video.srcObject = stream;
        video.addEventListener('loadedmetadata', () => {
            video.play().catch(e => console.error('Error playing video:', e));
        });
        video.setAttribute('data-peer-id', peerId);
        videoGrid.current.appendChild(video);
    };

    const removeVideoStream = (userId) => {
        const video = videoGrid.current.querySelector(`[data-peer-id="${userId}"]`);
        if (video) {
            video.remove();
        }
    };

    const connectToNewUser = (userId, stream, peer) => {
        const call = peer.call(userId, stream);
        const video = createVideoElement();
        call.on('stream', (userVideoStream) => {
            addVideoStream(video, userVideoStream, userId);
        });
        call.on('close', () => {
            removeVideoStream(userId);
        });

        setPeers(prevPeers => ({
            ...prevPeers,
            [userId]: call,
        }));
    };

    return (
        <div className="room-container">
            <div className="room-header">
                <h1>Room: {roomId}</h1>
                <div className="controls">
                    <button className="control-btn"><i className='bx bxs-volume-mute'></i></button>
                    <button className="control-btn disabled"><i className='bx bx-log-out'></i></button>
                </div>
            </div>
            <div ref={videoGrid} className="video-grid"></div>
        </div>
    );
};

export default Index;
