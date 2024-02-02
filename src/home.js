import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();
    const getUrl = 'https://ts2pxvn89b.execute-api.us-east-1.amazonaws.com/items';
    const [userEnteredID, setUserEnteredID] = useState('');
    const [isHoveredClickToPlay, setIsHoveredClickToPlay] = useState(false);
    const [isHoveredClickToSubmit, setIsHoveredClickToSubmit] = useState(false);

    const handleHoverClickToPlay = () => {
        setIsHoveredClickToPlay(true);
    };

    const handleLeaveClickToPlay = () => {
        setIsHoveredClickToPlay(false);
    };

    const handleHoverClickToSubmit = () => {
        setIsHoveredClickToSubmit(true);
    };

    const handleLeaveClickToSubmit = () => {
        setIsHoveredClickToSubmit(false);
    };


    const rerouteToRandomID = async () => {
        let rerouteId = '/error';
        const response = await fetch(getUrl, {
            method: 'GET'
        });
        const data = await response.json();
        rerouteId = '/' + data.toString();
        navigate(rerouteId);
    };
    const rerouteWithEnteredID = async () => {
        navigate(`/${userEnteredID}`);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen p-4 bg-gray-100 text-gray-900">
            <div className=''>
                <p className="text-center text-4xl font-serif font-bold mb-4">
                    Welcome to Groops
                </p>
            </div>
            <div onMouseEnter={handleHoverClickToPlay}
                onMouseLeave={handleLeaveClickToPlay}>
                <button
                    className="px-8 py-3 rounded-md text-white font-semibold hover:text-white transition duration-300 mb-4"
                    onClick={rerouteToRandomID}
                    style={{ backgroundColor: isHoveredClickToPlay ? '#C9D7F8' : '#D4C5E2' }}
                >
                    Click to play
                </button>
            </div>
            <div className='flex flex-col items-center'>
                <p className="text-2xl font-serif font-bold mb-4">Have an id?</p>
                <input
                    title="Enter id"
                    className="p-2 border border-gray-300 rounded-md mb-4"
                    value={userEnteredID}
                    onChange={(e) => setUserEnteredID(e.target.value)}
                />
                <div onMouseEnter={handleHoverClickToSubmit}
                    onMouseLeave={handleLeaveClickToSubmit}>
                    <button
                        className="px-8 py-3 rounded-md text-white font-semibold hover:text-white transition duration-300"
                        onClick={rerouteWithEnteredID}
                        style={{ backgroundColor: isHoveredClickToSubmit ? '#C9D7F8' : '#D4C5E2' }}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Home;
