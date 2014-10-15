// Imports
var Extend = window.structurejs.Extend;
var DOMElement = window.structurejs.DOMElement;
var BaseEvent = window.structurejs.BaseEvent;
var EventBroker = window.structurejs.EventBroker;

/**
 * YUIDoc_comment
 *
 * @class ChildView
 * @extends DOMElement
 * @constructor
 **/
var ChildView = (function () {

    var _super = Extend(ChildView, DOMElement);

    function ChildView() {
        _super.call(this);

        this._panelContainer = null;
        this._dispatchButton = null;
        this._sonMessage = null;
    }

    /**
     * @overridden DOMElement.createChildren
     */
    ChildView.prototype.createChildren = function () {
        _super.prototype.createChildren.call(this, '#containerTemplate', { title: this.getQualifiedClassName() });

        this._panelContainer = this.getChild('.js-panelContent');

        this._dispatchButton = new DOMElement('button', { 'class': 'button_dispatch', text: 'Dispatch Event' });
        this._panelContainer.addChild(this._dispatchButton);

        this._sonMessage = this.getChild('.js-message');
    };

    /**
     * @overridden DOMElement.layoutChildren
     */
    ChildView.prototype.layoutChildren = function () {
        this._sonMessage.$element.css('opacity', 0);

        return this;
    };

    /**
     * @overridden DOMElement.enable
     */
    ChildView.prototype.enable = function () {
        if (this.isEnabled === true) return;

        this.addEventListener(BaseEvent.CHANGE, this._onBubbled, this);

        this._dispatchButton.$element.addEventListener('click', this._onButtonClick, this);

        return _super.prototype.enable.call(this);
    };

    /**
     * @overridden DOMElement.disable
     */
    ChildView.prototype.disable = function () {
        if (this.isEnabled === false) return;

        this.removeEventListener(BaseEvent.CHANGE, this._onBubbled, this);

        this._dispatchButton.$element.removeEventListener('click', this._onButtonClick, this);

        return _super.prototype.disable.call(this);
    };

    /**
     * @overridden DOMElement.destroy
     */
    ChildView.prototype.destroy = function () {
        this._dispatchButton.destroy();
        this._panelContainer.destroy();

        _super.prototype.destroy.call(this);
    };

    ChildView.prototype._onButtonClick = function (event) {
        event.preventDefault();

        this.dispatchEvent(new BaseEvent(BaseEvent.CHANGE, true, true));
        EventBroker.dispatchEvent(new BaseEvent(BaseEvent.CHANGE, true, true));
    };

    ChildView.prototype._onBubbled = function (event) {
        var checkbox = this._panelContainer.$element.find('[type=checkbox]').first().prop('checked');

        if (checkbox == true) {
            event.stopPropagation();
        }

        this._sonMessage.$element.css('opacity', 1);
    };

    return ChildView;
})();