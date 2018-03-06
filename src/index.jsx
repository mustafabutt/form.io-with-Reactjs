import * as React from 'react';
import "./assets/styles/main.scss";
import {render} from 'react-dom';
import {Provider} from "react-redux";
import {FormioComponent} from './components/formComponent/formComp';
window.React = React;
// window.store = store;

render(
    <Provider >
        <FormioComponent/>
    </Provider>
    ,document.getElementById("react-container")
);