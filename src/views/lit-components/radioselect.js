import { LitElement, html, css } from "lit";

export default class RadioSelect extends LitElement {
    constructor() {
        super();
        this.choices = "0,1";
        this.name = "radio";
        this.__value = "";
        this.placeholder = "";
        this.error = ""
    }

    static get properties() {
        return {
            name: { type: String },
            value: { type: String },
            placeholder : {type : String},
            choices: { type: String },
            error : {type : String}
        }
    }
    get value() {
        if (this.shadowRoot) {
            let vv = this.shadowRoot.querySelector(":checked")
            if (vv) {
                return vv.value;
            }
        }
        return this.__value;
    }
    set value(val){
        let oldVal = this.__value;
        this.__value = val;
        this.requestUpdate('value', oldVal);
    }
    static get styles() {
        return css`
        span{
            font-size:.8rem;
            color : #cccccc
        }
        .radio__div{
            display : block;
            padding : 4px
        }
        .radio__option {
            border-radius: 5px;
            cursor: pointer;
            padding: 0 10px;
            border: 2px solid lightgrey;
        }
        .radio__option:checked + label {
            color: red;
          }
        span.error{
            color : #ff0000
        }
        `

    }
    render() {
        const splits = this.choices.split(",");
        return html`
        <span>${this.placeholder}</span>
        <div class="radio__div">
            

            ${splits.map(item => html`
                    
            <input
            class="radio__option" 
            id="id_${item}"
            type="radio" 
            name="${this.name}" 
            value="${item}">
            </input>
            <label for="id_${item}">   
                ${item}
            </label>`)}
        </div>
        ${this.error.split("|").map(e=>{return html`<span class="error">${e}</span>`})}
        
        `

    }
}
customElements.define('radio-select', RadioSelect);
