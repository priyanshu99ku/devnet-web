import { io } from 'socket.io-client';
import { API_URL } from './constants';

const socket = io(API_URL, {
  autoConnect: false, // Only connect when needed
  transports: ['websocket'],
});

export default socket; 