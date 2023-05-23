import React, { useEffect} from 'react';
import moment from 'moment'
import { useNavigate } from 'react-router-dom';
import {
    removeAuthToken,
    getAuthToken,
    getSocketToken,
  } from "../core/lib/localStorage";

const IdleTimeOutHandler = (props)=>{
    let timer=undefined;

    const navigate = useNavigate();
    
    const events= ['click','scroll','load','keydown']
    const eventHandler =(eventType)=>{
        localStorage.setItem('lastInteractionTime',moment() )
        if(timer){
            props.onActive();
            startTimer();
        }
    };
    
    useEffect(()=>{
        addEvents();
        
        return (()=>{
            
            removeEvents();
        })
    },[])
    
    const startTimer=()=>{
        timer=setTimeout(async ()  =>{
            
            let lastInteractionTime=localStorage.getItem('lastInteractionTime')
            const diff = moment.duration(moment().diff(moment(lastInteractionTime)));
            //let timeOutInterval=props.timeOutInterval?props.timeOutInterval:600000;
            let timeOutInterval=props.timeOutInterval?props.timeOutInterval:24 * 60 * 60 * 1000;
            
            if(diff._milliseconds<timeOutInterval){
                startTimer();
                props.onActive();
            }else{
                navigate('/login');
                props.onIdle();
                await removeAuthToken();
            }
        },props.timeOutInterval?props.timeOutInterval:6000)
        
    }
    const addEvents=()=>{
        
        events.forEach(eventName=>{
            window.addEventListener(eventName,eventHandler)
        })
        
        startTimer();
    }
    
    const removeEvents=()=>{
        events.forEach(eventName=>{
            window.removeEventListener(eventName,eventHandler)
        })
    };
    
    return(
        <div></div>
        )
        
    }
    
    export default IdleTimeOutHandler;