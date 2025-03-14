import './App.css'
import { createLogger } from './libs/logger/logger';
import Login from './Login'

const logger = createLogger('App');

function App() {

    logger.info('App started');

  return (
    <>
     <Login />
    </>
  )
}

export default App
