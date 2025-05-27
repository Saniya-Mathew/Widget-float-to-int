import { registry } from "@web/core/registry";
import { useInputField } from "@web/views/fields/input_field_hook";
import { standardFieldProps } from "@web/views/fields/standard_field_props";
import { onMounted } from "@odoo/owl";
import { Component, useState, useRef } from "@odoo/owl";
import { parseFloat } from "@web/views/fields/parsers";

export class FloatInt extends Component {
    static template = "float_int_widget.FloatIntField";
    static props = {
        ...standardFieldProps,
    };

    setup() {
        if (!this.props?.name || !this.props?.record) {
            console.warn("Missing props: 'name' or 'record'");
            return;
        }

        this.input = useRef("inputfloatint");
        const mode = this.props.options?.mode || "half_up";
        this.roundingMode = useState(mode);

        useInputField({
            getValue: () => this.props.record.data[this.props.name] || "",
            refName: "inputfloatint",
            parse: (v) => parseFloat(v),
        });

        onMounted(() => {
            this.rounded();
        });
    }

    rounded() {
        if (this.input.el) {
            const value = parseFloat(this.input.el.value);
            if (isNaN(value)) return;

            let roundedValue;
            switch (this.roundingMode.value) {
                case "up":
                    roundedValue = Math.ceil(value);
                    break;
                case "down":
                    roundedValue = Math.floor(value);
                    break;
                case "half_up":
                default:
                    roundedValue = Math.round(value);
                    break;
            }

            if (this.props.update) {
                this.props.update(roundedValue);
            } else {
                this.props.record.data[this.props.name] = roundedValue;
            }
        }
    }

    onRoundingModeChange(event) {
        this.roundingMode.value = event.target.value;
        this.rounded();
    }
}

FloatInt.supportedTypes = ["float"];
registry.category("fields").add("float_int_widget", FloatInt);


<?xml version="1.0" encoding="UTF-8"?>
<templates id="template" xml:space="preserve">
    <t t-name="float_int_widget.FloatIntField">
        <div class="o_field_widget">
            <t t-if="props && props.record && props.name">
                <input type="number"
                       t-ref="inputfloatint"
                       class="o_input"
                       t-att-value="props.record.data[props.name]" />
                <select t-on-change="onRoundingModeChange"
                        t-att-value="roundingMode.value">
                    <option value="up">Up</option>
                    <option value="down">Down</option>
                    <option value="half_up">Half Up</option>
                </select>
            </t>
        </div>
    </t>
</templates>


/** @odoo-module **/
import { registry } from "@web/core/registry";
import { useInputField } from "@web/views/fields/input_field_hook";
import { Component, useRef, onWillRender, onMounted, useState } from "@odoo/owl";
import { parseFloat } from "@web/views/fields/parsers";

export class FloatInt extends Component {
    static template = "float_int_widget";

    setup() {
        this.input = useRef("input_float_int");
        this.roundingMode = useState({ mode: this.props.options?.mode || "half-up" });

        useInputField({
            getValue: () => this.props.record.data[this.props.name] || "",
            refName: "input_float_int",
            parse: (v) => parseFloat(v),
        });

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
            let roundedValue;

            switch (mode) {
                case "up":
                    roundedValue = Math.ceil(value);
                    break;
                case "down":
                    roundedValue = Math.floor(value);
                    break;
                case "half-up":
                default:
                    roundedValue = Math.round(value);
                    break;
            }

            this.props.record.data[this.props.name] = roundedValue;
        }
    }
}

FloatInt.supportedTypes = ["float"];
registry.category("fields").add("float_int_widget", FloatInt);



   <?xml version="1.0" encoding="UTF-8"?>
<templates xml:space="preserve">
    <t t-name="float_int_widget" owl="1">
        <input
            type="number"
            t-ref="input_float_int"
            t-att-value="props.record.data[props.name]"
            class="o_input"
        />
    </t>
</templates>
