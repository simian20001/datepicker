/* Define the Main Date-Picker Element */
(function(){
    
    const template = document.createElement('template');
    
    // Date Picker Main Element
    //        font-family: candara, arial, verdana, helvetica, sans-serif;
    //        font-family: Candara, Calibri, Segoe, Segoe UI, Optima, Arial, sans-serif;
    template.innerHTML = `
    <!-- Style Definition -->
    <style>
    #container {
        display: inline-block;
        font-family: Candara, Calibri, Segoe, Segoe UI, Optima, Arial, sans-serif;
        border: none;
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
    <div id="container">
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
            // Synchonously load dependencies.  Rest of contructor now in buildComp()
            this.loadDependancies();
        }
                
        // Define where dependencies are found and trigger synchronous loading
        loadDependancies () {
            // List of dependancies to load
            const scripts=[
                'datepicker-arrow',
                'datepicker-date'
            ];

            // Determine URL of dependacies - assumes they can be found at same location as this component
            const compURL=document.head.querySelector("script[src$='datepicker.js']").src
            const baseURL=compURL.substring(0,compURL.indexOf('datepicker.js'));
            
            // Convert array of dependancy names to an array of full paths
            scripts.forEach((item,index,arr) => {arr[index]=`${baseURL}${item}.js`});

            // initiate the loading process
            this.loadNextDependancy(scripts);
        }
        
        // Load a depndancy and sequence next action
        loadNextDependancy(scripts) {
            // Check that an array with at least one dependancy has been passed
            if (!scripts.length) {
                console.log('Failed to load dependancies.');
                return;
            }
            // Pop an element from the array (array length reduced by one)
            const file = scripts.shift();
            // Define the script to load plus onError event
            const tagAttr = {
                src: `${file}`,
                onerror: () => {
                    console.warn(`script load error: ${file}`);
                }
            }
            // Once this dependancy is loaded then schedule next else continue contructor of this component
            tagAttr.onload = (scripts.length ? () => this.loadNextDependancy(scripts) : () => this.buildComp());
            // Trigger dependancy loading by adding to document.head
            document.head.append(Object.assign(document.createElement('script'),tagAttr));    
        }
        
        // The 'normal' Contructor() content for this component
        buildComp() {
            this.attachShadow({ mode: 'open' }).append(template.content.cloneNode(true));
            
            // Define custom events            
            const decWeek = new CustomEvent('changeWeek',{detail: {change: -1}});
            const incWeek = new CustomEvent('changeWeek',{detail: {change: 1}});
            
            // Set useful nodes
            const $eventBus = this.shadowRoot.querySelector('#container')
            const $buttonL = this.shadowRoot.querySelector('#al');
            const $buttonR = this.shadowRoot.querySelector('#ar');
            
            // Add onClick events to arrows to send a custom event to Event Bus
            $buttonL.addEventListener('click', () => { $eventBus.dispatchEvent(decWeek); });
            $buttonR.addEventListener('click', () => { $eventBus.dispatchEvent(incWeek); });
        }
        
    });
    
}) ();