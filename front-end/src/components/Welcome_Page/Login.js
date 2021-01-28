import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

class Login extends Component {
    constructor(props){
        super(props);

        this.state = {
            pathname:'',
            username:'',
            password:'',
            showErrorMessage: false,            
        };
        
        this.change_username=this.change_username.bind(this);
        this.change_password=this.change_password.bind(this);
        this.submit_handler=this.submit_handler.bind(this);
        this.fetchUser_login=this.fetchUser_login.bind(this);
        this.handleLoginError=this.handleLoginError.bind(this);
    }

    handleLoginError = () => {
        this.setState({
          showErrorMessage : true,
        })
      
    }
  
    handleCloseSnackBar = (event, reason) => {
  
      if (reason === 'clickaway') {
        return;
      }
  
      this.setState({  
          showErrorMessage: false ,
        });   
  }
  

    fetchUser_login = async () => { 
      const data = await fetch('http://localhost:3001/user/login', {
        method: 'POST',
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        // body: JSON.stringify(this.state)
      body: JSON.stringify({
          password:this.state.password,
          username:this.state.username,
      })
      });
      if(data.status===200){
        const userData = await data.json();
        // console.log(userData);
        if(userData.role==="renter"){
          
          this.props.change_token(userData);
          this.props.handleClose();
        }
        else if(userData.role==="hoster"){
          this.props.p_props.history.push({
            pathname: '/Host',
            state: { detail: userData }
          })  
        }
        else if(userData.role==="admin"){
          this.props.p_props.history.push({
            pathname: '/admin',
            state: { detail: userData }
          })  
        }
      }
      else{
      //   this.handleLoginError(data.status);
      this.handleLoginError()
        console.log("Error Code : " + data.status + "\nError Message : " + data.statusText);
      }
  
    }

    change_username=(event)=>{
        this.setState({
            username:event.target.value
        });
        }

    change_password=(event)=>{
        this.setState({
          password:event.target.value
        });
      }

      submit_handler=(event)=>{
        event.preventDefault();
        // console.log(this.state.username);
        // console.log(this.state.password);
        this.fetchUser_login();
        // console.log(this.state.token);
        // alert("username: "+this.state.username + " password: "+this.state.password);
        // console.log(this.state.username+" "+this.state.password);
        // this.fetchUser();
        // this.props.change_pass(this.state.password);
        // this.props.change_user(this.state.username);
        
      }
    
    render(){
        return(
            
                <Dialog open={true} onClose={this.props.handleClose} aria-labelledby="form-dialog-title">
                    <form onSubmit={this.submit_handler}>
                        <DialogTitle id="form-dialog-title"><Typography align="center" variant="h4" gutterBottom>Σύνδεση</Typography></DialogTitle>
                        <DialogContent>
                        {/* <DialogContentText>
                            To subscribe to this website, please enter your email address here. We will send updates
                            occasionally.
                        </DialogContentText> */}
                        <Typography align="center" variant="h5" gutterBottom>Πληκτρολογήστε τα στοιχεία σας!</Typography>
                        <TextField required variant="outlined" label="ONOMA" fullWidth margin="normal" onChange={this.change_username}>
                            
                        </TextField>
                        <TextField required type="password" className="red_cls" variant="outlined" label="ΚΩΔΙΚΟΣ" fullWidth margin="normal" onChange={this.change_password}>
                            
                        </TextField>
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={this.props.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button  
                            type="submit"
                            variant="contained" 
                            // onClick={this.props.handleClose} 
                            color="primary">
                            Συνδεση
                        </Button>
                        </DialogActions>
                    </form>
                    <Snackbar open={this.state.showErrorMessage} autoHideDuration={4000} onClose={this.handleCloseSnackBar}>
                      <Alert onClose={this.handleCloseSnackBar} variant="filled" severity="error">
                          Τα στοιχεία που δώσατε δεν μπορούν να επιβεβαιωθούν.Ελέξτε τις πληροφορίες που εισάγατε.
                      </Alert>
                  </Snackbar>

                </Dialog>
          
        );
    }


}

export default Login;