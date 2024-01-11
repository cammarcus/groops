import './App.css';
import { useState, useEffect } from 'react';
import Tile from './components/tile';

function Main() {
    const apiUrl = 'https://ts2pxvn89b.execute-api.us-east-1.amazonaws.com/items/';
    const [groops, setGroops] = useState({"hi":0, "why": 1, "bye":2, "arg":3, "h":0, "whyf": 1, "hiff":2, "whffy":3, "hffi":0, "whdy": 1, "hdsdi":2, "whdsfdy":3, "hvvi":0, "whyd": 1, "hiddd":2, "whfdfy":3});
    const [groopOneName, setGroopOneName] = useState('')
    const [groopTwoName, setGroopTwoName] = useState('')
    const [groopThreeName, setGroopThreeName] = useState('')
    const [groopFourName, setGroopFourName] = useState('')

    const getGroops = async (groopIdInput) => {
        let groopId = groopIdInput;
        groopId = groopId.toString()
        const getUrl = apiUrl + groopId;
        const response = await fetch(getUrl, {
            method: 'GET'
        })
        const data = await response.json();
        console.log('Data:', data['Items'][0]);
        let groops_data = data['Items'][0];
        let groop_one_values_array = groops_data['groop_one_values']['SS']
        let groop_two_values_array = groops_data['groop_two_values']['SS']
        let groop_three_values_array = groops_data['groop_three_values']['SS']
        let groop_four_values_array = groops_data['groop_four_values']['SS']
        let newGroops = { };
        for (let i = 0; i < groop_one_values_array.length; i++) {
            let currVal = groop_one_values_array[i]
            newGroops = { ...newGroops, [currVal]: 1 };
        }
        for (let i = 0; i < groop_two_values_array.length; i++) {
            let currVal = groop_two_values_array[i]
            newGroops = { ...newGroops, [currVal]: 2 };
        }
        for (let i = 0; i < groop_three_values_array.length; i++) {
            let currVal = groop_three_values_array[i]
            newGroops = { ...newGroops, [currVal]: 3 };
        }
        for (let i = 0; i < groop_four_values_array.length; i++) {
            let currVal = groop_four_values_array[i]
            newGroops = { ...newGroops, [currVal]: 4 };
        }
        //TODO: shuffle
        setGroopOneName(groops_data['groop_one_name']['S'])
        setGroopTwoName(groops_data['groop_two_name']['S'])
        setGroopThreeName(groops_data['groop_three_name']['S'])
        setGroopFourName(groops_data['groop_four_name']['S'])
        setGroops(newGroops)
    };

    useEffect(()=> {
        let groopIdInput = 34;
        getGroops(groopIdInput);
    },[])

    return (
        <div className="App">
            <p>Groops</p>
            <div className="grid grid-cols-4 gap-4" id="tile-container">
                {Object.entries(groops).map(([key, value]) => (
                    <div key={key}>
                        <Tile tilename={key}></Tile>
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