/* Define the Main Date-Picker Element */
(function(){
    const template = document.createElement('template');
    
    // Date Picker Main Element
    template.innerHTML = `
    <style>
    .arrowbox {
        display: inline-block;
        min-width: 50px;
        text-align: center;
        padding: 8px;
        border: 1px solid red;
        vertical-align: middle;
        font-size: 40px;
    }
    </style>
    
    <div class="arrowbox"></div>`
    
    customElements.define('dp-arrow',
    class extends HTMLElement {
        constructor() {
            super().append(template.content.cloneNode(true));
        }
        
        connectedCallback() {
            // Set arrow text           
            this.querySelector('.arrowbox').innerHTML = `&nbsp;${this.id === 'al'?'&lt;':'&gt;'}&nbsp;`;
            // Set initial colour
            this.week=0
            this.render();
            this.parentNode.addEventListener('changeWeek', (e) => {
                this.week += e.detail.change;
                if (this.week < 0) this.week = 0;
                this.render();
            }
            );
        }
        
        render() {
            this.style.color = (this.id === 'al' && this.week === 0) ? '#CCCCCC' : '#000000';
        }
        
        
    });
}) ();