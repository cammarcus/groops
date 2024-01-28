import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


function Error() {
    const navigate = useNavigate();

    const returnToHome = () => {
        navigate('/');
    }

    const [isHoveredReturnHome, setIsHoveredReturnHome] = useState(false);

    const handleHoverReturnHome = () => {
        setIsHoveredReturnHome(true);
    };

    const handleLeaveReturnHome = () => {
        setIsHoveredReturnHome(false);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen p-4 bg-gray-100 text-gray-900">
            <div className="text-4xl font-serif font-bold mb-4">Page Not Found</div>
            <p className="text-lg mb-8">Looks like our words took a detour. Let's get you back on the right path!</p>
            <div onMouseEnter={handleHoverReturnHome}
                onMouseLeave={handleLeaveReturnHome}>
                <button
                    className="px-8 py-3 rounded-md text-white font-semibold hover:bg-indigo-500 hover:text-white transition duration-300"
                    onClick={returnToHome}
                    style={{ backgroundColor: isHoveredReturnHome ? '#C9D7F8' : '#D4C5E2' }}
                >
                    Return Home
                </button>
            </div>
        </div>
    );
}

export default Error;






