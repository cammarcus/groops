import './App.css';
import { useState, useEffect } from 'react';
import Tile from './components/tile';

function Main() {
    const apiUrl = 'https://ts2pxvn89b.execute-api.us-east-1.amazonaws.com/items';
    const [groops, setGroops] = useState({});
    const [orderedGroopsArray, setOrderedGroopsArray] = useState([]);
    const [groopOneName, setGroopOneName] = useState('');
    const [groopTwoName, setGroopTwoName] = useState('');
    const [groopThreeName, setGroopThreeName] = useState('');
    const [groopFourName, setGroopFourName] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedTiles, setSelectedTiles] = useState([]);
    const [attempt, setAttempt] = useState(0);
    const [attemptsRemaining, setAttemptsRemaining] = useState(4);

    const getGroops = async (groopIdInput) => {
        setLoading(true);
        let getUrl = apiUrl
        if (groopIdInput) {
            getUrl = getUrl + '/' + groopIdInput.toString();
        }
        const response = await fetch(getUrl, {
            method: 'GET'
        })
        const data = await response.json();
        let groops_data = data['Items'][0];
        let groop_one_values_array = groops_data['groop_one_values']['SS']
        let groop_two_values_array = groops_data['groop_two_values']['SS']
        let groop_three_values_array = groops_data['groop_three_values']['SS']
        let groop_four_values_array = groops_data['groop_four_values']['SS']
        let newGroops = {};
        let newOrderedGroopsArray = []
        for (let i = 0; i < groop_one_values_array.length; i++) {
            let currVal = groop_one_values_array[i]
            newGroops = { ...newGroops, [currVal]: 1 };
            newOrderedGroopsArray = [...newOrderedGroopsArray, currVal]
        }
        for (let i = 0; i < groop_two_values_array.length; i++) {
            let currVal = groop_two_values_array[i]
            newGroops = { ...newGroops, [currVal]: 2 };
            newOrderedGroopsArray = [...newOrderedGroopsArray, currVal]
        }
        for (let i = 0; i < groop_three_values_array.length; i++) {
            let currVal = groop_three_values_array[i]
            newGroops = { ...newGroops, [currVal]: 3 };
            newOrderedGroopsArray = [...newOrderedGroopsArray, currVal]
        }
        for (let i = 0; i < groop_four_values_array.length; i++) {
            let currVal = groop_four_values_array[i]
            newGroops = { ...newGroops, [currVal]: 4 };
            newOrderedGroopsArray = [...newOrderedGroopsArray, currVal]
        }
        //TODO: shuffle
        let shuffledOrderedGroopsArray = shuffleArray(newOrderedGroopsArray);
        setGroopOneName(groops_data['groop_one_name']['S'])
        setGroopTwoName(groops_data['groop_two_name']['S'])
        setGroopThreeName(groops_data['groop_three_name']['S'])
        setGroopFourName(groops_data['groop_four_name']['S'])
        setGroops(newGroops);
        setOrderedGroopsArray(shuffledOrderedGroopsArray);
        setLoading(false);
    };

    function shuffleArray(originalArray) {
        // Create a copy of the original array to avoid modifying it directly
        const shuffledArray = [...originalArray];
      
        // Fisher-Yates shuffle algorithm
        for (let i = shuffledArray.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
        }
      
        return shuffledArray;
      }

    const enter = async () => {
        console.log('enter clicked')
        let groopsCounter = [0,0,0,0,0]
        let tileOne = groops[selectedTiles[0]];
        let tileTwo = groops[selectedTiles[1]];
        let tileThree = groops[selectedTiles[2]];
        let tileFour = groops[selectedTiles[3]];
        console.log(groops[tileOne])
        groopsCounter[tileOne] += 1
        groopsCounter[tileTwo] += 1
        groopsCounter[tileThree] += 1
        groopsCounter[tileFour] += 1
        console.log(groopsCounter)
        if (groopsCounter.includes(3)) {
            console.log('One away');
        } else if (groopsCounter.includes(4)) {
            console.log('Got it');
        } else {
            console.log('no')
        }
        //console.log('correct')
        //console.log('one away')
        //console.log('nope')
        setAttempt(attempt + 1);
        setSelectedTiles([]);
    }

    useEffect(() => {
        //TODO: if want random, use null, if not, use the value
        let groopIdInput = 390876;
        getGroops(groopIdInput);

    }, [])

    return (
        <div className="App">
            <p>Groops</p>
            <div>
                {!loading ? (
                <div className="grid grid-cols-4 gap-4" id="tile-container">
                    {orderedGroopsArray.map((key, index) => (
                        <div key={key}>
                            <Tile tilename={key} groopNum={groops[key]} selectedTiles={selectedTiles} setSelectedTiles={setSelectedTiles} attempt={attempt}></Tile>
                        </div>
                    ))}
                </div>
                ) : (
                    <div>
                        loading
                    </div>
                )
                }
            </div>
            <button>shuffle</button>
            <button>new set</button>
            <div>
                {selectedTiles.length === 4 ? (
                    <button onClick={enter}>enter</button>
                ) : (
                    <p>cant click enter</p>
                )}
            </div>
        </div>
    );
}

export default Main;