import React,{Component} from 'react';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import { makeStyles } from "@material-ui/core/styles";
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { css } from "@emotion/core";
import ClipLoader from "react-spinners/ClipLoader";
import Rating from '@material-ui/lab/Rating';

import "./Review_Notifications.css";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: blue;
`;

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography component={'div'}>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  };
  
  function a11yProps(index) {
    return {
      id: `vertical-tab-${index}`,
      'aria-controls': `vertical-tabpanel-${index}`,
    };
  }


class Review_Notifications extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            reservations:[],
            reviews:[],
            //stars:[],
            value:0,
        };
        this.handleClickOpen=this.handleClickOpen.bind(this);
        this.change_report_text=this.change_report_text.bind(this);
        this.change_report_grade=this.change_report_grade.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
        this.fetch_create_review=this.fetch_create_review.bind(this);
        this.fetch_reservations=this.fetch_reservations.bind(this);
        this.fetch_review_reservation=this.fetch_review_reservation.bind(this);
        
      }
      handleClickOpen = (event,newValue) => {
        this.setState({  
            value: newValue 
        });
      };

      init_comments_text(index_num){
        if(this.state.reviews[index_num]== null){
          var joined=this.state.reviews;
          joined[index_num]="";
          this.setState({
            reviews:joined
          })
        }
      }

      componentWillMount(){
        this.fetch_reservations();
      }

      fetch_reservations= async () => { 
        const data = await fetch('http://localhost:3001/reservation/byrenter/'+this.props.userData._id, {
          method: 'GET',
          headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          // body: JSON.stringify(this.state)
        // body: JSON.stringify({
        //     password:this.state.password,
        //     username:this.state.username,
        // })
        });
        if(data.status===200){
            const resultData = await data.json();
            // console.log("DATA");
            // console.log(resultData);
            let joined=[];
            resultData.reservation.map((item,index)=>{
              if(item.doc.accepted===true && item.doc.reviewed===false){
                //if(new Date(date_to).toISOString().slice(0,10)<= new Date().toISOString().slice(0,10)){
                joined.push({
                  renterid: item.doc.renterid,
                  apartid: item.doc.apartid,
                  date: new Date(),
                  text: '',
                  grade: 2.5,
                })
               // }
              }
            })
            this.setState({ 
                reservations: resultData.reservation,
                reviews:joined,
              });
          }
          else{
            console.log("Error Code : " + data.status + "\nError Message : " + data.statusText);
          }
    }

    fetch_create_review= async () => { 
      const data = await fetch('http://localhost:3001/review', {
        method: 'POST',
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
       body: JSON.stringify(this.state.reviews[this.state.value])
      // body: JSON.stringify({
      //     password:this.state.password,
      //     username:this.state.username,
      // })
      });
      if(data.status===200){
          //const resultData = await data.json();
          // console.log("PETYXE");
          this.fetch_review_reservation()
        }
        else{
          console.log("Error Code : " + data.status + "\nError Message : " + data.statusText);
        }
  }

  fetch_review_reservation= async () => { 
    const data = await fetch('http://localhost:3001/reservation/'+this.state.reservations[this.state.value].doc._id, {
      method: 'PATCH',
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
     body: JSON.stringify({reviewed:true})
    // body: JSON.stringify({
    //     password:this.state.password,
    //     username:this.state.username,
    // })
    });
    if(data.status===200){
        //const resultData = await data.json();
        // console.log("PETYXE");
      }
      else{
        console.log("Error Code : " + data.status + "\nError Message : " + data.statusText);
      }
}
  


      change_report_text=(event)=>{        
        
        let newVal = event.target.value;  
        var joined=this.state.reviews;
        joined[this.state.value].text=newVal;    
          this.setState({
            reviews:joined
          });
      }

      change_report_grade=(event)=>{        
        
        let newVal = event.target.value;  
        var joined=this.state.reviews;
        joined[this.state.value].grade=newVal;    
          this.setState({
            reviews:joined
          });
      }

      handleSubmit=()=>{
        console.log(this.state);
        this.fetch_create_review();
        //this.fetch_review_reservation()
        this.props.handleClose();
      }


    
    render() {
      if (this.state.reviews ===null || this.state.reviews ===undefined) {
        return (
            <div className="sweet-loading">
                <ClipLoader
                css={override}
                size={150}
                color={"#123abc"}
                loading={true}
                />
            </div>
        )
      }
      return(
        <React.Fragment>
            <Dialog open={true} fullWidth={true} maxWidth = {'md'} onClose={this.props.handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Reviews</DialogTitle>
            <div style={{
                display: "flex",
                height: 224}}>
            <Tabs 
                value={this.state.value}
                onChange={this.handleClickOpen}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"
                orientation="vertical"
                aria-label="Vertical tabs example"
                >
                {this.state.reviews.map((item,index_num) =>                     
                    <Tab key={index_num} label={item.apartid} {...a11yProps(index_num)} />
                    
                )}                    
            </Tabs>
            {this.state.reviews.map((item,index_num)=>
                <TabPanel style={{width:"100%"}} className="tabpanel_fix" key={index_num} value={this.state.value} index={index_num}>
                     {/* {this.init_comments_text(index_num)} */}
                     <Rating name="half-rating" value={this.state.reviews[this.state.value].grade} onChange={(e)=>{ this.change_report_grade(e)}} precision={0.5} />
                    <TextField
                        id="standard-disabled"
                        // defaultValue={ "Report id : " + this.state.titles[index_num] +"\ncomments : " +item}
                        multiline
                        fullWidth
                        rows={3}
                        rowsMax={10}
                        variant="outlined"
                        value={this.state.reviews[this.state.value].text}
                        onChange={(e)=>{ this.change_report_text(e)}}
                        />
                            
                        
                    {/* {console.log(index_num)} */}
                </TabPanel>
            )}
            </div>
            

            
            <DialogActions>
            <Button onClick={this.props.handleClose} color="primary">
                Cancel
            </Button>
            <Button onClick={this.handleSubmit} color="primary">
                Subscribe
            </Button>
            </DialogActions>
        </Dialog>
        </React.Fragment>
      )
    }
  }

export default Review_Notifications;