Ext.ns('UTILS');
UTILS = function() {
	return {
		showHelpTip : function(title,text, time){
			var msg = new Ext.Tip({
			 	html:text,
			 	title:title,
			 	width:250,
			 	autoHeight: true,
			 	closable: true,
			 	frame:true,
			 	renderTo: Ext.get('mapDiv')
			});
			msg.show();
			msg.showAt(1,1);
			setTimeout(function(){
		       msg.destroy();
		    }, time);
		},
		getDateCode: function(currentDate){
			var day = currentDate.getDate().toString();
			if (day.length==1){ 
				day = '0'+day;
			}
			var mth = currentDate.getMonth()+1;
			var month = mth.toString();
			if (month.length==1){ 
				month = '0'+month;
			}
			var dateCode = currentDate.getFullYear()+''+month+''+day;
			return dateCode;
		}
		
	}
}();	


/**
* @auther Elvis Hsu
* @class Ext.ux.form.field.DateTime
* @extends Ext.form.FieldContainer  
* 
* inspired by http://www.sencha.com/forum/showthread.php?134345-Ext.ux.form.field.DateTime
* This class is used for user input 
*/
Ext.define('Ext.ux.form.field.DateTime', {
    extend:'Ext.form.FieldContainer',
    mixins: {
        field: 'Ext.form.field.Field'
    },
    alias: 'widget.datetimefield',
    layout: 'hbox',
    height: 22,
    /**
    * set combine errors to true for showing errorr
    */
    combineErrors: true,
    /**
    * set msg taeget to side
    */
    msgTarget :'side',  
    /**
    * we want hbox layout
    */
    layout: 'hbox',
    /**
    * set readonly to false
    */
    readOnly: false,    
    /**
    * @cfg {String} dateFormat
    * Convenience config for specifying the format of the date portion.
    * This value is overridden if format is specified in the dateConfig.
    * The default is 'Y-m-d'
    */
    dateFormat: 'Y-m-d',
    /**
     * @cfg {String} timeFormat
     * Convenience config for specifying the format of the time portion.
     * This value is overridden if format is specified in the timeConfig. 
     * The default is 'H:i:s'
     */
    timeFormat: 'H:i:s',
    /**
    * the datefield configurations
    */
    dateConfig:{},
    /**
    * the time field configurations
    */
    timeConfig:{},
    /**
    * The actual date value
    */
    dateValue: null,
    /**
     * @property dateField
     * @type Ext.form.field.Date
     */
    dateField: null,
    /**
     * @property timeField
     * @type Ext.form.field.Time
     */
    timeField: null,    
    /**
    * initialising the components
    */
    initComponent: function() {
        var me = this,
            key,
            tab;
        // set default to no items
        me.items = me.items || [];
        
        me.dateField = Ext.create('Ext.form.field.Date', Ext.apply({
            format:me.dateFormat,
            flex:1,
            isFormField:false, //exclude from field query's
            submitValue:false
        }, me.dateConfig));
        me.items.push(me.dateField);
        
        me.timeField = Ext.create('Ext.form.field.Time', Ext.apply({
            format:me.timeFormat,
            flex:1,
            isFormField:false, //exclude from field query's
            submitValue:false
        }, me.timeConfig));
        me.items.push(me.timeField);
        
        for (var i = 0; i < me.items.length; i++) {
            me.items[i].on('focus', Ext.bind(me.onItemFocus, me));
            me.items[i].on('blur', Ext.bind(me.onItemBlur, me));
            me.items[i].on('specialkey', function(field, event){
                key = event.getKey();
                tab = (key == event.TAB);
                
                if (tab && me.focussedItem == me.dateField) {
                    event.stopEvent();
                    me.timeField.focus();
                    return;
                }
                
                me.fireEvent('specialkey', field, event);
            });
        }

        me.callParent();
        
        // this dummy is necessary because Ext.Editor will not check whether an inputEl is present or not
        me.inputEl = {
            dom:{},
            swallowEvent:function(){}
        };
        
        me.initField();
    },
    /**
     * Try to focus this component.
     * @param {Boolean} [selectText] If applicable, true to also select the text in this component
     * @param {Boolean/Number} [delay] Delay the focus this number of milliseconds (true for 10 milliseconds).
     * @return {Ext.Component} this
     */
    focus:function(){
        this.callParent();
        this.dateField.focus();
    },

    onItemFocus:function(item){
        if (this.blurTask){
            this.blurTask.cancel();
        }
        this.focussedItem = item;
    },
    
    onItemBlur:function(item){
        var me = this;
        if (item != me.focussedItem){ return; }
        // 100ms to focus a new item that belongs to us, otherwise we will assume the user left the field
        me.blurTask = new Ext.util.DelayedTask(function(){
            me.fireEvent('blur', me);
        });
        me.blurTask.delay(100);
    },    
    /**
     * Returns the current data value of the field. The type of value returned is particular to the type of the
     * particular field (e.g. a Date object for {@link Ext.form.field.Date}).
     * @return {Object} value The field value
     */
    getValue: function() {
        var me = this,
            value = null,
            date = me.dateField.getSubmitValue(),
            time = me.timeField.getSubmitValue();
        if(date){
            if(time){
                var format = me.getFormat()
                value = Ext.Date.parse(date + ' ' + time,format)
            }else{
                value = me.dateField.getValue()
            }
        }
        return value
    },
    /**
     * Sets a data value into the field and runs the change detection and validation.
     * @param {Object} value The value to set
     * @return {Ext.form.field.Field} this
     */
    setValue: function(value){
        if (Ext.isString(value)){
            value = Ext.Date.parse(value, this.getFormat()); //this.dateTimeFormat
        }
        this.dateField.setValue(value);
        this.timeField.setValue(value);
    },
    /**
     * Resets the field's {@link #originalValue} property so it matches the current {@link #getValue value}. This is
     * called by {@link Ext.form.Basic}.{@link Ext.form.Basic#setValues setValues} if the form's
     * {@link Ext.form.Basic#trackResetOnLoad trackResetOnLoad} property is set to true.
     */
    resetOriginalValue: function() {
        var me = this;
        me.originalValue = me.getValue();
        me.dateField.resetOriginalValue();
        me.timeField.resetOriginalValue();
        me.checkDirty();
    },
    /**
     * Returns the value that would be included in a standard form submit for this field. This will be combined with the
     * field's name to form a name=value pair in the {@link #getSubmitData submitted parameters}. If an empty string is
     * returned then just the name= will be submitted; if null is returned then nothing will be submitted.
     *
     * Note that the value returned will have been {@link #processRawValue processed} but may or may not have been
     * successfully {@link #validate validated}.
     *
     * @return {String} The value to be submitted, or null.
     */
    getSubmitValue: function(){   
        var me = this,
            format = me.getFormat(),
            value = me.getValue();
            
        return value ? Ext.Date.format(value, format) : null;        
    },         
    /**
     * Returns the parameter(s) that would be included in a standard form submit for this field. Typically this will be
     * an object with a single name-value pair, the name being this field's {@link #getName name} and the value being
     * its current stringified value. More advanced field implementations may return more than one name-value pair.
     *
     * Note that the values returned from this method are not guaranteed to have been successfully {@link #validate
     * validated}.
     *
     * @return {Object} A mapping of submit parameter names to values; each value should be a string, or an array of
     * strings if that particular name has multiple values. It can also return null if there are no parameters to be
     * submitted.
     */
    getSubmitData: function(){
        var me = this,
            data = null;
            
        if (!me.disabled && me.submitValue && !me.isFileUpload()) {
            data = {};
            data[me.getName()] = '' + me.getSubmitValue();
        }
        return data;
    },
    /**
    * Gets the current date time field format
    */
    getFormat: function(){
        var me = this;
        return (me.dateField.submitFormat || me.dateField.format) + " " + (me.timeField.submitFormat || me.timeField.format)
    },
    /**
     * Replaces any existing {@link #minValue} with the new value and refreshes the Date picker.
     * @param {Date} value The minimum date that can be selected
     */    
    setMinValue: function(date){
        var me = this;
        me.dateField.setMinValue(date);
    },
    /**
     * Replaces any existing {@link #maxValue} with the new value and refreshes the Date picker.
     * @param {Date} value The maximum date that can be selected
     */    
    setMaxValue: function(date){
        var me = this;
        me.dateField.setMaxValue(date);
    },
    validate: function(){
        var me = this;
        return me.dateField.validate();
    }
}); 
 