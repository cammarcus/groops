import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactModal from './components/reactModal';

function Create() {
    const navigate = useNavigate();
    const postUrl = 'https://ts2pxvn89b.execute-api.us-east-1.amazonaws.com/items';
    const [createdGroops, setCreatedGroops] = useState(false);
    const [createdid, setCreatedid] = useState('');

    const [groopOneName, setGroopOneName] = useState('');
    const [groopOneValueOne, setGroopOneValueOne] = useState('');
    const [groopOneValueTwo, setGroopOneValueTwo] = useState('');
    const [groopOneValueThree, setGroopOneValueThree] = useState('');
    const [groopOneValueFour, setGroopOneValueFour] = useState('');

    const [groopTwoName, setGroopTwoName] = useState('');
    const [groopTwoValueOne, setGroopTwoValueOne] = useState('');
    const [groopTwoValueTwo, setGroopTwoValueTwo] = useState('');
    const [groopTwoValueThree, setGroopTwoValueThree] = useState('');
    const [groopTwoValueFour, setGroopTwoValueFour] = useState('');

    const [groopThreeName, setGroopThreeName] = useState('');
    const [groopThreeValueOne, setGroopThreeValueOne] = useState('');
    const [groopThreeValueTwo, setGroopThreeValueTwo] = useState('');
    const [groopThreeValueThree, setGroopThreeValueThree] = useState('');
    const [groopThreeValueFour, setGroopThreeValueFour] = useState('');

    const [groopFourName, setGroopFourName] = useState('');
    const [groopFourValueOne, setGroopFourValueOne] = useState('');
    const [groopFourValueTwo, setGroopFourValueTwo] = useState('');
    const [groopFourValueThree, setGroopFourValueThree] = useState('');
    const [groopFourValueFour, setGroopFourValueFour] = useState('');


    const submit = async () => {
        let body_json = {
            "groop_one_name": groopOneName,
            "groop_two_name": groopTwoName,
            "groop_three_name": groopThreeName,
            "groop_four_name": groopFourName,
            "groop_one_values": [groopOneValueOne, groopOneValueTwo, groopOneValueThree, groopOneValueFour],
            "groop_two_values": [groopTwoValueOne, groopTwoValueTwo, groopTwoValueThree, groopTwoValueFour],
            "groop_three_values": [groopThreeValueOne, groopThreeValueTwo, groopThreeValueThree, groopThreeValueFour],
            "groop_four_values": [groopFourValueOne, groopFourValueTwo, groopFourValueThree, groopFourValueFour],
        }
        try {
            const response = await fetch(postUrl, {
                method: 'POST',
                body: JSON.stringify(body_json)
            })
            const data = await response.json();
            setCreatedid(data);
            resetValues();
            setCreatedGroops(true);
        } catch (error) {
            //error
        }
    }

    const returnToHome = async () => {
        navigate('/');
    }

    const createNew = async () => {
        navigate('/create');
    }

    const goToGame = async () => {
        navigate('/' + createdid);
    }

    const resetValues = () => {
        setGroopOneName('');
        setGroopTwoName('');
        setGroopThreeName('');
        setGroopFourName('');
    }

    const SubmitButton = () => {
        let content = <div>hi</div>
        if (groopOneName && groopOneValueOne && groopOneValueTwo && groopOneValueThree && groopOneValueFour &&
            groopTwoName && groopTwoValueOne && groopTwoValueTwo && groopTwoValueThree && groopTwoValueFour &&
            groopThreeName && groopThreeValueOne && groopThreeValueTwo && groopThreeValueThree && groopThreeValueFour &&
            groopFourName && groopFourValueOne && groopFourValueTwo && groopFourValueThree && groopFourValueFour) {
            content =
                (<div onClick={submit} className='rounded-lg py-3 px-4'
                    style={{ backgroundColor: '#D4C5E2' }}>
                    <button>
                        <p>
                            Submit
                        </p>
                    </button>
                </div>)
        } else {
            content =
                (<div className='bg-neutral-300 rounded-lg py-3 px-4'>
                    <button>
                        <p>
                            Submit
                        </p>
                    </button>
                </div>)
        }
        return <div className='my-4'>{content}</div>;
    }

    return (
        <div className='flex flex-col bg-gray-100 min-h-screen'>
            <div className='flex flex-col items-center'>
                <div className="w-full sm:w-1/4 h-full flex items-center justify-center">
                    <button onClick={returnToHome}>
                        <p className="text-4xl font-bold">
                            Groops
                        </p>
                    </button>
                </div>
                <div className="border-b border-gray-300 w-full"></div>
                <div className="w-full h-full flex items-center justify-center mt-2">
                    <button onClick={returnToHome}>
                        <p className="text-2xl font-bold">
                            Create Your Own Game
                        </p>
                    </button>
                </div>

                <div>
                    {createdGroops ? (
                        <div>
                            <div>
                                <p>Groop Id: {createdid}</p>
                                <button onClick={goToGame}>
                                    <p>
                                        Play the game you created!
                                    </p>
                                </button>
                            </div>
                            <div>
                                <button onClick={returnToHome}>
                                <p>Return Home</p>
                                </button>
                            </div>
                        </div>
                    ) : (

                        <div>
                            <div className='flex flex-col items-center jusitfy-center'>
                                <div className='flex flex-col mt-4 p-2'>
                                    <div className='flex flex-col'>
                                        <p>
                                            Groop One Name:
                                        </p>
                                        <input title='groop one name'
                                            onChange={(e) => setGroopOneName(e.target.value)}
                                            placeholder='name'
                                        ></input>
                                    </div>
                                    <div className='flex flex-col'>
                                        <div>
                                            <p>
                                                Groop One Values:
                                            </p>
                                        </div>
                                        <div className='flex flex-col'>
                                            <input title='groop one value'
                                                onChange={(e) => setGroopOneValueOne(e.target.value)}
                                                placeholder='a'
                                            ></input>
                                            <input title='groop one value'
                                                onChange={(e) => setGroopOneValueTwo(e.target.value)}
                                                placeholder='b'
                                            ></input>
                                            <input title='groop one value'
                                                onChange={(e) => setGroopOneValueThree(e.target.value)}
                                                placeholder='c'
                                            ></input>
                                            <input title='groop one value'
                                                onChange={(e) => setGroopOneValueFour(e.target.value)}
                                                placeholder='d'
                                            ></input>
                                        </div>
                                    </div>
                                </div>

                                <div className='flex flex-col mt-4'>
                                    <div>
                                        <div className='flex flex-col'>
                                            <p>
                                                Groop Two Name:
                                            </p>
                                            <input title='groop two name'
                                                onChange={(e) => setGroopTwoName(e.target.value)}
                                                placeholder='name'
                                            ></input>
                                        </div>
                                    </div>
                                    <div className='flex flex-col'>
                                        <div>
                                            <p>
                                                Groop One Values:
                                            </p>
                                        </div>
                                        <div className='flex flex-col'>
                                            <input title='groop two value'
                                                onChange={(e) => setGroopTwoValueOne(e.target.value)}
                                                placeholder='a'
                                            ></input>
                                            <input title='groop two value'
                                                onChange={(e) => setGroopTwoValueTwo(e.target.value)}
                                                placeholder='b'
                                            ></input>
                                            <input title='groop two value'
                                                onChange={(e) => setGroopTwoValueThree(e.target.value)}
                                                placeholder='c'
                                            ></input>
                                            <input title='groop two value'
                                                onChange={(e) => setGroopTwoValueFour(e.target.value)}
                                                placeholder='d'
                                            ></input>
                                        </div>
                                    </div>
                                </div>

                                <div className='flex flex-col mt-4'>
                                    <div>
                                        <div>
                                            <p>
                                                Groops Three Name:
                                            </p>
                                            <input title='groop three name'
                                                onChange={(e) => setGroopThreeName(e.target.value)}
                                                placeholder='name'
                                            ></input>
                                        </div>
                                    </div>
                                    <div className='flex flex-col'>
                                        <div>
                                            <p>
                                                Groop Three Values:
                                            </p>
                                        </div>
                                        <div className='flex flex-col'>
                                            <input title='groop three value'
                                                onChange={(e) => setGroopThreeValueOne(e.target.value)}
                                                placeholder='a'
                                            ></input>
                                            <input title='groop three value'
                                                onChange={(e) => setGroopThreeValueTwo(e.target.value)}
                                                placeholder='b'
                                            ></input>
                                            <input title='groop three value'
                                                onChange={(e) => setGroopThreeValueThree(e.target.value)}
                                                placeholder='c'
                                            ></input>
                                            <input title='groop three value'
                                                onChange={(e) => setGroopThreeValueFour(e.target.value)}
                                                placeholder='d'
                                            ></input>
                                        </div>
                                    </div>
                                </div>

                                <div className='flex flex-col mt-4'>
                                    <div>
                                        <div>
                                            <p>
                                                Groop Four Name:
                                            </p>
                                            <input title='groop four name'
                                                onChange={(e) => setGroopFourName(e.target.value)}
                                                placeholder='name'
                                            ></input>
                                        </div>
                                    </div>
                                    <div className='flex flex-col'>
                                        <div>
                                            <p>
                                                Groop Four Values:
                                            </p>
                                        </div>
                                        <div className='flex flex-col'>
                                            <input title='groop four value'
                                                onChange={(e) => setGroopFourValueOne(e.target.value)}
                                                placeholder='a'
                                            ></input>
                                            <input title='groop four value'
                                                onChange={(e) => setGroopFourValueTwo(e.target.value)}
                                                placeholder='b'
                                            ></input>
                                            <input title='groop four value'
                                                onChange={(e) => setGroopFourValueThree(e.target.value)}
                                                placeholder='c'
                                            ></input>
                                            <input title='groop four value'
                                                onChange={(e) => setGroopFourValueFour(e.target.value)}
                                                placeholder='d'
                                            ></input>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <SubmitButton></SubmitButton>
                            </div>
                        </div>)}
                </div>
            </div>
        </div>)
};

export default Create;