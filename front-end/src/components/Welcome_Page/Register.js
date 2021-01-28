import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import CardActionArea from "@material-ui/core/CardActionArea";
import { Link } from 'react-router-dom';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import Image from '../../Pictures/register_pic.jpg'; // Import using relative path;

import './Register.css';

const styles = {
    paperContainer: {
        height: 200,
        maxWidth:"100%",
        backgroundImage: `url(${Image})`,
        backgroundRepeat:"no-repeat",
        backgroundSize: "100% 100%"
    }
};


  
class Register extends Component {
    constructor(props){
        super(props);

        this.state = {
            username:'',
            password:'',
            Confirm_pass:'',
            name:'',
            lastname:'',
            email:'',
            role:'',
            photo:null,

        };
        
        this.handlePhotoChange=this.handlePhotoChange.bind(this);
        this.handleChangeText=this.handleChangeText.bind(this);
        this.imageResetHandler=this.imageResetHandler.bind(this);
        this.ReturnWelcome=this.ReturnWelcome.bind(this);
        this.handleConfirm=this.handleConfirm.bind(this);
        this.fetchUser_sign_up=this.fetchUser_sign_up.bind(this);
    }

    handleChangeText=(e,name)=>{
        this.setState({
            [name]:e.target.value
        });
    }

    handlePhotoChange= (event) => {
        var file = event.target.files[0];
        const reader = new FileReader();
        var url = reader.readAsDataURL(file);
        let file_size = event.target.files[0].size;
        // console.log(file_size);
        if(file_size>1000000){
            return;
        }
        reader.onloadend = function(e) {
            this.setState({
            photo: reader.result
            });
        }.bind(this);
        // console.log(url); // Would see a path?
    
        this.setState({
            mainState: "uploaded",
            photo: event.target.files[0],
            imageUploaded: 1
        });
          
        
        // this.setState({
        //     photo : e.target.value
        // })
    }

    fetchUser_sign_up = async () => { 
        const formData = new FormData();
        for(var propName in this.state) {
            // console.log(propName+"____"+this.state[propName]);
            formData.append(propName, this.state[propName]);
            // var value = this.state[propName];
            // updateOps[propName] = value;
        }
        // console.log(formData.get("username"));
        
        const data = await fetch('http://localhost:3001/user/signup/photo', {
          method: 'POST',
        //   headers: { 
        //     'Accept': 'application/json',
        //     'Content-Type': 'multipart/form-data'
        //   },
        //   file:JSON.stringify({path:this.state.photo}),
          body: formData
        //   JSON.stringify(this.state)
        // body: JSON.stringify({
        //     password:this.state.password,
        //     email:this.state.email,
        //     name:this.state.name,
        //     lastname:this.state.lastname,
        //     role:this.state.role,
        //     username:this.state.username,
        // })
        });
        if(data.status===200){
    
        //   const userData = await data.json();
          console.log("EGINE");
          this.props.history.push({
                pathname: '/Welcome_Page'
            })
        }
        else{
        //   this.handleLoginError(data.status);
          console.log("Error Code : " + data.status + "\nError Message : " + data.statusText);
        }
    
      }

    imageResetHandler = event => {
        // console.log("Click!");
        this.setState({
          mainState: "initial",
          photo: null,
          imageUploaded: 0
        });
      };

    submit_handler=(event)=>{
        event.preventDefault();
        // this.handleClickSnackBar();
        // this.reset_all();
        // this.createIncident();
        // console.log(this.state);
        this.fetchUser_sign_up();
    }

    ReturnWelcome=(e)=>{
        this.props.history.push({
            pathname: '/Welcome_Page'
        })
    }

    handleConfirm=()=>{
        if(this.state.Confirm_pass===""){
            return null;
        }
        if(this.state.Confirm_pass===this.state.password){
            return(<Typography >Όλα καλά</Typography>)
        }
        if(this.state.Confirm_pass!==this.state.password){
            return(<Typography >οχι Όλα καλά</Typography>)
        }
    }

