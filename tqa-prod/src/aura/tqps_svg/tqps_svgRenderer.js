({
  render: function(component, helper) {
    // By default, after the component finished loading data/handling events,https://devenltng-dev-ed.my.salesforce.com/_ui/common/apex/debug/ApexCSIPage#
    // it will call this render function this.superRender() will call the
    // render function in the parent component.
    var ret = this.superRender();

    // Calls the helper function to append the SVG icon
    helper.renderIcon(component);
    return ret;
  }
})