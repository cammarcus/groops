import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';


function Tile({ tilename, groupNum, selectedTiles, setSelectedTiles, attemptsRemaining, attempt }) {

    const [clicked, setClicked] = useState(false);
    const controls = useAnimation();

    const handleShake = async () => {
        // Animate the shaking effect
        await controls.start({
            x: [-5, 5, -5, 5, 0], // Move left, right, left, right, back to the center
            transition: { duration: 0.5, ease: 'easeInOut' },
        });
    };

    const handleBounce = async () => {
        // Animate the shaking effect
        await controls.start({
            y: [-10, 0], // Move up once
            transition: { duration: .5, ease: 'easeInOut' },
        });
    };

    useEffect(() => {
        //figure out which index it is of selected tiles
        let tileIndex = selectedTiles.indexOf(tilename);
        let delay = 150 * tileIndex;
        console.log(delay)
        setTimeout(() => {
            if (clicked) {
                handleBounce();
            }
          }, delay);
    }, [attempt])

    useEffect(() => {
        //setClicked(false);
        setTimeout(() => {
            if (clicked) {
                handleShake();
            }
          }, 1000);
    }, [attemptsRemaining])

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
        <button className='flex w-full h-full min-h-24' onClick={tileClicked}>
            <motion.div
                className="flex w-full h-full grid-item"
                animate={controls}
                initial={{ x: 0, y: 0 }}
            >
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
            </motion.div>
        </button>
    );
}

export default Tile;