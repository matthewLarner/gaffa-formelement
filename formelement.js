var Gaffa = require('gaffa'),
    crel = require('crel'),
    doc = require('doc-js');

function setValue(event){
    var input = event.target,
        view = input.view;

    view.value.set(input.value);
}

function FormElement(){}
FormElement = Gaffa.createSpec(FormElement, Gaffa.View);
FormElement.prototype._type = 'formElement';

FormElement.prototype.render = function(){
    var renderedElement = this.renderedElement = this.renderedElement || crel('input'),
        formElement = this.formElement = this.formElement || renderedElement,
        updateEventNames = (this.updateEventName || "change").split(' ');

    this._removeHandlers.push(this.gaffa.events.on(this.updateEventName || "change", formElement, setValue));
};

FormElement.prototype.value = new Gaffa.Property(function(view, value){
    value = value || '';

    var element = view.formElement,
        caretPosition = 0,
        hasCaret = element === document.activeElement; //this is only necissary because IE10 is a pile of crap (i know what a surprise)

    // Skip if the text hasnt changed
    if(value === element.value){
        return;
    }

    // Inspiration taken from http://stackoverflow.com/questions/2897155/get-caret-position-within-an-text-input-field
    // but WOW is that some horrendous code!
    if(hasCaret){
        if (window.document.selection) {
            var selection = window.document.selection.createRange();
            selection.moveStart('character', -element.value.length);
            caretPosition = selection.text.length;
        }
        else if (element.selectionStart || element.selectionStart == '0'){
            caretPosition = element.selectionStart;
        }
    }

    element.value = value;

    if(hasCaret){
        if(element.createTextRange) {
            var range = element.createTextRange();

            range.move('character', caretPosition);

            range.select();
        }
        if(element.selectionStart) {
            element.setSelectionRange(caretPosition, caretPosition);
        }
    }
});

FormElement.prototype.type = new Gaffa.Property(function(view, value){
    view.formElement.setAttribute('type', value != null ? value : "");
});

FormElement.prototype.placeholder = new Gaffa.Property(function(view, value){
    view.formElement.setAttribute('placeholder', value != null ? value : "");
});

FormElement.prototype.required = new Gaffa.Property(function(view, value){
    if (value){
        view.formElement.setAttribute('required', 'required');
    }else{
        view.formElement.removeAttribute('required');
    }
});

FormElement.prototype.validity = new Gaffa.Property(function(view, value){
    value = value || '';

    view.formElement.setCustomValidity(value);
});

module.exports = FormElement;