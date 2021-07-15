import { html, css, LitElement } from 'lit';

export class Jacold extends LitElement {
    static get styles() {
        return css`
        p { color: blue }
        button{
            font-size : 2rem;
        }
        `;
    }

    static get properties() {
        return {
            signs: { type: String }
        }
    }

    constructor() {
        super();
        this.signs = 'jacold';
    }
    _handleClick(evt){
        console.clear()
        console.log(evt.target)
    }

    render() {
        return html`<p>General examination<br>
     
        
        <input type="checkbox" name="j" value="J" @click="${this._handleClick}">Jaundice
        <input type="checkbox" name="a" value="A" @click="${this._handleClick}">Palor
        <input type="checkbox" name="c" value="C" @click="${this._handleClick}">Cyanosis
        <br>
        <input type="checkbox" name="o" value="O" @click="${this._handleClick}">Oedema
        <input type="checkbox" name="l" value="L" @click="${this._handleClick}">Lymphadenopathy
        <input type="checkbox" name="d" value="D" @click="${this._handleClick}">Dehydration
        
        `;
    }
}

//if (!customElements.get('my-jacold')) {
customElements.define('my-jacold', Jacold)
//}
