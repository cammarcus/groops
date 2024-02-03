import './App.css';
import { useState, useEffect, useRef } from 'react';
import Tile from './components/tile';
import { GoDotFill } from "react-icons/go";
import { MdOutlineCancel } from "react-icons/md";
import { FaSquare } from "react-icons/fa";
import { RiFileCopyLine } from "react-icons/ri";
import { FaPlay } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { ImShuffle } from "react-icons/im";
import { FaQuestion } from "react-icons/fa";
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { MdOutlineCreate } from "react-icons/md";
import ReactModal from './components/reactModal';
import { useLocation, useNavigate } from "react-router-dom";

function Main() {
    const apiUrl = 'https://ts2pxvn89b.execute-api.us-east-1.amazonaws.com/items';
    const [groops, setGroops] = useState({});
    const [orderedGroopsArray, setOrderedGroopsArray] = useState([]);
    const [groopNames, setGroopNames] = useState({})
    const [loading, setLoading] = useState(true);
    const [selectedTiles, setSelectedTiles] = useState([]);
    const [attempt, setAttempt] = useState(0);
    const [attemptsRemaining, setAttemptsRemaining] = useState(4);
    const [attemptsRemainingDelayed, setAttemptsRemainingDelayed] = useState(4);
    const [playAgainModalOpen, setPlayAgainModalOpen] = useState(false);
    const [gameOverModalOpen, setGameOverModalOpen] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [oneAwayModalOpen, setOneAwayModalOpen] = useState(false);
    const [groopsSolved, setGroopsSolved] = useState([]);
    const [groopsAnswers, setGroopsAnswers] = useState({});
    const [resultsSavedArray, setResultsSavedArray] = useState([]);
    const [userWon, setUserWon] = useState(false);
    const [enterLoading, setEnterLoading] = useState(false);
    const groopColors = { 1: '#bb5588', 2: '#D999B9', 3: '#90E0F3', 4: '#D17B88' };
    const previousGuesses = useRef([]);
    const resultsText = useRef('Groops');
    const [deselectAll, setDeselectAll] = useState(0);
    const [alreadyGuessedModalOpen, setAlreadyGuessedModalOpen] = useState(false);
    const [instructionsModalOpen, setInstructionsModalOpen] = useState(false);
    const [resultsCopiedModalOpen, setResultsCopiedModalOpen] = useState(false);
    const [screenSize, setScreenSize] = useState(window.innerWidth);
    const location = useLocation();
    const navigate = useNavigate();
    const [fetchError, setFetchError] = useState(false);
    const { hash, pathname, search } = location;

    useEffect(() => {
        const handleResize = () => {
            setScreenSize(window.innerWidth);
        };

        // Set up an event listener for window resize
        window.addEventListener('resize', handleResize);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []); // Empty dependency array means this effect runs once after initial render

    const getGroops = async (groopIdInput) => {
        let gamesSeen = parseInt(localStorage.getItem('gamesAlreadyPlayed'));
        if (!gamesSeen || (gamesSeen && gamesSeen == 5)) {
            setInstructionsModalOpen(true);
            localStorage.setItem('gamesAlreadyPlayed',1);
        } else {
            localStorage.setItem('gamesAlreadyPlayed',gamesSeen+1);
        }
        setSelectedTiles([]);
        setLoading(true);
        let getUrl = apiUrl
        if (groopIdInput) {
            getUrl = getUrl + '/' + groopIdInput.toString();
        }
        try {
            const response = await fetch(getUrl, {
                method: 'GET'
            })
            //TODO: if we get something bad here, reroute to id not found page
            const data = await response.json();
            if (data['Items'].length < 1) {
                navigate('/error');
            } else {
                let groops_data = data['Items'][0];
                let groop_one_values_array = groops_data['groop_one_values']['SS']
                let groop_two_values_array = groops_data['groop_two_values']['SS']
                let groop_three_values_array = groops_data['groop_three_values']['SS']
                let groop_four_values_array = groops_data['groop_four_values']['SS']
                setGroopsAnswers({ 1: groop_one_values_array, 2: groop_two_values_array, 3: groop_three_values_array, 4: groop_four_values_array });
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
                await resetGame();
                setGroopNames({ 1: groops_data['groop_one_name']['S'], 2: groops_data['groop_two_name']['S'], 3: groops_data['groop_three_name']['S'], 4: groops_data['groop_four_name']['S'] })
                setGroops(newGroops);
                setOrderedGroopsArray(shuffledOrderedGroopsArray);
                resultsText.current = resultsText.current + '\n' + groopIdInput.toString();
            }
        }
        catch (error) {
            setFetchError(true);
        }
    };

    const resetGame = async () => {
        setGroopsSolved([]);
        setLoading(false);
        setAttemptsRemaining(4);
        setAttemptsRemainingDelayed(4);
        previousGuesses.current = [];
        setResultsSavedArray([]);
        setGameOverModalOpen(false);
        setIsGameOver(false);
        resultsText.current = 'Groops';
        setFetchError(false);
        //setAttempt(0);
    }

    const rerouteToRandomID = async () => {
        let newUrl = apiUrl
        let rerouteId = '/error';
        const response = await fetch(newUrl, {
            method: 'GET'
        })
        const data = await response.json();
        rerouteId = '/' + data.toString();
        navigate(rerouteId);
    }

    const playAgain = async () => {
        rerouteToRandomID();
    }

    const shuffleGroops = () => {
        let shuffledOrderedGroopsArray = shuffleArray(orderedGroopsArray);
        setOrderedGroopsArray(shuffledOrderedGroopsArray);
    }

    const deselectAllFunction = () => {
        setDeselectAll(deselectAll + 1);
        setSelectedTiles([]);
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

    const getAlreadyGuessed = async () => {
        for (let i = 0; i < previousGuesses.current.length; i++) {
            let onePreviousGuess = previousGuesses.current[i]
            let count_of_same_guesses = 0;
            for (let j = 0; j < 4; j++) {
                for (let k = 0; k < 4; k++) {
                    if (onePreviousGuess[j] === selectedTiles[k]) {
                        count_of_same_guesses += 1;
                    }
                }
            }
            if (count_of_same_guesses === 4) {
                return true;
            }
        }
        return false;
    }

    const enter = async () => {
        let alreadyGuessed = await getAlreadyGuessed();
        if (alreadyGuessed) {
            setAlreadyGuessedModalOpen(true);
            setTimeout(() => {
                setAlreadyGuessedModalOpen(false);
            }, 1400);
        } else {
            setEnterLoading(true);
            let groopsCounter = [0, 0, 0, 0, 0]
            let tileOne = groops[selectedTiles[0]];
            let tileTwo = groops[selectedTiles[1]];
            let tileThree = groops[selectedTiles[2]];
            let tileFour = groops[selectedTiles[3]];
            groopsCounter[tileOne] += 1
            groopsCounter[tileTwo] += 1
            groopsCounter[tileThree] += 1
            groopsCounter[tileFour] += 1
            setResultsSavedArray(resultsSavedArray => [...resultsSavedArray, groopsCounter]);
            previousGuesses.current = [...previousGuesses.current, selectedTiles]
            if (groopsCounter.includes(3)) {
                await oneAway();
            } else if (groopsCounter.includes(4)) {
                let correctGroop = groopsCounter.indexOf(4);
                await correct(correctGroop);
            } else {
                await wrong();
            }
            setAttempt(attempt + 1);
            setTimeout(() => {
                setEnterLoading(false);
            }, 1000);
        }
    }

    const returnToHome = () => {
        navigate('/');
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
            setOrderedGroopsArray(newOrderedGroopsArray);
            setTimeout(async () => {
                setSelectedTiles([]);
                newOrderedGroopsArray.splice(0, 4);
                let newOrderedGroopsArrayWithoutCorrect = newOrderedGroopsArray;
                setOrderedGroopsArray(newOrderedGroopsArrayWithoutCorrect);
                setGroopsSolved([...groopsSolved, correctGroop]);
            }, 1000);
        }, 1200)
    }

    const solveAfterLoss = async (groopNumber) => {
        //TODO: fix function, need to create an array to replace selected tiles
        let tilesInGroop = groopsAnswers[groopNumber];
        setTimeout(async () => {
            const newOrderedGroopsArray = [...orderedGroopsArray];
            let k = 4
            for (let i = 0; i < 4; i++) {
                //if newOrderedGroopsArray[i] is NOT in selected tiles
                let firstTileName = newOrderedGroopsArray[i];
                if (!tilesInGroop.includes(firstTileName)) {
                    let j = k
                    while (j < newOrderedGroopsArray.length) {
                        k = k + 1;
                        //if newOrderedGroopsArray[j] is in Selected tiles, flip i and j
                        let secondTileName = newOrderedGroopsArray[j];
                        if (tilesInGroop.includes(secondTileName)) {
                            newOrderedGroopsArray[i] = secondTileName;
                            newOrderedGroopsArray[j] = firstTileName;
                            break;
                        }
                        j = j + 1;
                    }
                }
            }
            setOrderedGroopsArray(orderedGroopsArray => [...newOrderedGroopsArray]);
            setTimeout(async () => {
                newOrderedGroopsArray.splice(0, 4);
                let newOrderedGroopsArrayWithoutCorrect = newOrderedGroopsArray;
                setGroopsSolved(groopsSolved => [...groopsSolved, groopNumber]);
                setOrderedGroopsArray(orderedGroopsArray => [...newOrderedGroopsArrayWithoutCorrect]);
            }, 1000);
        }, 1200)
    }

    const solveRemaining = async () => {
        let remainingGroops = [1, 2, 3, 4];
        remainingGroops = remainingGroops.filter((groop) => !groopsSolved.includes(groop));
        setSelectedTiles([]);
        await solveAfterLoss(remainingGroops[0]);
    }

    const gameOver = async () => {
        updateSavedResultsString();
        setGameOverModalOpen(true);
    }

    const updateSavedResultsString = async () => {
        for (let i = 0; i < resultsSavedArray.length; i++) {
            resultsText.current = resultsText.current + '\n';
            for (let j = 0; j < resultsSavedArray[i][1]; j++) {
                resultsText.current = resultsText.current + '🟪';
            }
            for (let j = 0; j < resultsSavedArray[i][2]; j++) {
                resultsText.current = resultsText.current + '🟧';
            }
            for (let j = 0; j < resultsSavedArray[i][3]; j++) {
                resultsText.current = resultsText.current + '🟨';
            }
            for (let j = 0; j < resultsSavedArray[i][4]; j++) {
                resultsText.current = resultsText.current + '🟦';
            }
        }
        navigator.clipboard.writeText(resultsText.current);
    };


    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(resultsText.current);
            setResultsCopiedModalOpen(true);
            setTimeout(() => {
                setResultsCopiedModalOpen(false);
            }, 1200);
        } catch (e) {
            //console.log('oops')
        }
    };

    useEffect(() => {
        const isGameOverFunction = async () => {
            if (groopsSolved.length === 4) {
                if (!isGameOver) {
                    setUserWon(true);
                }
                setIsGameOver(true);
                gameOver();
            } else if (attemptsRemaining === 0) {
                setIsGameOver(true);
                solveRemaining();
            }
        }
        setTimeout(() => {
            isGameOverFunction();
        }, 1000);
    }, [groopsSolved, attemptsRemaining])

    useEffect(() => {
        setTimeout(() => {
            setAttemptsRemainingDelayed(attemptsRemaining);
        }, 1500);
    }, [attemptsRemaining])



    const correctReorder = async () => {
        //filter groops here (filter array and dictionary)

    }

    const wrong = async () => {
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
        const answerBanners = Array.from({ length: groopsSolved.length }, (_, index) => (
            index === 3 ? (
                <div
                    key={index}
                    className='flex justify-center bg-blue-200 rounded-md w-full h-full min-h-24'
                    style={{ backgroundColor: groopColors[groopsSolved[index]] }}
                >
                    <div className='flex justify-center items-center flex-col'>
                        <p className='p-0 m-0 uppercase text-center'>{groopNames[groopsSolved[index]]}</p>
                        <p className='uppercase text-center'>{answersArrayToString(groopsAnswers[groopsSolved[index]])}</p>
                    </div>
                </div>) : (
                <div
                    key={index}
                    className='flex justify-center rounded-md w-full h-full min-h-24 sm:mb-2 mb-1'
                    style={{ backgroundColor: groopColors[groopsSolved[index]] }}
                >
                    <div className='flex justify-center items-center flex-col'>
                        <p className='p-0 m-0 uppercase text-center'>{groopNames[groopsSolved[index]]}</p>
                        <p className='uppercase text-center'>{answersArrayToString(groopsAnswers[groopsSolved[index]])}</p>
                    </div>
                </div>
            )
        ));
        return <div className="flex flex-col">{answerBanners}</div>;
    };

    const DynamicResultsImage = () => {
        const results = Array.from({ length: resultsSavedArray.length }, (_, index) => (
            <div key={index} className="flex flex-row justify-center w-full p-0" id="tile-container">
                <DynamicSquaresForResultsImage numberOfSquares={resultsSavedArray[index][1]} colorOfSquare={groopColors[1]}></DynamicSquaresForResultsImage>
                <DynamicSquaresForResultsImage numberOfSquares={resultsSavedArray[index][2]} colorOfSquare={groopColors[2]}></DynamicSquaresForResultsImage>
                <DynamicSquaresForResultsImage numberOfSquares={resultsSavedArray[index][3]} colorOfSquare={groopColors[3]}></DynamicSquaresForResultsImage>
                <DynamicSquaresForResultsImage numberOfSquares={resultsSavedArray[index][4]} colorOfSquare={groopColors[4]}></DynamicSquaresForResultsImage>
            </div>
        ));
        return <div className='flex flex-col mt-4'>{results}</div>;
    };

    const DynamicSquaresForResultsImage = ({ numberOfSquares, colorOfSquare }) => {
        const results = Array.from({ length: numberOfSquares }, (_, index) => (
            <div key={index}>
                <FaSquare
                    style={{
                        color: colorOfSquare,
                        fontSize: window.innerWidth > 1000 ? '40px' : window.innerWidth > 600 ? '38px' : '32px',
                    }}></FaSquare>
            </div>
        ));
        return <div className='flex flex-row'>{results}</div>;
    };

    const answersArrayToString = (answersArray) => {
        let answersString = answersArray[0] + ', ' + answersArray[1] + ', ' + answersArray[2] + ', ' + answersArray[3]
        return answersString;
    }

    const closeInstructionsModal = () => {
        setInstructionsModalOpen(false);
    }

    useEffect(() => {
        //TODO: if want random, use null, if not, use the value
        let groopIdInput = null;
        groopIdInput = pathname.substring(1);
        getGroops(groopIdInput);
    }, [pathname])

    const oneAwayModalStyle = {
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

    const copyResultsModalStyle = {
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0)',
        },
        content: {
            width: window.innerWidth > 1000 ? '30%' : window.innerWidth > 600 ? '30%' : window.innerWidth > 400 ? '40%' : '60%',
            left: '50%',
            right: 'auto',
            top: '90%',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            padding: 8,
            backgroundColor: '#ffffff',
        },
    };

    const gameOverModalStyle = {
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, .05)',
        },
        content: {
            width: window.innerWidth > 1000 ? '40%' : window.innerWidth > 600 ? '55%' : '80%',
            height: '65%',
            top: window.innerWidth > 1000 ? '40%' : window.innerWidth > 600 ? '45%' : '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            padding: 8,
            backgroundColor: '#ffffff',
        },
    };

    const playAgainModalStyle = {
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, .05)',
        },
        content: {
            width: window.innerWidth > 1000 ? '40%' : window.innerWidth > 600 ? '55%' : '80%',
            height: '65%',
            top: '40%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            padding: 8,
            backgroundColor: '#ffffff',
        },
    };

    const instructionsModalStyle = {
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, .05)',
        },
        content: {
            width: window.innerWidth > 1000 ? '50%' : window.innerWidth > 600 ? '70%' : '100%',
            height: window.innerWidth > 1000 ? '65%' : window.innerWidth > 600 ? '70%' : '75%',
            top: window.innerWidth > 1000 ? '50%' : window.innerWidth > 600 ? '55%' : '70%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            position: 'absolute',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            padding: 8,
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            overflowY: 'auto',
        },
    };

    return (
        <div className="flex flex-col bg-gray-100 h-screen">
            <div className="flex">
                <ReactModal
                    modalOpenState={oneAwayModalOpen} contentLabelInput={"One Away Modal"} modalFact={document.getElementById('root') || undefined} modalStyle={oneAwayModalStyle}
                >
                    <p className='text-neutral-200'>One Away</p>
                </ReactModal>
            </div>
            <div className='flex'>
                <ReactModal
                    modalOpenState={alreadyGuessedModalOpen} contentLabelInput={"Already Guessed Modal"} modalFact={document.getElementById('root') || undefined} modalStyle={oneAwayModalStyle}
                >
                    <p className='text-neutral-200'>Already Guessed</p>
                </ReactModal>
            </div>
            <div className='flex'>
                <ReactModal
                    modalOpenState={playAgainModalOpen} contentLabelInput={"Play Again Modal"} modalFact={document.getElementById('root') || undefined} modalStyle={playAgainModalStyle}
                >
                    <p className='text-neutral-200'>Play Again</p>
                </ReactModal>
            </div>
            <div className='flex'>
                <ReactModal
                    modalOpenState={resultsCopiedModalOpen} contentLabelInput={"Copy Results Modal"} modalFact={document.getElementById('root') || undefined} modalStyle={copyResultsModalStyle}
                >
                    <div className='flex flex-row items-center justify-center gap-4'>
                        <p className='text-neutral-800'>Copied Results</p>
                        <FaCheckCircle className='text-green-500' />
                    </div>
                </ReactModal>
            </div>
            <div className='flex'>
                <ReactModal
                    modalOpenState={instructionsModalOpen} contentLabelInput={"Instructions Modal"} modalFact={document.getElementById('root') || undefined} modalStyle={instructionsModalStyle}
                >
                    <div>
                        <div className='absolute right-0 top-0 p-2'>
                            <button onClick={closeInstructionsModal}>
                                <div>
                                    <MdOutlineCancel style={{ fontSize: '20px' }}></MdOutlineCancel>
                                </div>
                            </button>
                        </div>
                        <div className='p-5 mt-2'>
                            <p className='text-neutral-800 text-2xl font-bold'>How to play Groops</p>

                            <p className='text-neutral-800 font-bold mt-3 text-md'>Find groups of four items that share something in common.</p>
                            <li className='text-neutral-800 text-md'>Select four items and tap 'Submit' to check if your guess is correct.</li>
                            <li className='text-neutral-800 text-md'>Find the groups without making 4 mistakes!</li>

                            <p className='text-neutral-800 font-bold mt-3 text-md'>Category Examples</p>
                            <li className='text-neutral-800 text-md'>FISH: Bass, Flounder, Salmon, Trout</li>
                            <li className='text-neutral-800 text-md'>FIRE ___: Ant, Drill, Island, Opal</li>

                            <p className='text-neutral-800 mt-3 text-md'>Categories will always be more specific than "5-LETTER WORDS," "NAMES" or "VERBS."</p>
                            <p className='text-neutral-800 mt-3 text-md'>Each puzzle has exactly one solution. Watch out for words that seem to belong to multiple categories!</p>

                            {/*<p className='text-neutral-800 mt-3 text-md'>Blah Blah</p>*/}

                        </div>
                    </div>
                </ReactModal>
            </div>
            <div className='flex'>
                <ReactModal modalOpenState={gameOverModalOpen} contentLabelInput={"Game Over Modal"} modalFact={document.getElementById('root') || undefined} modalStyle={gameOverModalStyle}>
                    <div className='h-full flex flex-col'>
                        <div className='flex justify-end'>
                            <button onClick={() => setGameOverModalOpen(false)}>
                                <div>
                                    <MdOutlineCancel style={{ fontSize: '20px' }}></MdOutlineCancel>
                                </div>
                            </button>
                        </div>
                        <div className='flex flex-col justify-center'>
                            {userWon ? (
                                <div className='flex justify-center'>
                                    <p className='text-neutral-700' style={{ fontSize: '28px' }}>Great!</p>
                                </div>
                            ) : (
                                <div className='flex justify-center'>
                                    <p className='text-neutral-700' style={{ fontSize: '28px' }}>Next Time!</p>
                                </div>
                            )}
                        </div>
                        <div className='flex flex-col items-center flex-grow'>
                            <DynamicResultsImage></DynamicResultsImage>
                        </div>
                        <div className='flex flex-row relative justify-center md:gap-6 gap-2' style={{ bottom: '10%' }}>
                            <div className='bg-orange-200 border rounded-md p-2 md:w-2/5 w-1/2'>
                                <button onClick={handleCopy} className='w-full h-full flex flex-row items-center justify-center md:gap-4 gap-2'>
                                    <p className='md:text-lg text-sm font-bold'>
                                        Share
                                    </p>
                                    <div>
                                        <RiFileCopyLine className='lg:text-lg md:text-md text-xs' />
                                    </div>
                                </button>
                            </div>
                            <div className='bg-orange-200 border rounded-md p-2 md:w-2/5 w-1/2'>
                                <button onClick={playAgain} className='w-full h-full flex flex-row items-center justify-center md:gap-4 gap-2'>
                                    <p className='md:text-lg text-sm font-bold'>
                                        Play Again
                                    </p>
                                    <div>
                                        <FaPlay className='lg:text-lg md:text-md text-xs' />
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </ReactModal>

            </div>
            <div className="sm:py-8 pt-4 relative">
                <div className="relative w-full sm:w-1/4 h-full flex items-center justify-center sm:justify-start">
                    <button onClick={returnToHome}>
                        <p className="text-4xl font-bold">
                            Groops
                        </p>
                    </button>
                </div>
            </div>

            <div className='flex justify-end items-center gap-4 px-2 pb-1'>
                <button onClick={rerouteToRandomID}>
                    <ImShuffle style={{ fontSize: '20px' }} />
                </button>
                <button>
                    <MdOutlineCreate style={{ fontSize: '20px' }} />
                </button>
                <button onClick={() => {setInstructionsModalOpen(true)}}>
                    <FaQuestion style={{ fontSize: '20px' }} />
                </button>
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
                                <Tile tilename={key} isGameOver={isGameOver} index={index} groopNum={groops[key]} selectedTiles={selectedTiles} setSelectedTiles={setSelectedTiles} attemptsRemaining={attemptsRemaining} attempt={attempt} deselectAll={deselectAll}></Tile>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {isGameOver ? (
                <div className='flex items-center justify-center gap-4 py-4'>
                    <button className='border-2 border-neutral-800 rounded-full p-3' onClick={() => setGameOverModalOpen(true)}>
                        View results
                    </button>
                </div>
            ) : (
                <div>
                    <div className='flex items-center justify-center gap-4 sm:pt-8 pt-4'>
                        <p>
                            Mistakes remaining
                        </p>
                        <div className='flex'>
                            <DynamicIcons count={attemptsRemainingDelayed} maxCount={4} />
                        </div>
                    </div>
                    <div className='flex items-center justify-center gap-4 py-4'>
                        <button className='border-2 border-neutral-800 rounded-full p-3' onClick={shuffleGroops}>
                            Shuffle
                        </button>
                        <button className='border-2 border-neutral-800 rounded-full p-3' onClick={deselectAllFunction}>
                            Deselect All
                        </button>
                        <div>
                            {selectedTiles.length === 4 && attemptsRemaining > 0 && !enterLoading ? (
                                <button className='border-2 border-neutral-800 rounded-full p-3' onClick={enter}>
                                    Submit
                                </button>
                            ) : (
                                <div className='select-none pointer-events-none border-2 border-neutral-500 rounded-full p-3 text-neutral-500'>
                                    Submit
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Main;