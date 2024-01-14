import './App.css';
import { useState, useEffect } from 'react';
import Tile from './components/tile';
import { GoDotFill } from "react-icons/go";
import { motion, useAnimation } from 'framer-motion';

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
    const [newSetModalOpen, setNewSetModalOpen] = useState(false);

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

    const shuffleGroops = () => {
        let shuffledOrderedGroopsArray = shuffleArray(orderedGroopsArray);
        setOrderedGroopsArray(shuffledOrderedGroopsArray);
    }

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
        let groopsCounter = [0, 0, 0, 0, 0]
        let tileOne = groops[selectedTiles[0]];
        let tileTwo = groops[selectedTiles[1]];
        let tileThree = groops[selectedTiles[2]];
        let tileFour = groops[selectedTiles[3]];
        groopsCounter[tileOne] += 1
        groopsCounter[tileTwo] += 1
        groopsCounter[tileThree] += 1
        groopsCounter[tileFour] += 1
        if (groopsCounter.includes(3)) {
            //TODO: add one away graphic
            oneAway();
        } else if (groopsCounter.includes(4)) {
            console.log('correct')
            correct();
        } else {
            wrong();
        }
        setAttempt(attempt + 1);
    }

    const correct = async () => {
        //filter groops here (filter array and dictionary)
        //groops
        //ordered groops array
        //figure out which 
        let newGroopsDict = Object.fromEntries(
            Object.entries(groops).filter(([key]) => !selectedTiles.includes(key))
        );
        const newOrderedGroopsArray = orderedGroopsArray.filter(value => !selectedTiles.includes(value));
        console.log(newGroopsDict);
        setGroops(newGroopsDict);
        setOrderedGroopsArray(newOrderedGroopsArray);
        setSelectedTiles([]);
    }

    const wrong = async () => {
        //filter groops here (filter array and dictionary)
        setAttemptsRemaining(attemptsRemaining - 1);
    }

    const oneAway = async () => {
        //filter groops here (filter array and dictionary)
        setAttemptsRemaining(attemptsRemaining - 1);
    }

    const DynamicIcons = ({ count, maxCount }) => {
        const icons = Array.from({ length: maxCount }, (_, index) => (
            <GoDotFill
                key={index}
                className={` ${index < count ? 'opacity-100' : 'opacity-0'}`}
                style={{ fontSize: '24px' }}
            />
        ));
        return <div className="flex">{icons}</div>;
    };


    useEffect(() => {
        //TODO: if want random, use null, if not, use the value
        let groopIdInput = null;
        getGroops(groopIdInput);

    }, [])

    return (
        <div className="App flex flex-col">
            <div className="p-8 relative">
                <div className="relative left-0 w-1/4 h-full flex items-center justify-center">
                    <p className="text-4xl font-bold">
                        Groops
                    </p>
                </div>
            </div>
            <div className="border-b border-gray-300"></div>
            <div className='flex justify-center items-center flex-col'>
                <div className='p-4'>
                    <p>
                        Create four groops of four!
                    </p>
                </div>
                <div className='flex w-full sm:p-4 p-1 max-w-[120ch]'>
                    <div className="flex w-full grid grid-cols-4 sm:gap-2 gap-1" id="tile-container">
                        {orderedGroopsArray.map((key, index) => (
                            <div key={key}>
                                <Tile tilename={key} groopNum={groops[key]} selectedTiles={selectedTiles} setSelectedTiles={setSelectedTiles} attempt={attempt}></Tile>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className='flex items-center justify-center gap-4 pt-8'>
                <p>
                    mistakes remaining
                </p>
                <div className='flex'>
                    <DynamicIcons count={attemptsRemaining} maxCount={4} />
                </div>
            </div>
            <div className='flex items-center justify-center gap-4 py-4'>
                <button className='border-2 border-neutral-800 rounded-full p-3' onClick={shuffleGroops}>
                    shuffle
                </button>
                <button className='border-2 border-neutral-800 rounded-full p-3' onClick={() => { setNewSetModalOpen(true) }}>
                    new set
                </button>
                <div>
                    {selectedTiles.length === 4 ? (
                        <button className='border-2 border-neutral-800 rounded-full p-3' onClick={enter}>
                            submit
                        </button>
                    ) : (
                        <div className='select-none pointer-events-none border-2 border-neutral-500 rounded-full p-3 text-neutral-500'>
                            submit
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Main;