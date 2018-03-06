import {Component} from "react";
import FacebookLogin from 'react-facebook-login';
import {Formio} from 'react-formio';
import {reactLocalStorage} from 'reactjs-localstorage';
import {GoogleLogin,GoogleLogout } from 'react-google-login-logout';

export class FormioComponent extends Component{

    constructor(){
        super();
        //default state
        this.state = {
            facebookResponse:"",
            googleResponse:"",
            formSubmitted:false,
            serverResponse :false
        }
        this.clearLocalStorage = this.clearLocalStorage.bind(this)
        this.responseFacebook = this.responseFacebook.bind(this); // function triggers after successful facebook login
        this.formLoad = this.formLoad.bind(this);                 // function call when instance of form.io loaded
        this.submitData = this.submitData.bind(this);             // triggers when data is submitted
        this.logout = this.logout.bind(this);                     // on facebook/google logout
        this.responseGoogle = this.responseGoogle.bind(this);     // function triggers after successful google login

    }
    // triggers on form submitted successfully
    submitData (data){
        //checks either form submitted or user going to add the other complaint
        data == '1' ? this.setState({formSubmitted:true}) :this.setState({formSubmitted:false})
    }

    // triggers on successfully login with facebook
    responseFacebook  (response) {
        reactLocalStorage.set('facebookAccessToken', response.accessToken);
        reactLocalStorage.set('facebookResponseName',response.name)
        this.setState({facebookResponse: response,formSubmitted:false,serverResponse:true})

        setTimeout(function() { this.setState({serverResponse:false}); }.bind(this), 5000);
    }

    // triggers when instance of form.io loads into the browser
    formLoad(data) {

        if(reactLocalStorage.get('facebookResponseName') != 'undefined'){
            data.components[0].defaultValue = ''
            data.components[1].defaultValue = reactLocalStorage.get('facebookResponseName');
        }else if(reactLocalStorage.get('googleAccessToken') != 'undefined'){
            data.components[0].defaultValue = reactLocalStorage.get('googleAccessEmail');
            data.components[1].defaultValue = reactLocalStorage.get('googleAccessName');
        }

    }

    // triggers on successfully login with google
    responseGoogle(response) {
        reactLocalStorage.set('googleAccessToken', response.accessToken);
        reactLocalStorage.set('googleAccessName', response.profileObj.name);
        reactLocalStorage.set('googleAccessEmail', response.profileObj.email);
        this.setState({googleResponse:response,formSubmitted:false,serverResponse:true})
        setTimeout(function() { this.setState({serverResponse:false}); }.bind(this), 5000);
    }

    // triggers on successfully logout either with facebook or google
    logout(){
        this.clearLocalStorage();
    }

    // it is called to clear the localstorage on logout
    clearLocalStorage(){
        reactLocalStorage.set('facebookAccessToken',undefined);
        reactLocalStorage.set('facebookResponseName',undefined);
        reactLocalStorage.set('googleAccessToken',undefined)
        reactLocalStorage.set('googleAccessEmail',undefined);
        reactLocalStorage.set('googleAccessName',undefined);
        this.setState({});
    }


    render(){

        return(
            <span style={{'position':'absolute','left':'470px'}}>
                {
                    (reactLocalStorage.get('facebookAccessToken') != 'undefined' ?
                        this.state.serverResponse ? <h1>loading...</h1> :
                            <span><button onClick={this.logout} className="btn btn-primary">Log out</button>
                                {
                                    !this.state.formSubmitted ?
                                    <Formio  src="https://dllrjpspcvqjmlb.form.io/filltheformtofileacomplaint" onFormLoad ={this.formLoad}
                                         onFormSubmit ={() => this.submitData('1')} /> :<span>
                                    <button onClick={() => this.submitData('2')} className="submit-complaint" >Submit an other Complaint</button> <h1>submitted</h1></span>
                                }
                            </span>
                        : reactLocalStorage.get('googleAccessToken') == 'undefined' ? <FacebookLogin  appId="845737402273089" autoLoad={false} fields="name,email"  callback={this.responseFacebook} />:
                    null)
                }

                {
                    (reactLocalStorage.get('googleAccessToken') != 'undefined' ?
                        this.state.serverResponse ? <h1>loading...</h1> :
                            <span> <GoogleLogout buttonText="Logout" clientId="267823593202-thtn0brdt5g7tnhs34q31d1ts0rl0o0i.apps.googleusercontent.com"  onLogoutSuccess={this.logout}  ></GoogleLogout>
                                {
                                    !this.state.formSubmitted ? <Formio src="https://dllrjpspcvqjmlb.form.io/filltheformtofileacomplaint" onFormLoad ={this.formLoad} onFormSubmit ={() => this.submitData('1')} />
                                    :<span> <button className="submit-complaint" onClick={() => this.submitData('2')}>Submit an other Complaint</button> <h1>submitted</h1></span>
                                }
                            </span> :
                            reactLocalStorage.get('facebookAccessToken') == 'undefined' ?
                                <GoogleLogin clientId="267823593202-thtn0brdt5g7tnhs34q31d1ts0rl0o0i.apps.googleusercontent.com" buttonText="Login with Google" onSuccess={this.responseGoogle} onFailure={this.responseGoogle}/> :
                    null)
                }
            </span>

        );
    }
}
