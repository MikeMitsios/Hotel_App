import React,{Component} from 'react';
import Footer from './components/Footer/Footer.js';
import {BrowserRouter as Router,Switch, Route} from 'react-router-dom';
import Welcome_Page from './components/Welcome_Page/Welcome_Page.js';
import Register from './components/Welcome_Page/Register.js';
import Results_Page from './components/Results_Page/Results_Page.js';
import Profile from './components/profile/profile.js'
import Host_page from './components/Host/Host_page.js'
import Room_Page from './components/Results_Page/Room_Page.js'
import Admin_page from './components/Admin/admin.js'

import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

import './App.css';

class App extends Component{
  constructor(props){
    super(props);
    
  }

  render(){
    console.log("HELLO");
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <div className="App">
      <Router>
        
          {/* <Header pathname={window.location.pathname}></Header> */}
          {/* <Route component={Header}></Route> */}
          <Switch>
            <Route exact path="/" component={Welcome_Page}></Route>
            <Route path="/Welcome_Page" component={Welcome_Page}></Route>
            <Route path="/Register" component={Register}></Route>
            <Route path="/Room_Page" component={Room_Page}></Route>
            <Route path="/Results_Page" component={Results_Page}></Route>
            <Route path="/Profile" component={Profile}></Route>
            <Route path="/Host" component={Host_page}></Route>
            <Route path="/Admin" component={Admin_page}></Route>

          </Switch>
          <Footer></Footer>
       
      </Router>
      </div>
      </MuiPickersUtilsProvider>
    );
  }
  


}


export default App;
