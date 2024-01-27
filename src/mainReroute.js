import './App.css';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";

function MainReroute() {

    const navigate = useNavigate();
    const getUrl = 'https://ts2pxvn89b.execute-api.us-east-1.amazonaws.com/items';

    useEffect(() => {
        rerouteToRandomID();
      }, []);

      const rerouteToRandomID = async () => {
        let rerouteId = '/error';
        const response = await fetch(getUrl, {
            method: 'GET'
        })
        const data = await response.json();
        rerouteId = data.toString();
        navigate(rerouteId);
      }

    return (
        <div>loading</div>
    );
}

export default MainReroute;