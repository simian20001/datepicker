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
    <dp-arrow id="al"></dp-arrow>
    <dp-date id="1"></dp-date>
    <dp-date id="2"></dp-date>
    <dp-date id="3"></dp-date>
    <dp-date id="4"></dp-date>
    <dp-date id="5"></dp-date>
    <dp-arrow id="ar"></dp-arrow>
    </div>`
    
    customElements.define('date-picker',
    class extends HTMLElement {
        constructor() {
            super()
            this.loadSubs();
        }
        
        get week(){
            if (this._props.week) return this._props.week;
        }
        
        set week(newVal){
            this._props.week = newVal;
            // When week is changed then propagate to sub-components
            this.shadowRoot.querySelectorAll('dp-date').forEach(node => {
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
            }
        }
        
        // Synchronously load all dependencies (add to document head) then build component
        loadSub(scripts,baseURL) {
            if (scripts.length){
                const file = scripts.shift();
                const tagAttr = {
                    src: `${baseURL}/${file}.js?`,
                    //type: '',
                    onerror: () => {
                        console.warn(`script load error: ${file}`);
                    }
                }

                if (scripts.length) {
                    // If there are more scripts then run this function again after current dependancy has loaded
                    tagAttr.onload = () => {
                        console.log(`script dependency loaded: ${file}`);
                        this.loadSub(scripts,baseURL);
                    }
                } else {
                    // If this is the last dependancy then schedule building of the component once depency loaded
                    tagAttr.onload = () => {
                        console.log(`script dependency loaded: ${file}`);
                        this.buildComp();
                    }
                }
                document.head.append(Object.assign(document.createElement('script'),tagAttr));    
            }
        }
        
        // Define where dependencies are found and trigger synchronous loading
        loadSubs () {
            // ### Load sub-components ###
            // Determine URL where sub-components can be found (assumes they live with main component)
            const compURL=document.head.querySelector("script[src$='datepicker.js']").src
            const baseURL=compURL.substring(0,compURL.indexOf('/datepicker.js'));
            
            // Provide list of sub-component files to load
            const scripts=[
                'datepicker-arrow',
                'datepicker-date'
            ];
            
            this.loadSub(scripts,baseURL);
        }
        
        // The 'normal' Contructor() content for this component
        buildComp() {
            this.attachShadow({ mode: 'open' }).append(template.content.cloneNode(true));
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
            });
            this.$buttonR.addEventListener('click', () => {
                let week = parseInt(this.week);
                week += 1;
                this.week = String(week);
                this.$buttonL.style.color='#000000';
                
            });
        }
        
    });
    
}) ();