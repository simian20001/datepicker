/* Define the Date-Picker Date component */
(function(){
    const template = document.createElement('template');
    
    // Component HTML
    template.innerHTML = `
    <!-- Style Definition -->
    <style>
    .datebox {
        display: inline-block;
        width: 100px;
        padding: 8px;
        text-align: center;
        vertical-align: middle;
        border: 1px solid black;
    }
    
    .day {
        font-size: 40px;
        font-weight: bold;
    }
    
    .date {
        font-size: 20px;
    }
    </style>
    
    <!-- Layout Definition -->
    <div class="datebox">
        <div class="day"></div>
        <div class="date"></div>
    </div>`
    
    // Define custom element
    customElements.define('picker-date',
    class extends HTMLElement {
        constructor() {
            // Apply template HTML
            super().append(template.content.cloneNode(true));
            
            // Define names for days and months
            const days = ['zo','ma','di','wo','do','vr','za'];
            const months =  ['jan','feb','mrt','apr','mei','juni','juli','aug','sep','okt','nov','dec'];

            // Initialise local properties
            this.$week = 0;             // Weeks relative to this week
            this.$date = 0;             // Current date value for this component
            this.$month= 0;            // Current month value for this component
            this.$dateValid = false;    // Is the current date a valid choice
            this.$months = months;      // Make list of months available to render()
            
            // Identify nodes of interest
            this.$_day = this.querySelector('.day');
            this.$_datebox = this.querySelector('.datebox');
            
            // Determine day string for this instance, using 'id' attribute
            this.$_day.innerHTML = (this.id?days[parseInt(this.id)]:'ERROR');
            // Calculate correct starting date text and text colour
            this.render();
            
            // **********************
            // *** Event Handling ***
            // **********************

            // Add listener for 'changeWeek' on the Event Bus
            this.parentNode.addEventListener('changeWeek', (e) => {
                // Recover week change value from event detail
                this.$week += e.detail.change;
                // Limit lowest value to zero
                if (this.$week < 0) this.$week = 0;
                if (this.$week > this.parentNode.$maxWeek) this.$week = this.parentNode.$maxWeek;
                // Recalculate text fields
                this.render();
            });            
            
            // Add listener for 'onClick' - dispatch 'datepicked' outside the shadow root
            this.$_datebox.addEventListener('click', () => {
                // Disable event dispatch if current date is greyed out in the UI
                if (this.$dateValid) {
                    // Add current date and month values to event detail
                    const datepicked = new CustomEvent('datepicked',{composed: true, detail: {date: this.$date,month: this.$month}});
                    this.dispatchEvent(datepicked);
                }
            });
        }
        
        // Calculate the correct text for this component
        render (){
            // Determine today's date
            const today = new Date();

            // Determine if this date is a valid choice, ie has day passed?
            const id = parseInt(this.id);
            if (id === 0 || id === 6) this.$dateValid = false;
            else this.$dateValid = (parseInt(this.$week) === 0 && (today.getDay() > (parseInt(this.id)))) ? false : true;
            // Render date in grey if not valid
            this.$_datebox.style.color = (this.$dateValid ? "#000000" : "#CCCCCC");

            // Modify "today" to the correct date for the button in a way that handles a month boundary when required
            today.setDate(today.getDate()+(7*this.$week)+(parseInt(this.id)-today.getDay()));
            // Update day & date properties
            this.$date = today.getDate();
            this.$month= today.getMonth();
            // Render date
            this.querySelector('.date').innerHTML = `${this.$date} ${this.$months[this.$month]}`    
        }
    });
}) ();