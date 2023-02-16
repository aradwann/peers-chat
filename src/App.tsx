import { useEffect, useState } from 'react'
import './App.css'
import { ClientTypeForm } from './components/ClientTypeForm';
import { LocalView } from './components/local-components/LocalView';
// import { MessageForm } from './components/MessageForm';
// import { MessageList } from './components/MessageList';
// import { Message } from './typing/interfaces';

import { RemoteView } from './components/remote-components/RemoteView';
import { MessageSender } from './typing/enums';



function App() {

  const configuration = { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }] }
  const pc = new RTCPeerConnection(configuration);

  const [clientType, setClientType] = useState<MessageSender>()
  const [connectionState, setConnectionState] = useState(pc.connectionState)
  // const [isConnectBtnDisabled, setConnectBtnDisabled] = useState(false)
  // const [messages, setMessages] = useState<Array<Message>>([])
  //////////////////////////////////////////////////// local ///////////////////////////////
  // configure event listeners for connection state  
  pc.onconnectionstatechange = e => setConnectionState(pc.connectionState)

  pc.oniceconnectionstatechange = e => console.log("local ICE state", pc.iceConnectionState);


  // create data channel for local peer
  if (clientType === MessageSender.local) {
    const sendChannel = pc.createDataChannel("sendChannel");
    sendChannel.onopen = (e) => {
      console.log('sendChannel opened', sendChannel)

    };
    sendChannel.onmessage = (event) => console.log('message receive on local', event.data)

    sendChannel.onclose = (e) => {
      console.log('sendChannel closed on local peer');
    };


  }
  ///////////////////////////////////////////// remote //////////////////////////////////////////////


  if (clientType === MessageSender.remote) {


    // remote data channel event listener
    pc.ondatachannel = (event) => {
      const receiveChannel = event.channel
      receiveChannel.onopen = (e) => {
        console.log('connection OPENED')

      };
      receiveChannel.onmessage = (event) => console.log('message receive on remote', event.data)
    }
  }


  // function handleSend(message: Message) {
  //   sendChannel.send(message.data)
  //   setMessages([...messages, message])
  // }

  // useEffect(() => {
  //   if (connectionState === 'connected') {
  //     setConnectBtnDisabled(true)
  //   } else if (connectionState === 'closed') {
  //     setConnectBtnDisabled(false)
  //   }
  // }, [connectionState])

  return (
    <div className="App">

      <h1>Peers</h1>
      <ClientTypeForm setClientType={(messageSender: MessageSender) => { setClientType(messageSender) }} />
      {clientType ? <h3>you are now the {clientType}</h3> : <></>}

      {
        clientType === MessageSender.local &&
        <LocalView pc={pc} />
      }
      {
        clientType === MessageSender.remote &&
        <RemoteView pc={pc} />
      }



      <div className="card">
        <h3>connection state is {connectionState}</h3>
      </div>

      {/* <MessageForm disabled={!isConnectBtnDisabled} handleSend={handleSend} />
      <MessageList messages={messages} /> */}
    </div >
  )
}

export default App