    render(){
        const underlineStyle = this.succ ? { borderColor: 'green' } : null;
        return(
            <div >
                <Grid container style={styles.paperContainer}>
                    <Grid item xs={12}>
                        <Box display="flex" flexDirection="row" justifyContent="flex-start">
                        <Link to="/Welcome_Page"  >
                        <Typography className="title_class"
                            align='center'variant='h4' fontWeight="bold">Best Booking</Typography>
                        </Link>    
                        
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography className="reg_class" align="center" variant="h3" >Εγγραφή</Typography>
                    </Grid>

                    
                </Grid>
                <form onSubmit={this.submit_handler}>
                <Grid container className="mrg_box">
                
                        <Grid container spacing={0} className="mrg_box2">
                            <Grid item xs={6}>
                                <div className="title_padding">
                                    <Typography align="right">Όνομα Χρήστη</Typography>
                                </div>
                            </Grid>
                            <Grid item justify="left" xs={6}>
                                <div className="title_box">
                                    <TextField 
                                    value={this.state.username}
                                    className="boxesStyle"
                                    onChange={(e)=>this.handleChangeText(e,"username")}
                                    variant="outlined" 
                                    size="medium"
                                    required
                                    />
                                </div>
                            </Grid>
                        </Grid>
                        <Grid container spacing={0} className="mrg_box2">
                            <Grid item xs={6}>
                                <div className="title_padding">
                                    <Typography align="right">Κωδικός Χρήστη</Typography>
                                </div>
                            </Grid>
                            <Grid item justify="left" xs={6}>
                                <div className="title_box">
                                    <TextField 
                                    value={this.state.password}
                                    className="boxesStyle"
                                    onChange={(e)=>this.handleChangeText(e,"password")}
                                    variant="outlined" 
                                    size="medium"
                                    type="password"
                                    required
                                    />
                                </div>
                            </Grid>
                        </Grid>
                        <Grid container spacing={0} className="mrg_box2">
                            <Grid item xs={6}>
                                <div className="title_padding">
                                    <Typography align="right">Επιβεβαίωση Κωδικού Χρήστη</Typography>
                                </div>
                            </Grid>
                            <Grid item justify="left" xs={6}>
                                <div className="title_box">
                                    <TextField 
                                    value={this.state.Confirm_pass}
                                    className="boxesStyle"
                                    onChange={(e)=>this.handleChangeText(e,"Confirm_pass")} 
                                    variant="outlined" 
                                    size="medium"
                                    type="password"
                                    borderColor="green"
                                    required
                                    />
                                    {this.handleConfirm()}
                                </div>
                                
                            </Grid>
                        </Grid>
                        <Grid container spacing={0} className="mrg_box2">
                            <Grid item xs={6}>
                                <div className="title_padding">
                                    <Typography align="right">Όνομα</Typography>
                                </div>
                            </Grid>
                            <Grid item justify="left" xs={6}>
                                <div className="title_box">
                                    <TextField 
                                    value={this.state.name}
                                    className="boxesStyle"
                                    onChange={(e)=>this.handleChangeText(e,"name")}
                                    variant="outlined" 
                                    size="medium"
                                    required
                                    />
                                </div>
                            </Grid>
                        </Grid>
                        <Grid container spacing={0} className="mrg_box2">
                            <Grid item xs={6}>
                                <div className="title_padding">
                                    <Typography align="right">Επώνυμο</Typography>
                                </div>
                            </Grid>
                            <Grid item justify="left" xs={6}>
                                <div className="title_box">
                                    <TextField 
                                    value={this.state.lastname}
                                    className="boxesStyle"       
                                    onChange={(e)=>this.handleChangeText(e,"lastname")}             
                                    variant="outlined" 
                                    size="medium"
                                    required
                                    />
                                </div>
                            </Grid>
                        </Grid>
                        <Grid container spacing={0} className="mrg_box2">
                            <Grid item xs={6}>
                                <div className="title_padding">
                                    <Typography align="right">Διεύθυνση Ηλεκτρονικού Ταχυδρομείου</Typography>
                                </div>
                            </Grid>
                            <Grid item justify="left" xs={6}>
                                <div className="title_box">
                                    <TextField 
                                    value={this.state.email}
                                    className="boxesStyle"
                                    onChange={(e)=>this.handleChangeText(e,"email")}
                                    id="outlined-basic" 
                                    variant="outlined" 
                                    size="medium"
                                    required
                                    />
                                </div>
                            </Grid>
                        </Grid>
                        <Grid container spacing={0} className="mrg_box2">
                            <Grid item xs={6}>
                                <div className="title_padding">
                                    <Typography align="right">Ρόλος</Typography>
                                </div>
                            </Grid>
                            <Grid item justify="left" xs={6}>
                                <div className="title_box">
                                <InputLabel  id="demo-customized-select-label">role</InputLabel>
                                    <Select
                                    style={{width:"35%"}}
                                    labelId="demo-customized-select-label"
                                    id="demo-customized-select"
                                    value={this.state.role}
                                    onChange={(e)=>this.handleChangeText(e,"role")}
                                    required
                                    // input={<BootstrapInput />}
                                    >
                                    <MenuItem value={"renter"}>Ενοικιαστής</MenuItem>
                                    <MenuItem value={"hoster"}>Οικοδεσπότης</MenuItem>
                                    </Select>
                                    {/* <TextField 
                                    value={this.state.role}
                                    className="boxesStyle"
                                    onChange={(e)=>this.handleChangeText(e,"role")}
                                    id="outlined-basic" 
                                    variant="outlined" 
                                    size="medium"
                                    
                                    /> */}
                                </div>
                            </Grid>
                        </Grid>
                        <Grid container spacing={0} className="mrg_box2">
                            <Grid item xs={6}>
                                <div className="title_padding">
                                    <Typography align="right">Φωτογραφία</Typography>
                                </div>
                            </Grid>
                            <Grid item xs={6}>
                                <div className="title_padding">
                                <input
                                    onChange={this.handlePhotoChange}
                                    type="file"
                                    // style={{ display: "none" }}
                                />
                                </div>
                            </Grid>
                            {/* <Button
                                variant="contained"
                                component="label"
                                >
                                Upload File
                                <input
                                    onChange={this.handlePhotoChange}
                                    type="file"
                                    // style={{ display: "none" }}
                                />
                                </Button> */}
                                {/* <div className="title_padding">
                                    <Typography >{this.state.photo}</Typography>
                                </div> */}
                        </Grid>
                        <Grid container spacing={5} className="mrg_box2">
                            <Grid item xs={6}>
                            <Box className="buttons_box" display="flex" flexDirection="row" justifyContent="flex-end">
                                <Button
                                    className="submit_button"
                                    size="large"
                                    color="primary"
                                    onClick={this.ReturnWelcome}
                                    // disabled={this.handleSubmitButtonStatus()}
                                >
                                    ΑΚΥΡΩΣΗ
                                </Button>
                            </Box>
                                
                            </Grid>
                            <Grid item xs={6}>
                                <Button
                                    className="submit_button"
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    size="large"
                                    // disabled={this.handleSubmitButtonStatus()}
                                >
                                    ΔΗΛΩΣΗ
                                </Button>
                                
                            </Grid>
                        </Grid>
                        
                    </Grid>
                
                    </form> 
                    <CardActionArea onClick={this.imageResetHandler}>
                        <img
                        width="100px"
                        height="100px"
                        src={this.state.photo}
                        />
                    </CardActionArea>
            </div>
        );
    }


}

export default Register;