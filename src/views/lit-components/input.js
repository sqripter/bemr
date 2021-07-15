import { html, css, LitElement } from 'lit';

export class TextInput extends LitElement {
    static get styles() {
        return css`
            div{
                display:inline-block
            }
            span{
                font-size:.8rem;
                color : #cccccc
            }
            input{
                padding : 4px
            }
            span.error{
                color : #FF0000;
                display : inline-block
            }
        `;
    }
    
    static get properties() {
        return {
            value: { type: String },
            placeholder: { type: String },
            type : {type:String},
            error : {type:String}
        }
    }

    keyup(evt){
        if(this.ctrl_input === undefined){
            this.ctrl_input = this.shadowRoot.querySelector("input[type]")
        }
        this.value = this.ctrl_input.value;
    }


    constructor() {
        super();
        this.type = "text"
        this.value = "";
        //this.__value = ""
        this.placeholder = "Enter text here";
        this.error = ""
    }

    render() {
        return html`
        <div>
        <span class="caption" >${this.placeholder}</span><br>
        <input @keyup="${this.keyup}" @change="${this.keyup}" type="${this.type}" placeholder="${this.placeholder}" .value="${this.value}"></input>
        <br>
        ${this.error.split("|").map(e=>{return html`<span class="error">${e}</span><br/>`})}
        
        <div>`;
    }
}


customElements.define('text-input', TextInput)

