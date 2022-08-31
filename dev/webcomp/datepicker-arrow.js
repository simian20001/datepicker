/* Define the Date-Picker Arrow component */
(function(){
    const template = document.createElement('template');
    
    // Component HTML
    template.innerHTML = `
    <!-- Style Definition -->
    <style>
    .arrowbox {
        display: inline-block;
        min-width: 50px;
        text-align: center;
        padding: 8px;
        border: none;
        vertical-align: middle;
        font-size: 40px;
    }
    </style>
    
    <!-- Layout Definition -->
    <div class="arrowbox"></div>`
    
    // Define custom element
    customElements.define('picker-arrow',
    class extends HTMLElement {
        constructor() {
            super().append(template.content.cloneNode(true));
        }
        
        connectedCallback() {
            // Set arrow text           
            this.querySelector('.arrowbox').innerHTML = `&nbsp;${this.id === 'al'?'&lt;':'&gt;'}&nbsp;`;
            // Set initial colour
            this.$week = 0;
            this.render();

            // Listen for events on the Event Bus (parent node)
            this.parentNode.addEventListener('changeWeek', (e) => {
                // First time an arrow is pressed, pull value of $maxWeek from parentNode.
                //  It should be defined by the time the user is interacting with UI
                if (!this.$maxWeek) this.$maxWeek = this.parentNode.$maxWeek;

                // Modify the week value, respecting limits
                this.$week += e.detail.change;
                if (this.$week < 0) this.$week = 0;
                if (this.$week > this.$maxWeek) this.$week = this.$maxWeek;
                this.render();
            });
        }
        
        render() {
            // Change the colour of the arrows to reflect limits
            this.style.color = ((this.id === 'al' && this.$week === 0) || (this.id === 'ar' && this.$week === this.$maxWeek)) ? '#CCCCCC' : '#000000';
        }
        
        
    });
}) ();