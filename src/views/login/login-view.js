import '../css/views.css';

import { html, css, LitElement } from 'lit';
const __div__type = "bemr-login";

export default class Login extends LitElement {

    constructor(view, cfg) {
        super();
        this.view = view;
        this.href__success = "/search";
        this.href__cancel = "/home";
    }

    static get properties(){
        return {
            href__success    : {type:String}, 
            href__fail      : {type:String},
        }
    }

    static get styles() {
        return css`
        p { color: blue }
        button{
            font-size : 1rem;
        }
        .login{
            position: absolute;
            top: 50%;
            left: 50%;
            -ms-transform:translate(-50%, -50%);
            transform: translate(-50%, -50%);

            background-color : skyblue;

            padding : 12px;
        }
        .login__font{
            font-family: Verdana, Geneva, Tahoma, sans-serif;
            font-size: 0.9rem;
            font-weight: normal;
            font-style: normal;
        }
        .login label{
            display : inline-block;
            width : 54px;            
        }
        .login div{
            margin-top:24px
        }
        .login input{
            font-size : 1.2rem
        }

        /* Chrome, Safari, Edge, Opera */
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
        }

        /* Firefox */
        input[type=number] {
        -moz-appearance: textfield;
        }
        `;
    }

    repaint() {
        this.view.innerHTML = `<${__div__type} href__success="${this.href__success}"></${__div__type}>`;
    }

    btnLogin_click(evt) {
        //evt.stopImmediatePropagation()
    }

    render() {
        return html`
        <div class="login">
            <label class='login__font'>Login</label>
            <div>
                <label class='login__font'> Email </label> <input type="text">
            </div>
            <div>
                <label class='login__font'> PIN </label> <input type="password" pattern="[0-9]*" inputmode="numeric">
            </div>  
            <div>
                <button href="${this.href__success}" datalink>Login</button>
                <a href="${this.href__cancel}" datalink>Cancel</a>
            <div>
        </div>      
        `
    }
}

customElements.define(__div__type, Login)