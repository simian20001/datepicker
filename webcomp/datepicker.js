/* Define the Main Date-Picker Element */
(function(){
    
    // Date Picker Element HTML
    const template = document.createElement('template');
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
    <picker-date id="1"></picker-date>
    <picker-date id="2"></picker-date>
    <picker-date id="3"></picker-date>
    <picker-date id="4"></picker-date>
    <picker-date id="5"></picker-date>
    <dp-arrow id="ar"></dp-arrow>
    </div>`
    
    // Date Picker custom element definition
    customElements.define('date-picker',
    class extends HTMLElement {
        constructor() {
            super()
            // Synchonously load dependencies.
            this.loadDependancies();
            // Rest of contructor now in buildComp() function and occurs after last dependency has loaded
        }
        
        // Define where dependencies are found and trigger synchronous loading
        loadDependancies () {
            // List of dependencies to load
            const scripts=[
                'datepicker-arrow',
                'datepicker-date'
            ];
            // Determine URL of dependacies - assumes they can be found at same location as the main component
            const compURL=document.head.querySelector("script[src$='datepicker.js']").src
            const baseURL=compURL.substring(0,compURL.indexOf('datepicker.js'));
            // Convert array of dependency names to full paths
            scripts.forEach((item,index,arr) => {arr[index]=`${baseURL}${item}.js`});
            // Start the loading process
            this.loadNextDependancy(scripts);
        }
        
        // Load a dependency and sequence next action
        loadNextDependancy(scripts) {
            // Check that an array with at least one dependency has been passed
            if (!scripts.length) {
                console.error('List of dependencies missing!');
                return;
            }
            // Get 1st element of the array, array length reduced by one
            const file = scripts.shift();
            // Define the script HTMLElement and add an onError event
            const tagAttr = {
                src: `${file}`,
                onerror: () => {
                    console.warn(`script load error: ${file}`);
                }
            }
            // Define an onLoad event for the HTMLElement.  
            // If array is empty then schedule rest of contructor else schedule loading of next dependency
            tagAttr.onload = (scripts.length ? () => this.loadNextDependancy(scripts) : () => this.buildComp());
            // Trigger dependency loading by adding HTMLElement to document.head
            document.head.append(Object.assign(document.createElement('script'),tagAttr));    
        }
        
        // The 'normal' Contructor() content for this component
        buildComp() {
            this.attachShadow({ mode: 'open' }).append(template.content.cloneNode(true));
            
            // Define custom events for arrow clicks          
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