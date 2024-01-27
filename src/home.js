import './App.css';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";

function Home() {

    const navigate = useNavigate();
    const getUrl = 'https://ts2pxvn89b.execute-api.us-east-1.amazonaws.com/items';
    const [userEnteredID, setUserEnteredID] = useState(0);

    const rerouteToRandomID = async () => {
        let rerouteId = '/error';
        const response = await fetch(getUrl, {
            method: 'GET'
        })
        const data = await response.json();
        rerouteId = data.toString();
        navigate(rerouteId);
    }

    const rerouteWithEnteredID = async (rerouteId) => {
        navigate(rerouteId);
    }


    return (
        <div>
            <p>Welcome to Groops</p>
            <button onClick={rerouteToRandomID}>Click to play</button>
            <input title='Enter id'></input>
            <button onClick={() => {rerouteWithEnteredID(userEnteredID)}}>Submit</button>


        </div>
    );
}

export default Home;