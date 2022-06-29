/* Define the Main Date-Picker Element */
(function(){
    const template = document.createElement('template');
    
    // Date Picker Main Element
    template.innerHTML = `
    <style>
    .arrowbox {
        padding: 8px;
        border: 1px solid red;
        font-size: 40px;
    }
    </style>
    
    <div class="arrowbox"></div>`
    
    customElements.define('dp-arrow',
    class extends HTMLElement {
        constructor() {
            super().append(template.content.cloneNode(true));
            // Object to hold shadow properties for properties with setters
            
            this.querySelector('.arrowbox').innerHTML = `&nbsp;${this.id === 'al'?'&lt;':'&gt;'}&nbsp;`;
        }        
        
    });
}) ();