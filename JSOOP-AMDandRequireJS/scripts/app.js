// 01. Implement a ComboBox control (like a dropdown list)
//   - The ComboBox holds a set of items (an array)
//   - Initially only a single item, the selected item, is visible  (the ComboBox is collapsed)
//   - When the selected item is clicked, all other items are shown (the ComboBox is expanded)
//     = If an item is clicked, it becomes the selected item and the ComboBox collapses
//   - Each of the items in a ComboBox can contain any valid HTML code
//   - Use RequireJS and handlebars.js
//     = jQuery is not obligatory (use it if you will)
//   - The ComboBox should have the following usage:
//     || var people = [
//     || { id: 1, name: 'Doncho Minkov', age: 18, avatarUrl: 'images/minkov.jpg' },
//     || { id: 2, name: 'Georgi Georgiev', age: 19, avatarUrl: 'images/joreto.jpg' }];
//     ||
//     || var comboBox = controls.ComboBox(people);
//     || var template = $('#person-template').html();
//     || var comboBoxHtml = comboBox.render(template);
//     ||
//     || container.innerHTML = comboBoxHtml;
//     ||
//     || //sample template
//     || <div class='person-item' id='person-item-{{id}}'>
//     ||     <strong class='person-name'>{{name}}</strong><p class='person-age'>{{age}}</p>
//     ||     <img src='{{avatarUrl}}' width='100px' />
//     || </div>

(function () {
    'use strict';
    require.config({
        paths: {
            'jquery': 'libs/jquery-1.11.1.min',
            'handlebars': 'libs/handlebars.min'
        },
        shim: {
            'handlebars': {
                exports: 'Handlebars'
            }
    }});

    require(['jquery', 'controls', 'data'], function ($, controls, data) {
        var container = document.body,
            comboBox = controls.ComboBox(data.people),
            template = $('#person-template').html(),
            comboBoxHtml = comboBox.render(template);

        container.innerHTML = comboBoxHtml;
    });
}());
