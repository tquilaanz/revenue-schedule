({
	toggleFilterSection : function(component, event, helper) {
        var divElement = event.target;
        
		var parentLi = divElement.parentElement;

        var currentState = parentLi.getAttribute("aria-expanded");
        if(currentState === 'false'){
            parentLi.setAttribute("aria-expanded","true"); 
        }
        else{
            parentLi.setAttribute("aria-expanded","false"); 
        }
        
        var filterElement = parentLi.children[1];
        $A.util.toggleClass(filterElement,'slds-is-collapsed');
	}
})