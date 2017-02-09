({
	recalculateTotal : function(component) {
		var recalculateEvent = component.getEvent("recalculateSchedule");
        recalculateEvent.fire();
	}
})