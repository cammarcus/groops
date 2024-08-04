import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();
    const getUrl = 'https://ts2pxvn89b.execute-api.us-east-1.amazonaws.com/items';
    const [userEnteredID, setUserEnteredID] = useState('');
    const [isHovered, setIsHovered] = useState({
        clickToPlay: false,
        clickToSubmit: false,
        clickToCreate: false,
    });

    const handleMouseEnter = (button) => {
        setIsHovered((prev) => ({ ...prev, [button]: true }));
    };

    const handleMouseLeave = (button) => {
        setIsHovered((prev) => ({ ...prev, [button]: false }));
    };

    const rerouteToRandomID = async () => {
        let rerouteId = '/error';
        try {
            const response = await fetch(getUrl, { method: 'GET' });
            const data = await response.json();
            rerouteId = `/${data.toString()}`;
        } catch (error) {
            console.error('Error fetching random ID:', error);
        }
        navigate(rerouteId);
    };

    const rerouteWithEnteredID = () => {
        navigate(`/${userEnteredID}`);
    };

    const rerouteToCreate = () => {
        navigate('/create');
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen p-4 bg-gray-100 text-gray-900">
            <h1 className="text-center text-4xl font-serif font-bold mb-8">Welcome to Groops</h1>

            <button
                className="w-64 mb-12 px-8 py-3 rounded-full text-white font-semibold transition-transform transform hover:scale-105 shadow-lg"
                onClick={rerouteToRandomID}
                onMouseEnter={() => handleMouseEnter('clickToPlay')}
                onMouseLeave={() => handleMouseLeave('clickToPlay')}
                style={{ backgroundColor: isHovered.clickToPlay ? '#C9D7F8' : '#D4C5E2' }}
            >
                Click to Play
            </button>

            <button
                className="w-64 mb-12 px-8 py-3 rounded-full text-white font-semibold transition-transform transform hover:scale-105 shadow-lg"
                onClick={rerouteToCreate}
                onMouseEnter={() => handleMouseEnter('clickToCreate')}
                onMouseLeave={() => handleMouseLeave('clickToCreate')}
                style={{ backgroundColor: isHovered.clickToCreate ? '#C9D7F8' : '#D4C5E2' }}
            >
                Create Your Own
            </button>

            <div className="flex flex-col items-center mt-12">
                <p className="text-xl font-serif font-bold mb-4">Have an ID?</p>
                <input
                    title="Enter ID"
                    className="w-64 p-2 border border-gray-300 rounded-md mb-4 bg-gray-100 focus:ring-2 focus:ring-purple-500"
                    value={userEnteredID}
                    onChange={(e) => setUserEnteredID(e.target.value)}
                />
                <button
                    className="w-64 px-8 py-3 rounded-full text-white font-semibold transition-transform transform hover:scale-105 shadow-lg"
                    onClick={rerouteWithEnteredID}
                    onMouseEnter={() => handleMouseEnter('clickToSubmit')}
                    onMouseLeave={() => handleMouseLeave('clickToSubmit')}
                    style={{ backgroundColor: isHovered.clickToSubmit ? '#C9D7F8' : '#D4C5E2' }}
                >
                    Submit
                </button>
            </div>
        </div>
    );
}

export default Home;
