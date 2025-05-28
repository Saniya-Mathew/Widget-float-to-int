/** @odoo-module **/
import { registry } from "@web/core/registry";
import { useInputField } from "@web/views/fields/input_field_hook";
import { Component, useRef, onWillRender, onMounted, useState } from "@odoo/owl";
import { parseFloat } from "@web/views/fields/parsers";
import { standardFieldProps } from "@web/views/fields/standard_field_props";

export class FloatInt extends Component {
    static template = "float_int_widget";
    static props = {
        ...standardFieldProps,
        mode: { type: String, optional: true },
    };

    setup() {
        this.input = useRef('input_float_int');
        this.roundingMode = useState({ mode: this.props.mode || "half-up" });

        useInputField({
            getValue: () => this.props.record.data[this.props.name] || "",
            refName: "input_float_int",
            parse: (v) => parseFloat(v),
        });

        console.log(this.props);
        console.log(this.props.mode);

        onWillRender(() => {
            this.rounded();
        });

        onMounted(() => {
            this.rounded();
        });
    }
    rounded() {
        if (this.input.el) {
            const value = parseFloat(this.input.el.value);
            const mode = this.roundingMode.mode;

            if (isNaN(value)) return;

            switch (mode) {
                case 'down':
                    this.props.record.data[this.props.name] = Math.floor(value);
                    break;
                case "up":
                    this.props.record.data[this.props.name] = Math.ceil(value);
                    break;
                case "half-up":
                default:
                    this.props.record.data[this.props.name] = Math.round(value);
                    break;
            }
        }
    }
}
export const floatInt = {
    component: FloatInt,
    supportedOptions: [
        {
            label: "Rounding",
            name: "mode",
            type: "String",
        },
    ],
    supportedTypes: ["float"],
    extractProps({ options }) {
        const mode = options.mode || "half-up";
        return {
            mode: mode,
        };
    },
};

registry.category("fields").add("float_int_widget", floatInt);
