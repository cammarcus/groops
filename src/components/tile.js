import { useState, useEffect } from 'react';

function Tile({tilename, groupNum, selectedTiles, setSelectedTiles, attempt}) {

    const[clicked, setClicked] = useState(false);

    useEffect(() => {
        setClicked(false);
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
        <button onClick={tileClicked}>
            {clicked ? (
                <div className="grid-item p-4 bg-neutral-500">
                    {tilename}
                </div>
            ) : (
                <div className="grid-item p-4 bg-neutral-200">
                    {tilename}
                </div>
            )}
        </button>
    );
}

export default Tile;