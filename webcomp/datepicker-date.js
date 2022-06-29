/* Define the Main Date-Picker Element */
(function(){
    const template = document.createElement('template');
    
    // Date Picker Main Element
    template.innerHTML = `
    <style>
    .datebox {
        width: 100px;
        padding: 8px;
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
    
    customElements.define('dp-date',
    class extends HTMLElement {
        constructor() {
            console.log('contructing dp-date');
            // Apply template HTML
            super().append(template.content.cloneNode(true));
            // Object to hold shadow properties for properties with setters
            this._props = { week: 0 }; 
            
            // Determine day string for this instance from 'id' attribute
            const days=['Ma','Di','Wo','Do','Vr'];
            this.querySelector('.day').innerHTML = (this.id?days[parseInt(this.id)-1]:'ERROR');
            this.render();            
        }
        
        // Handle property/attribute mirroring
        get currentWeek(){
            return this._props.week;
        }
        
        set currentWeek(newVal){
            console.log('setter fired');
            this._props.week = newVal;
            this.render();
        }
        
        // Listen for changes in these tagAttr
        static get observedAttributes() {
            return ['week'];
        }

        attributeChangedCallback(name, oldVal, newVal) {
            // If Property is flagged as having a setter then just update the shadow property
            if ( Object.keys(this._props).indexOf(name) == -1 ) this[name] = newVal;
            else this._props[name] = newVal;
            this.render();
        }
        
        render (){
            const today = new Date();
            // Render date in grey if date has already passed else black
            this.querySelector('.datebox').style.color = (parseInt(this.currentWeek) === 0 && (today.getDay() > (parseInt(this.id)))) ? "#CCCCCC" : "#000000";
            // Modify "today" to the correct day for the button, handling month boundary if required
            today.setDate(today.getDate()+(7*this.currentWeek)+(parseInt(this.id)-today.getDay()));
            // Render date
            this.querySelector('.date').innerHTML = `${today.getDate()} ${this.get_month(today.getMonth())}`    
        }
        
        get_month (month) {
            //Convert month number to abbreviated text
            const months=['jan','feb','mrt','apr','mei','juni','juli','aug','sep','okt','nov','dec'];
            return months[month];
        }   
    });
}) ();