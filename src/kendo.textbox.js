(function (f, define) {
    define(["./kendo.core"], f);
})(function () {

var __meta__ = {// jshint ignore:line
    id: "textbox",
    name: "TextBox",
    category: "web",
    description: "The TextBox widget enables you to style and provide a floating label functionality to input elements",
    depends: ["core"]
};

(function ($, undefined) {
    var kendo = window.kendo,
        Widget = kendo.ui.Widget,
        ui = kendo.ui,
        isPlainObject = $.isPlainObject,
        NS = ".kendoTextBox",
        CHANGE = "change",
        DISABLED = "disabled",
        READONLY = "readonly",
        INPUT = "k-input",
        LABELCLASSES = "k-label k-input-label",
        STATEDISABLED = "k-state-disabled",
        NOCLICKCLASS = "k-no-click",
        ARIA_DISABLED = "aria-disabled",
        proxy = $.proxy;

    var TextBox = Widget.extend({
        init: function (element, options) {
            var that = this;

            Widget.fn.init.call(that, element, options);
            options = $.extend(true, {}, options);

            that.options.value = options.value || that.element.val();
            that.options.readonly = options.readonly !== undefined ? options.readonly : Boolean(that.element.attr("readonly"));
            that.options.enable = options.enable !== undefined ? options.enable : !(Boolean(that.element.attr("disabled")));
            that.options.placeholder = options.placeholder || that.element.attr("placeholder");

            that._wrapper();
            that._editable({
                readonly: that.options.readonly,
                disable: !(that.options.enable)
            });
            that._label();
            that.value(that.options.value);

            that.element
                .addClass(INPUT)
                .attr("placeholder", that.options.placeholder)
                .attr("autocomplete", "off");

            kendo.notify(that);
        },

        events: [
            CHANGE
        ],

        options: {
            name: 'TextBox',
            value: '',
            readonly: false,
            enable: true,
            placeholder: '',
            label: null
        },

        value: function(value) {
            var that = this;

            if (value === undefined) {
                return that._value;
            }

            that._value = value;
            that.element.val(value);
        },

        readonly: function(readonly) {
            this._editable({
                readonly: readonly === undefined ? true : readonly,
                disable: false
            });
        },

        enable: function(enable) {
            this._editable({
                readonly: false,
                disable: !(enable = enable === undefined ? true : enable)
            });
        },

        focus: function() {
            var that = this;

            that.element[0].focus();
        },

        destroy: function() {
            var that = this;

            that.element.off(NS);
            Widget.fn.destroy.call(that);
        },

        _editable: function(options) {
            var that = this;
            var element = that.element;
            var wrapper = that.wrapper;
            var disable = options.disable;
            var readonly = options.readonly;

            element.off(NS);

            if (!readonly && !disable) {
                element.removeAttr(DISABLED)
                       .removeAttr(READONLY)
                       .attr(ARIA_DISABLED, false);

                wrapper.removeClass(STATEDISABLED)
                        .removeClass(NOCLICKCLASS);

                element.on("focusout" + NS, proxy(that._focusout, that));
            } else {
                element.attr(DISABLED, disable)
                       .attr(READONLY, readonly)
                       .attr(ARIA_DISABLED, disable);

                wrapper.toggleClass(STATEDISABLED, disable)
                        .toggleClass(NOCLICKCLASS, readonly);
            }
        },

        _label: function() {
            var that = this;
            var element = that.element;
            var options = that.options;
            var id = element.attr("id");
            var labelText;

            if (options.label !== null) {
                labelText = isPlainObject(options.label) ? options.label.content : options.label;

                if (kendo.isFunction(labelText)) {
                    labelText = labelText.call(that);
                }

                if (!labelText) {
                    labelText = "";
                }

                if (!id) {
                    id = options.name + "_" + kendo.guid();
                    element.attr("id", id);
                }

                $("<label class='" + LABELCLASSES + "' for='" + id + "'>" + labelText + "</label>'").insertBefore(that.wrapper);
            }
        },

        _focusout: function() {
            var that = this;
            var value = that._value;
            var newValue = that.element.val();

            if (value !== newValue) {
                that._value = newValue;

                that.trigger(CHANGE);
            }
        },

        _wrapper: function () {
            var that = this;
            var element = that.element;
            var DOMElement = element[0];
            var wrapper;

            wrapper = element.wrap("<span class='k-widget k-textbox'></span>").parent();
            wrapper[0].style.cssText = DOMElement.style.cssText;
            that._inputWrapper = that.wrapper = wrapper.addClass(DOMElement.className).removeClass('input-validation-error');
        }
    });
    ui.plugin(TextBox);
})(window.kendo.jQuery);

return window.kendo;

}, typeof define == 'function' && define.amd ? define : function (a1, a2, a3) { (a3 || a2)(); });
