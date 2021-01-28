import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const MyStyles = makeStyles ({
    footerStyle : {
      //fontWeight:"bold",
      fontFamily:"italic",
    }
  });


  export default function Footer(){
    const classes = MyStyles();
      return(
        <div className="Footer">
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Typography className={classes.footerStyle} variant="h5" align="center">
                  {/* <Link > */}
                    Terms of use
                  {/* </Link> */}
                </Typography>
              </Grid> 
              <Grid item xs={6}>
                <Typography className={classes.footerStyle} variant="h5" align="center">Copyright © 2020 All rights reserved. </Typography>
              </Grid>
            </Grid>
        </div>
    );
  
  }
