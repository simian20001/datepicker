/* Define the Main Date-Picker Component */
(function(){
    
    // Component HTML
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
    </style>
    
    <!-- Layout Definition -->
    <div id="container">
        <picker-arrow id="l">&nbsp;&lt;&nbsp;</picker-arrow>
        <picker-date id="1"></picker-date>
        <picker-date id="2"></picker-date>
        <picker-date id="3"></picker-date>
        <picker-date id="4"></picker-date>
        <picker-date id="5"></picker-date>
        <picker-arrow id="r">&nbsp;&gt;&nbsp;</picker-arrow>
    </div>`
    
    // Define custom element
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
            // Determine URL of dependacies - assumes they are stored at same location as the main component
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
            //  If array is now empty then schedule rest of contructor() content else schedule loading of next dependency
            tagAttr.onload = (scripts.length ? () => this.loadNextDependancy(scripts) : () => this.buildComp());
            // Trigger dependency loading by appending HTMLElement to document.head
            document.head.append(Object.assign(document.createElement('script'),tagAttr));    
        }
        
        // Content that would normally be in contructor() but needs to run AFTER sub-components have loaded
        buildComp() {
            this.attachShadow({ mode: 'open' }).append(template.content.cloneNode(true));
            
            // Define custom events for arrow clicks          
            const decWeek = new CustomEvent('changeWeek',{detail: {change: -1}});
            const incWeek = new CustomEvent('changeWeek',{detail: {change: 1}});
            
            // Identify useful nodes
            const $_eventBus = this.shadowRoot.querySelector('#container')
            const $_buttonL = this.shadowRoot.querySelector('#al');
            const $_buttonR = this.shadowRoot.querySelector('#ar');
            
            // Add onClick events to arrows to send a custom event to Event Bus
            $_buttonL.addEventListener('click', () => { $_eventBus.dispatchEvent(decWeek); });
            $_buttonR.addEventListener('click', () => { $_eventBus.dispatchEvent(incWeek); });
        }
    });
}) ();