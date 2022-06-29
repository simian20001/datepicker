/* Define the Main Date-Picker Element */
(function(){
    
    const template = document.createElement('template');
    
    // Date Picker Main Element
    //        font-family: candara, arial, verdana, helvetica, sans-serif;
    //        font-family: Candara, Calibri, Segoe, Segoe UI, Optima, Arial, sans-serif;
    template.innerHTML = `
    <!-- Style Definition -->
    <style>
    .grid-container {
        display: inline-block;
        font-family: Candara, Calibri, Segoe, Segoe UI, Optima, Arial, sans-serif;
        border-style: solid;
        border-color: red;
        font-size: 0;
    }
    
    .g-item {
        display: inline-block;
        min-width: 50px;
        text-align: center;
        padding: 8px;
        border: 1px solid blue;
        vertical-align: middle;
    }
    </style>
    
    <!-- Layout Definition -->
    <div class="grid-container">
    <div class="g-item"><dp-arrow id="al"></dp-arrow></div>
    <div class="g-item"><dp-date id="1"></dp-date></div>
    <div class="g-item"><dp-date id="2"></dp-date></div>
    <div class="g-item"><dp-date id="3"></dp-date></div>
    <div class="g-item"><dp-date id="4"></dp-date></div>
    <div class="g-item"><dp-date id="5"></dp-date></div>
    <div class="g-item"><dp-arrow id="ar"></dp-arrow></div>
    </div>`
    
    customElements.define('date-picker',
    class extends HTMLElement {
        constructor() {
            super()
            this.loadSubs();
            this.attachShadow({ mode: 'open' }).append(template.content.cloneNode(true));
            console.log('appended ');
            setTimeout(() => {
                
                this._props = {}; // Object to hold shadow properties for properties with setters
                this.week = '0';
                
                // Get button nodes
                this.$buttonL = this.shadowRoot.querySelector("#al");
                this.$buttonR = this.shadowRoot.querySelector("#ar");
                
                // Initalise left button to grey
                this.$buttonL.style.color='#CCCCCC';
                
                // Add onClick events
                this.$buttonL.addEventListener('click', () => {
                    let week = parseInt(this.week);
                    if ( week > 0) {
                        week -= 1;
                        this.week = String(week);
                        if (week == 0) this.$buttonL.style.color='#CCCCCC';
                    }
                })
                this.$buttonR.addEventListener('click', () => {
                    let week = parseInt(this.week);
                    week += 1;
                    this.week = String(week);
                    this.$buttonL.style.color='#000000';
                    
                })
            });
        }
        
        get week(){
            if (this._props.week) return this._props.week;
        }
        
        set week(newVal){
            this._props.week = newVal;
            // When week is changed then propagate to sub-components
            this.shadowRoot.querySelectorAll('dp-date').forEach(node => {
                //node.setAttribute('week', parseInt(newVal));
                console.log({node});
                //debugger;
                node.currentWeek=parseInt(newVal);
            });
        }
        
        // Listen for changes in these tagAttr
        static get observedAttributes() {
            return ['week'];
        }
        
        attributeChangedCallback(name, oldVal, newVal) {
            // Check for spurious callback
            if (oldVal !== newVal) {
                // If Property is flagged as having a setter then just update the shadow property
                if ( Object.keys(this._props).indexOf(name) !== -1 ) this._props[name] = newVal;
                else this[name] = newVal;
                this.render();
            }
        }
        
        render (){
            console.log('date-picker rendered')
        }
        
        loadSubs (){
            // ### Load sub-components ###
            // Determine URL where sub-components can be found (assumes they live with main component)
            const compURL=document.head.querySelector("script[src$='datepicker.js']").src
            const baseURL=compURL.substring(0,compURL.indexOf('/datepicker.js'));
            
            // Provide list of sub-component files to load
            const scripts=[
                'datepicker-arrow',
                'datepicker-date'
            ];
            
            // Load script files by adding <script> nodes to <head>
            while (scripts.length){
                const file = scripts.shift();
                const tagAttr = {
                    src: `${baseURL}/${file}.js?`,
                    //type: '',
                    onerror: () => {
                        console.warn(`script load error: ${file}`);
                    },
                    onload: () => {
                        console.log(`script dependency loaded: ${file}`);
                    }
                }
                document.head.append(Object.assign(document.createElement('script'),tagAttr));    
                
            }    
        }
        
    });
    
}) ();