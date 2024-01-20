import './App.css';
import { useState, useEffect } from 'react';
import Tile from './components/tile';
import { GoDotFill } from "react-icons/go";
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import Modal from 'react-modal';

function Main() {
    const apiUrl = 'https://ts2pxvn89b.execute-api.us-east-1.amazonaws.com/items';
    const [groops, setGroops] = useState({});
    const [orderedGroopsArray, setOrderedGroopsArray] = useState([]);
    const [groopNames, setGroopNames] = useState({})
    const [loading, setLoading] = useState(true);
    const [selectedTiles, setSelectedTiles] = useState([]);
    const [attempt, setAttempt] = useState(0);
    const [attemptsRemaining, setAttemptsRemaining] = useState(4);
    const [newSetModalOpen, setNewSetModalOpen] = useState(false);
    const [oneAwayModalOpen, setOneAwayModalOpen] = useState(false);
    const [groopsSolved, setGroopsSolved] = useState([]);
    const [groopsAnswers, setGroopsAnswers] = useState({});
    const controls = useAnimation();
    const groopColors = {1: '#bb5588', 2: '#D999B9', 3: '#90E0F3', 4: '#D17B88'};
    //TODO: each groop should have associated color... add dictionary for this

    const getGroops = async (groopIdInput) => {
        setSelectedTiles([]);
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
        setGroopsAnswers({1: groop_one_values_array, 2: groop_two_values_array, 3: groop_three_values_array, 4: groop_four_values_array});
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
        let shuffledOrderedGroopsArray = shuffleArray(newOrderedGroopsArray);
        setGroopNames({1: groops_data['groop_one_name']['S'], 2: groops_data['groop_two_name']['S'], 3: groops_data['groop_three_name']['S'], 4: groops_data['groop_four_name']['S']})
        setGroops(newGroops);
        setOrderedGroopsArray(shuffledOrderedGroopsArray);
        setGroopsSolved([])
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
            let correctGroop = groopsCounter.indexOf(4);
            correct(correctGroop);
        } else {
            wrong();
            if (!attemptsRemaining) {
                solveRemaining();
            }
        }
        setAttempt(attempt + 1);
    }

    const correct = async (correctGroop) => {
        setAttempt(attempt + 1);
        setTimeout(() => {
            const newOrderedGroopsArray = [...orderedGroopsArray];
            let k = 4
            for (let i = 0; i < 4; i++) {
                //if newOrderedGroopsArray[i] is NOT in selected tiles
                let firstTileName = newOrderedGroopsArray[i];
                if (!selectedTiles.includes(firstTileName)) {
                    let j = k
                    while (j < newOrderedGroopsArray.length) {
                        k = k + 1;
                        //if newOrderedGroopsArray[j] is in Selected tiles, flip i and j
                        let secondTileName = newOrderedGroopsArray[j];
                        if (selectedTiles.includes(secondTileName)) {
                            newOrderedGroopsArray[i] = secondTileName;
                            newOrderedGroopsArray[j] = firstTileName;
                            break;
                        }
                        j = j + 1;
                    }
                }
            }
            //const newOrderedGroopsArray = orderedGroopsArray.filter(value => !selectedTiles.includes(value));
            setOrderedGroopsArray(newOrderedGroopsArray);
            setTimeout(async () => {
                newOrderedGroopsArray.splice(0, 4);
                let newOrderedGroopsArrayWithoutCorrect = newOrderedGroopsArray;
                setOrderedGroopsArray(newOrderedGroopsArrayWithoutCorrect);
                setGroopsSolved([...groopsSolved, correctGroop])
                setSelectedTiles([]);
            }, 1000);
        }, 1200)
    }

    const solveRemaining = async () => {
        console.log('you lost');
    }

    useEffect(() => {
        //TODO: if want random, use null, if not, use the value
        if (groopsSolved.length === 4) {
            console.log('game is done... have modal appear');
        }
    }, [groopsSolved])


    const correctReorder = async () => {
        //filter groops here (filter array and dictionary)

    }

    const wrong = async () => {
        //filter groops here (filter array and dictionary)
        setAttemptsRemaining(attemptsRemaining - 1);
    }

    const oneAway = async () => {
        setTimeout(() => {
            setOneAwayModalOpen(true);
        }, 1600);
        setAttemptsRemaining(attemptsRemaining - 1);
        setTimeout(() => {
            setOneAwayModalOpen(false);
        }, 3000);

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

    const DynamicAnswerBanners = () => {
        const icons = Array.from({ length: groopsSolved.length }, (_, index) => (
            index === 3 ? (
            <div 
            key={index} 
            className='flex justify-center bg-blue-200 rounded-md w-full h-full min-h-24'
            style={{backgroundColor: groopColors[groopsSolved[index]]}}
            >
                <div className='flex justify-center items-center flex-col'>
                    <p className='p-0 m-0 uppercase'>{groopNames[groopsSolved[index]]}</p>
                    <p className='uppercase'>{answersArrayToString(groopsAnswers[groopsSolved[index]])}</p>
                </div>
            </div>) : (
                <div 
                key={index} 
                className='flex justify-center rounded-md w-full h-full min-h-24 mb-2'
                style={{backgroundColor: groopColors[groopsSolved[index]]}}
                >
                <div className='flex justify-center items-center flex-col'>
                    <p className='p-0 m-0 uppercase'>{groopNames[groopsSolved[index]]}</p>
                    <p className='uppercase'>{answersArrayToString(groopsAnswers[groopsSolved[index]])}</p>
                </div>
            </div>
            )
        ));
        return <div className="flex flex-col">{icons}</div>;
    };

    const answersArrayToString = (answersArray) => {
        let answersString = answersArray[0] + ', ' + answersArray[1] + ', ' + answersArray[2] + ', ' +  answersArray[3]
        return answersString;
    }


    useEffect(() => {
        //TODO: if want random, use null, if not, use the value
        let groopIdInput = null;
        getGroops(groopIdInput);

    }, [])

    const customStyles = {
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0)',
        },
        content: {
            top: '25%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            padding: 8,
            backgroundColor: 'rgba(20, 20, 20, 0.9)',
        },
    };


    return (
        <div className="App flex flex-col">
            <div className='flex w-1/2'>
                <Modal
                    isOpen={oneAwayModalOpen}
                    contentLabel="One Away Modal"
                    appElement={document.getElementById('root') || undefined}
                    style={customStyles}
                >
                    <p className='text-neutral-200'>One Away</p>
                </Modal>
            </div>
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
                <div className='flex flex-col w-full sm:p-4 p-1 max-w-[120ch]'>
                    <DynamicAnswerBanners></DynamicAnswerBanners>
                    <div className="flex w-full grid grid-cols-4 sm:gap-2 gap-1" id="tile-container">
                        {orderedGroopsArray.map((key, index) => (
                            <div key={key}>
                                <Tile tilename={key} index={index} groopNum={groops[key]} selectedTiles={selectedTiles} setSelectedTiles={setSelectedTiles} attemptsRemaining={attemptsRemaining} attempt={attempt}></Tile>
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