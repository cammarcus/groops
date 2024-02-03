import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Create() {
    const navigate = useNavigate();
    const getUrl = 'https://ts2pxvn89b.execute-api.us-east-1.amazonaws.com/items';
    const [userEnteredID, setUserEnteredID] = useState('');
    const [isHoveredClickToPlay, setIsHoveredClickToPlay] = useState(false);
    const [isHoveredClickToSubmit, setIsHoveredClickToSubmit] = useState(false);

    

    return (
        <div>
            <p>Create</p>
        </div>
    )
}

export default Create;