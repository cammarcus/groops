import logo from './logo.svg';
import './App.css';


function Main() {
    const apiUrl = 'https://ts2pxvn89b.execute-api.us-east-1.amazonaws.com/items/';

    const getGroops = async (groopIdInput) => {
        let groopId = groopIdInput;
        groopId = groopId.toString()
        const getUrl = apiUrl + groopId;
        const response = await fetch(getUrl, {
            method: 'GET'
        })
        console.log(response)
        const data = await response.json();
        console.log('Data:', data);
    };

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
                <button onClick={() => getGroops(34)}>button here</button>
                <p className='flex items-center'>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
            </header>
        </div>
    );
}

export default Main;