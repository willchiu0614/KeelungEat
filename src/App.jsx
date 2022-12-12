import React from 'react'

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Main from './pages/Main.jsx'
import Recommended from './pages/Recommended.jsx'
import Restaurant from './pages/Restaurant.jsx'
import Admin_Main from './pages/Admin_Main.jsx'
import Personal from './pages/Personal.jsx'
import DeliveryMain from './pages/DeliveryMain.jsx'
import RestaurantMain from './pages/RestaurantMain.jsx'
import New_Restaurant from './pages/New_Restaurant.jsx'
import Modify_Restaurant from './pages/Modify_Restaurant.jsx'

class App extends React.Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route path="/RestaurantMain">
                        <RestaurantMain />
                    </Route>
                    <Route path="/Restaurant/:rest_name">
                        <Restaurant/>
                    </Route>
                    <Route path="/Recommended/:district/:address">
                        <Recommended/>
                    </Route>
                    <Route path="/Personal">
                        <Personal />
                    </Route>
                    <Route path="/Delivery">
                        <DeliveryMain />
                    </Route>
                    <Route path="/Admin">
                        <Admin_Main />
                    </Route>
                    <Route path="/Modify_Restaurant">
                        <Modify_Restaurant />
                    </Route>
                    <Route path="/New_Restaurant">
                        <New_Restaurant />
                    </Route>
                    <Route exact path="/">
                        <Main />
                    </Route>
                </Switch>
            </Router>
        )
    }
}

export default App