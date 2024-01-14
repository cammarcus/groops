import { useState, useEffect } from 'react';

function Tile({tilename, groupNum, selectedTiles, setSelectedTiles, attempt}) {

    const[clicked, setClicked] = useState(false);

    useEffect(() => {
        //setClicked(false);
    }, [attempt])

    const tileClicked = async () => {
        if (clicked) {
            setSelectedTiles(selectedTiles => selectedTiles.filter(item => item !== tilename));
            setClicked(!clicked)
        } else {
            if (selectedTiles.length < 4) {
                setSelectedTiles(selectedTiles => selectedTiles.concat(tilename));
                setClicked(!clicked)
            }
        }
    }

    return (
        <button className='flex w-full h-full min-h-24'  onClick={tileClicked}>
            {clicked ? (
                <div className="flex items-center justify-center grid-item w-full h-full bg-neutral-500 p-1 rounded-md">
                    <p className='text-sm sm:text-lg font-bold uppercase break-all'>
                        {tilename}
                    </p>
                </div>
            ) : (
                <div className="break-words flex sm:text-sm items-center justify-center grid-item w-full h-full bg-neutral-200 p-1 rounded-md">
                    <p className='text-sm sm:text-lg font-bold uppercase break-all'>
                        {tilename}
                    </p>
                </div>
            )}
        </button>
    );
}

export default Tile;