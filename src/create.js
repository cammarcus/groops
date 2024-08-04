import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Create() {
    const navigate = useNavigate();
    const postUrl = 'https://ts2pxvn89b.execute-api.us-east-1.amazonaws.com/items';
    const [createdGroops, setCreatedGroops] = useState(false);
    const [createdId, setCreatedId] = useState('');
    const [loading, setLoading] = useState(false);

    const [groops, setGroops] = useState({
        groopOne: { name: '', values: ['', '', '', ''] },
        groopTwo: { name: '', values: ['', '', '', ''] },
        groopThree: { name: '', values: ['', '', '', ''] },
        groopFour: { name: '', values: ['', '', '', ''] }
    });

    const [currentGroopIndex, setCurrentGroopIndex] = useState(0);
    const groopKeys = Object.keys(groops);

    const handleGroopChange = (groop, field, index, value) => {
        setGroops(prevState => {
            const newGroop = { ...prevState[groop] };
            if (field === 'name') {
                newGroop.name = value;
            } else {
                newGroop.values[index] = value;
            }
            return { ...prevState, [groop]: newGroop };
        });
    };

    const submit = async () => {
        setLoading(true); // Set loading to true when submission starts

        const bodyJson = {
            groop_one_name: groops.groopOne.name,
            groop_two_name: groops.groopTwo.name,
            groop_three_name: groops.groopThree.name,
            groop_four_name: groops.groopFour.name,
            groop_one_values: groops.groopOne.values,
            groop_two_values: groops.groopTwo.values,
            groop_three_values: groops.groopThree.values,
            groop_four_values: groops.groopFour.values
        };

        try {
            const response = await fetch(postUrl, {
                method: 'POST',
                body: JSON.stringify(bodyJson)
            });
            const data = await response.json();
            setCreatedId(data);
            resetValues();
            setCreatedGroops(true);
        } catch (error) {
            // Handle error
        } finally {
            setLoading(false); // Set loading to false once submission is done
        }
    };

    const returnToHome = () => navigate('/');
    const goToGame = () => navigate('/' + createdId);

    const resetValues = () => {
        setGroops({
            groopOne: { name: '', values: ['', '', '', ''] },
            groopTwo: { name: '', values: ['', '', '', ''] },
            groopThree: { name: '', values: ['', '', '', ''] },
            groopFour: { name: '', values: ['', '', '', ''] }
        });
        setCurrentGroopIndex(0);
    };

    const allFieldsFilled = Object.values(groops).every(groop =>
        groop.name &&
        groop.values.every(value => value)
    );

    const SubmitButton = () => (
        <div className='my-4'>
            {loading ? (
                <div className='bg-purple-300 rounded-lg py-3 px-4 text-white font-bold text-lg'>
                    <p>Loading...</p>
                </div>
            ) : allFieldsFilled ? (
                <div onClick={submit} className='rounded-lg py-3 px-4 bg-purple-300 hover:bg-purple-400 text-white font-bold text-lg cursor-pointer'>
                    <p>Submit</p>
                </div>
            ) : (
                <div className='bg-gray-300 rounded-lg py-3 px-4 text-white font-bold text-lg'>
                    <p>Submit</p>
                </div>
            )}
        </div>
    );

    const currentGroopKey = groopKeys[currentGroopIndex];
    const currentGroop = groops[currentGroopKey];

    return (
        <div className='flex flex-col bg-gray-100 min-h-screen'>
            <div className='flex flex-col items-center'>
                <div className="w-full sm:w-1/4 h-full flex items-center justify-center p-6">
                    <button onClick={returnToHome}>
                        <p className="text-4xl font-bold">Groops</p>
                    </button>
                </div>
                <div className="border-b border-gray-300 w-full"></div>
                <div className="w-full h-full flex items-center justify-center mt-2">
                    <button onClick={returnToHome} className='text-2xl font-bold'>
                        Create Your Own Game
                    </button>
                </div>

                <div className='flex flex-col items-center'>
                    {createdGroops ? (
                        <div className='flex flex-col items-center'>
                            <div className='mt-4 flex-col items-center'>
                                <p className='text-center text-lg font-semibold'>Groop Id: {createdId}</p>
                                <div className='mt-4'>
                                    <button onClick={goToGame} className='bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded'>
                                        <p>Play the game you created!</p>
                                    </button>
                                </div>
                            </div>
                            <div className='mt-4'>
                                <button onClick={returnToHome} className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded'>
                                    <p>Return Home</p>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className='flex flex-col items-center'>
                            <div className='flex flex-col mt-4 p-2 bg-white rounded-lg shadow-lg'>
                                <div className='flex flex-col'>
                                    <p className='font-semibold'>{`Groop ${currentGroopIndex + 1} Name:`}</p>
                                    <input
                                        value={currentGroop.name}
                                        onChange={(e) => handleGroopChange(currentGroopKey, 'name', null, e.target.value)}
                                        placeholder='name'
                                        className='bg-gray-100 border rounded-lg p-2 mt-1'
                                    />
                                </div>
                                <div className='flex flex-col mt-4'>
                                    <p className='font-semibold'>{`Groop ${currentGroopIndex + 1} Values:`}</p>
                                    {currentGroop.values.map((value, valueIndex) => (
                                        <input
                                            key={valueIndex}
                                            value={value}
                                            onChange={(e) => handleGroopChange(currentGroopKey, 'value', valueIndex, e.target.value)}
                                            placeholder={`value ${valueIndex + 1}`}
                                            className='bg-gray-100 border rounded-lg p-2 mt-1'
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className='flex justify-between w-full sm:w-1/4 mt-4'>
                                <button
                                    onClick={() => setCurrentGroopIndex(prevIndex => Math.max(prevIndex - 1, 0))}
                                    className={`p-2 rounded ${currentGroopIndex === 0 ? 'text-gray-300 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200'}`}
                                    disabled={currentGroopIndex === 0}
                                >
                                    ←
                                </button>
                                <button
                                    onClick={() => setCurrentGroopIndex(prevIndex => Math.min(prevIndex + 1, groopKeys.length - 1))}
                                    className={`p-2 rounded ${currentGroopIndex === groopKeys.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200'}`}
                                    disabled={currentGroopIndex === groopKeys.length - 1}
                                >
                                    →
                                </button>
                            </div>

                            <SubmitButton />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Create;
