export interface ISocketMessage {
  message: string;
  token: string;
}

export interface ISocketResponse {
  message: string;
  senderId: string;
  senderInitial: string;
}