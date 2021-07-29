import styles from "./kbd.css"

import Text from '../../modules/text'

import css_font from "./../css/material_icons.css"

//<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

const __MAX_HINTS = 5

export default class Keyboard {
    constructor(selector) {
        this.selector = selector; // selector for control to which the inputmode attr should be change
        this.elements = {
            main: null,
            keysContainer: null,
            keys: [],
            hintPad: null,
            hintButtons: [],
            suggestions: []
        }

        this.handlers = {
            oninput: null,
            onclose: null,
        }
        this.props = {
            value: "",
            capsLock: false,
            currentSelectionStart : 0

        }
        this.T = new Text()
    }

    init() {
        document.body.style = "min-height:2000px";
        this.elements.main = document.createElement("div");
        this.elements.keysContainer = document.createElement("div");

        //setup main elements
        this.elements.main.classList.add("keyboard", "keyboard--hidden");
        this.elements.main.appendChild(this.__createHintPad())

        this.elements.keysContainer.classList.add("keyboard_keys");
        this.elements.keysContainer.appendChild(this.__createKeys());

        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);

        this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");

        this.current_ctrl = null;

        this.attachEvents()
        this.__populateHintPad()

    }


    empty_cache() {
        this.props.value = ""
        this.current_ctrl = null
    }
    attachEvents() {
        const inst = this;
        const func_focus = (function (__this) {
            return (function (evt) {

                inst.elements.main.classList.remove("keyboard--hidden")
                inst.current_ctrl = evt.path[0];

                let _ss = inst.current_ctrl.selectionStart
                let _value = inst.current_ctrl.value
                let _len = _value.length

                while(_ss < _len){

                    if( ([" ", "\n"].indexOf(_value[_ss])) > -1){
                        break;
                    }
                    _ss += 1
                }
                inst.current_ctrl.selectionStart = _ss;
                inst.props.currentSelectionStart = _ss;


                console.log("Selection start  is NOW: ",inst.current_ctrl.selectionStart)
                

            })
        })(this);

        const func_keyEvent = (function (__this) {
            return (function (evt) {
                __this.__readCtrlText()
                switch(evt.key){
                    case "Enter":
                        inst.__triggerEvents("enter");
                    default:
                        inst.__triggerEvents("normal")
                }
                
            })
        })(this);

        document.querySelectorAll(`${this.selector}`).forEach(
            function (el) {
                el.setAttribute("inputmode", "none");

                el.addEventListener("focus", func_focus);

                el.addEventListener("click", func_focus);

                el.addEventListener("keyup", func_keyEvent);

            }
        )
    }
    __createHintPad() {
        this.elements.hintPad = document.createElement("div")
        this.elements.hintPad.classList.add("keyboard__hintpad")
        return this.elements.hintPad;
    }
    __createKeys() {

        const frag = document.createDocumentFragment();
        // `

        const keyString = "1 2 3 4 5 6 7 8 9 0 " +
            "# q w e r t y u i o p " +
            "# a s d f g h j k l " + //; 'keyboard_capslock keyboard_return " +
            "# keyboard_capslock z x c v b n m backspace " +
            "# vertical_align_bottom , ? space_bar . keyboard_return";
        const createIconHTML = icon_name => {
            return `<i class="material-icons">${icon_name}</i>`;
        }

        const keys = keyString.split(" ");
        for (const key of keys) {
            if (key === "#") {
                frag.appendChild(document.createElement("br"));
                continue
            }

            const keyBtn = document.createElement("button");
            keyBtn.setAttribute("type", "button");
            keyBtn.classList.add("keyboard__key");

            switch (key) {
                case "backspace":
                    keyBtn.classList.add("keyboard__key--wide");
                    keyBtn.innerHTML = createIconHTML(key);
                    keyBtn.addEventListener("click", (evt) => {
                        this.__readCtrlText();
                        if( this.current_ctrl.selectionStart >0 )this.__editCtrlText("",-1);
                        this.__triggerEvents("normal");

                        this.current_ctrl.focus()

                        evt.stopPropagation()
                    });
                    break;

                case "keyboard_capslock":
                    keyBtn.classList.add("keyboard__key--wide", "keyboard__key--activatable");
                    keyBtn.innerHTML = createIconHTML(key);
                    keyBtn.addEventListener("click", (evt) => {
                        this.__toggleCapsLock();
                        keyBtn.classList.toggle("keyboard__key--active", this.props.capsLock);
                        this.__readCtrlText()

                        let el = this.current_ctrl;
                        el.focus()

                        evt.stopPropagation()
                    });
                    break;
                case "keyboard_return":
                    keyBtn.classList.add("keyboard__key--wide");
                    keyBtn.innerHTML = createIconHTML(key);
                    keyBtn.addEventListener("click", (evt) => {

                        this.__readCtrlText();
                        
                        this.__editCtrlText("\n",1);

                        this.__triggerEvents("enter");

                        this.current_ctrl.focus()

                        evt.stopPropagation()
                    });
                    break;

                case "space_bar":
                    keyBtn.classList.add("keyboard__key--extra-wide");
                    keyBtn.innerHTML = createIconHTML(key);
                    keyBtn.addEventListener("click", (evt) => {
                        this.__readCtrlText();
                        
                        this.__editCtrlText(" ",1);

                        this.__triggerEvents("normal");

                        this.current_ctrl.focus()

                        evt.stopPropagation()
                    });
                    break;
                case "vertical_align_bottom":
                        keyBtn.classList.add("keyboard__key--wide");
                        keyBtn.innerHTML = createIconHTML(key);
                        keyBtn.addEventListener("click", (evt) => {
                            this.elements.main.classList.add("keyboard--hidden")
                            this.current_ctrl.blur()

                            evt.stopPropagation();
                        });
                        break;

                default:
                    keyBtn.textContent = key.toLowerCase();
                    keyBtn.addEventListener("click", (evt) => {
                        this.__readCtrlText()
                        
                        let v =  this.props.capsLock ? key.toUpperCase() : key.toLowerCase();
                    
                        this.__editCtrlText(v,1)

                        this.__triggerEvents("normal");

                        this.current_ctrl.focus()

                        evt.stopPropagation();
                    });
                    break;
            }
            frag.appendChild(keyBtn);
        }
        return frag;

    }


    __triggerEvents(keyType) {
        switch (keyType) {
            case "normal":
                let s = this.current_ctrl.value.slice(0,this.props.currentSelectionStart);
                this.elements.suggestions = this.T.textEvent(s)
                this.__populateHintPad(this.elements.suggestions)
                break;
            case "enter":
                //this.elements.suggestions = this.T.textEvent(this.props.value)
                this.__populateHintPad([])
                break
        }
    }

    __hintToElement(evt) {
        let index = this.elements.hintButtons.indexOf(evt.target)
        let s = this.elements.suggestions[index];
        let suffix = s["hint"].slice(s["stem"].length) + " "

        this.__editCtrlText(suffix, suffix.length)

        this.__readCtrlText()
        this.__triggerEvents("normal")
        this.current_ctrl.focus()

    }
    __populateHintPad(hints) {
        if (this.elements.hintButtons.length == 0) {
            for (let h = 0; h < __MAX_HINTS; ++h) {
                const btn = document.createElement("div")
                btn.classList.add("keyboard__key", "keyboard__key__hintbutton")
                btn.addEventListener("click", e => this.__hintToElement(e))
                this.elements.hintButtons.push(btn)
                this.elements.hintPad.appendChild(btn)
            }
        }

        let len = hints.length;
        this.elements.hintButtons.forEach((hbtn, index) => {
            hbtn.textContent = (index < len) ? hints[index]["hint"] : "";
        })
    }
    __readCtrlText() { // it may be a different method when we swithc to editable divs

        this.props.value = this.current_ctrl.value;

    }

    __editCtrlText(text,delta) {

        let elm = this.current_ctrl

        let ss = this.props.currentSelectionStart;

        let gamma = delta > 0 ? 0 : -1;

        elm.value = this.props.value.slice(0,ss+gamma) + text + this.props.value.slice(ss);

        this.props.value = elm.value;

        this.props.currentSelectionStart += delta;

        elm.selectionStart = this.props.currentSelectionStart;
        elm.selectionEnd = elm.selectionStart

        if(elm.clientHeight < elm.scrollHeight){
            elm.style.height = `${(elm.scrollHeight + 10)}px`; // the 10 includes roughly the padding(4+4) and borderwidth(1+1)
        }
    }

    __toggleCapsLock() {
        console.log("Caps toggled")
        this.props.capsLock = !this.props.capsLock;

        for (const key of this.elements.keys) {
            if (key.childElementCount == 0) {
                key.textContent = this.props.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase()
            }
        }
    }

    open(initText, evtOnInput, evtOnClose) {

    }

}