import logo from './logo.svg';
import './App.css';


function Main() {
    const apiUrl = process.env.REACT_APP_API_URL;

    const getGroops = async () => {
        const getUrl = apiUrl;
        const response = await fetch(apiUrl, {
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
                <button onClick={getGroops}>button here</button>
                <p className='flex items-center'>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
            </header>
        </div>
    );
}

export default Main;