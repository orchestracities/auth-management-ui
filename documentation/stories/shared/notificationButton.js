import Button from '@mui/material/Button';
import React from 'react';
import useNotification from "../../../src/components/shared/messages/alerts";



export default function ButtonToChip ({type,message}){
    const [msg, sendNotification] = useNotification();
    console.log(msg)

    return (<Button variant="text" onClick={()=> sendNotification({msg:message, variant: type})}>Show Notification</Button>)
}