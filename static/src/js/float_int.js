/** @odoo-module **/
import { registry } from "@web/core/registry";
import { useInputField } from "@web/views/fields/input_field_hook";
import { Component, useRef, onWillRender, onMounted ,useState} from "@odoo/owl";
import { parseFloat } from "@web/views/fields/parsers";
//import { standardFieldProps } from "../standard_field_props";

export class FloatInt extends Component{
   static template = "float_int_widget";
   setup(){

       this.input = useRef('input_float_int')
       this.roundingMode = useState({ mode: this.props.options?.mode || " " });
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
           const value = parseFloat(this.input.el.value);
           const mode = this.roundingMode.mode;
//           let roundedValue;
           switch (mode) {
                case "half-up":
                    this.props.record.data[this.props.name] = Math.round(this.input.el.value)
                    break;
                case 'down':
                    this.props.record.data[this.props.name] = Math.floor(this.input.el.value)
                    break;
                case "up":
                default:
                    this.props.record.data[this.props.name] = Math.ceil(this.input.el.value)
                    break;
            }
//               this.props.record.data[this.props.name] = Math.floor(this.input.el.value)
           }
   }
}
FloatInt.component = FloatInt
FloatInt.supportedTypes = ["float"]
registry.category("fields").add("float_int_widget", FloatInt);

