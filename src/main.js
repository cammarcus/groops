import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import Tile from './components/tile';

function Main() {
    const apiUrl = 'https://ts2pxvn89b.execute-api.us-east-1.amazonaws.com/items/';
    const [groops, setGroops] = useState(['hi', 'hi', 'hi', 'hi', 'hi', 'hi', 'hi', 'hi', 'hi', 'hi', 'hi', 'hi', 'hi', 'hi', 'hi', 'hi']);

    const getGroops = async (groopIdInput) => {
        let groopId = groopIdInput;
        groopId = groopId.toString()
        const getUrl = apiUrl + groopId;
        const response = await fetch(getUrl, {
            method: 'GET'
        })
        console.log(response)
        const data = await response.json();
        console.log('Data:', data['Items'][0]);
    };

    useEffect(()=> {
        let groopIdInput = 34;
        getGroops(groopIdInput);
    },[])

    return (
        <div className="App">
            <div className="grid grid-cols-4 gap-4" id="tile-container">
                {groops.map((item, index) => (
                    <div key={index}>
                        <Tile tilename={item}></Tile>
                    </div>
                ))}
            </div>
            <button>shuffle</button>
            <button>new set</button>
            <button>enter</button>
        </div>
    );
}

export default Main;