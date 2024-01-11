

function Tile({tilename}) {


    return (
        <button>
            <div className="grid-item p-4 bg-neutral-200">
                {tilename}
            </div>
        </button>
    );
}

export default Tile;