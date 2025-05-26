/** @odoo-module **/
import { registry } from "@web/core/registry";
import { useInputField } from "@web/views/fields/input_field_hook";
import { Component, useRef, onWillRender, onMounted } from "@odoo/owl";
import { parseFloat } from "@web/views/fields/parsers";

export class FloatInt extends Component{
   static template = "float_int_widget";
   setup(){
       this.options = [
                     { label: 'UP', value: 'up' },
                     { label: 'DOWN', value: 'down' },
                     { label: 'HALF-UP', value: 'half_up' },
                 ];
       if (this.options == 'up')
       {
            this.rounded_up()
       }
        if (this.options == 'down')
       {
            this.rounded_down()
       }
        if (this.options == 'half_up')
       {
            this.rounded()
       }
       this.input = useRef('input_float_int')
       useInputField({ getValue: () => this.props.record.data[this.props.name] || "" ,
       refName: "input_float_int",parse: (v) => parseFloat(v),});
       onWillRender(() =>  {
           this.rounded()
       });
       onMounted(() =>  {
           this.rounded()
       });
   }
   rounded(){
       if (this.input.el)
           {
               this.props.record.data[this.props.name] = Math.round(this.input.el.value)
           }
   }

    rounded_up(){
       if (this.input.el)
           {
               this.props.record.data[this.props.name] = Math.ceil(this.input.el.value)
           }
   }

     rounded_down(){
       if (this.input.el)
           {
               this.props.record.data[this.props.name] = Math.floor(this.input.el.value)
           }
   }
}
FloatInt.component = FloatInt
FloatInt.supportedTypes = ["float"]
registry.category("fields").add("float_int_widget", FloatInt);

