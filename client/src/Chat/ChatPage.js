import React, { useEffect,useState } from 'react';
import { Button, Grid } from 'semantic-ui-react';
import MessagesContainer from './MessagesContainer';
import './ChatPage.css';
import io from 'socket.io-client';

const CONNECTION_PORT = "http://localhost:8080";   
let socket

function ChatPage() {
    const [messages, setMessage] = useState("");
    const [messagesList, setMessageList] = useState([]);
    const [sender,setSender] = useState("");
    const [content,setContent] = useState("");
    useEffect(()=> {
        socket = io(CONNECTION_PORT);
        console.log('CONNECTION_PORT');
    },[CONNECTION_PORT]);
    useEffect(()=> {
        fetch(`${CONNECTION_PORT}/api/message`,{method: "GET"})
        .then((res) => {
            return res.json();})
        .then((resJson) => {
            setMessageList(resJson);})
        .catch((err) => {
            console.log(err);});
        console.log('FETCH ALL MESSAGES FROM MONGO',messagesList)
    },[]);
    useEffect(()=>{
        socket.on("new-message-backend", async (message) => {
            setMessageList([...messagesList,message]);
            // setMessage(message);
        });
        // setMessageList([...messagesList,messages]);
        console.log("add message from backend to messageList");
    },[messagesList]);
    // console.log("messages",messages);
    // console.log("messagesList",messagesList)
    function handleSubmit(e) {
        e.preventDefault();
        let reqBody = {
            sender: sender,
            content: content
        }
        fetch(`${CONNECTION_PORT}/api/message`, 
        {
            method: "POST",
            headers: {"content-type": "application/json"},
            body: JSON.stringify(reqBody)
        })
            .then((res) => {
                return res.json();})
            .then((resJson) => {
                socket.emit("new-message-front", resJson);})
            .catch((err) => {
                console.log(err);});
        console.log("Sending message TO Backend")
        setSender("");
        setContent("");
    };
    return(
            <Grid>
                <Grid.Column className="left-container" width={4} />
                <Grid.Column width={8}>
                    <Grid.Row className="messages-container">
                        <h2>Group Chat Room</h2>
                        <MessagesContainer messages={messagesList}/>
                    </Grid.Row>
                    <Grid.Row className="input-container">
                    <h3>Write messages</h3>
                    <form onSubmit={handleSubmit}>
                        <input type="text" placeholder="name" value={sender} onChange={(e)=>setSender(e.target.value)} required/>
                        <input type="text" placeholder="type your message here" value={content} onChange={(e)=>setContent(e.target.value)} required/>
                        <button type="submit">Submit</button>
                    </form>
                    </Grid.Row>
                </Grid.Column>
                <Grid.Column className="right-container" width={4} />
            </Grid>
    );
}
export default ChatPage;





