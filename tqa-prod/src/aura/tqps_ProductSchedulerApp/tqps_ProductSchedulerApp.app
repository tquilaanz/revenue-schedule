<aura:application access="global" >
    <ltng:require styles="/resource/slds090/assets/styles/salesforce-lightning-design-system.min.css" />
    <aura:dependency resource="markup://c:*" type="COMPONENT"/>
    <aura:attribute name="recordId" type="String" />
    
    <div class="slds">
   		<c:tqps_ProductSchedulerTable recordId="{!v.recordId}" />
    </div>
</aura:application>