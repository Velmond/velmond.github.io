define(['jquery', 'handlebars'], function ($, HB) {
    'use strict';
    var ComboBox = (function () {
        var ComboBox = function (collection) {
            this._options = collection instanceof Array ? collection : '';
        };

        ComboBox.prototype.render = function (template) {
            var $container = this._options.length ? $('<div/>'): '',
                templateHtml = HB.compile(template),
                newItemFromTemplate,
                $outerContainer;

            if (!$container) {
                return '';
            }

            $(templateHtml(this._options[0]))
                .addClass('control-comboBox-option selected')
                .appendTo($container);

            this._options.forEach(function (option) {
                newItemFromTemplate = templateHtml(option);
                $(newItemFromTemplate)
                    .addClass('control-comboBox-option')
                    .appendTo($container);
            });

            $container
                .addClass('control-comboBox collapsed')
                .children()
                    .hide()
                .end()
                .find('.selected')
                    .show();

            $('body').on('click', '.control-comboBox .control-comboBox-option', function () {
                var $this = $(this),
                    isCollapsed = $this.parent().hasClass('collapsed');

                if (isCollapsed) {
                    $this.parent()
                        .removeClass('collapsed')
                        .find('.control-comboBox-option')
                            .slideDown();
                } else {
                    $this.parent()
                        .addClass('collapsed')
                        .find('.control-comboBox-option:not(.selected)')
                            .slideUp()
                        .end()
                        .find('.selected')
                            .first()
                            .html($this.html());
                }
            });

            $outerContainer = $('<div/>');
            $container.appendTo($outerContainer);

            return $outerContainer.html();
        };

        return ComboBox;
    }());

    return {
        ComboBox: function (collection) {
            return new ComboBox(collection);
        }
    }
});
