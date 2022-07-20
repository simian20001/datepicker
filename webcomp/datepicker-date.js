/* Define the Date-Picker Date component */
(function(){
    const template = document.createElement('template');
    
    // Date Box HTML
    template.innerHTML = `
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
    
    <div class="datebox">
    <div class="day"></div>
    <div class="date"></div>
    </div>`
    
    // picker-date custom element definition
    customElements.define('picker-date',
    class extends HTMLElement {
        constructor() {
            // Apply template HTML
            super().append(template.content.cloneNode(true));
            
            // Initialise local component properties
            this.week = 0;
            this.$date = 0;
            this.$month = 0;
            this.$months = ['jan','feb','mrt','apr','mei','juni','juli','aug','sep','okt','nov','dec'];
            
            // Nodes of interest
            this.$day = this.querySelector('.day');
            this.$datebox = this.querySelector('.datebox');
            
            // Determine day string for this instance from component 'id' attribute
            const days=['Ma','Di','Wo','Do','Vr'];
            this.$day.innerHTML = (this.id?days[parseInt(this.id)-1]:'ERROR');
            // Calculate correct starting text
            this.render();
            
            // Add listener for events on the Event Bus (parent node)
            this.parentNode.addEventListener('changeWeek', (e) => {
                // Recover week change value from event detail
                this.week += e.detail.change;
                // Limit lowest value to zero
                if (this.week < 0) this.week = 0;
                // Recalculate text fields
                this.render();
            });            
            
            // Add listener for onClick and dispatch an event that can be detected outside the shadow root
            this.$datebox.addEventListener('click', () => {
                // Only dispatch event if the current date for this component is in the future (not greyed out in the UI)
                if (this.$datebox.style.color === 'rgb(0, 0, 0)') {
                    const datepicked = new CustomEvent('datepicked',{composed: true, detail: {date: this.$date,month: this.$month}});
                    this.dispatchEvent(datepicked);
                }
            });
        }
        
        // Calculate the correct text for this component
        render (){
            // Determine today's date
            const today = new Date();
            // Render date in grey if date has already passed else black
            this.$datebox.style.color = (parseInt(this.week) === 0 && (today.getDay() > (parseInt(this.id)))) ? "#CCCCCC" : "#000000";
            // Modify "today" to the correct date for the button, handling month boundary when required
            today.setDate(today.getDate()+(7*this.week)+(parseInt(this.id)-today.getDay()));
            // Update day & date properties
            this.$date = today.getDate();
            this.$month = today.getMonth();
            // Render date
            this.querySelector('.date').innerHTML = `${this.$date} ${this.$months[this.$month]}`    
        }
    });
}) ();