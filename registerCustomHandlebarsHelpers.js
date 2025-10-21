const Handlebars = require('handlebars');
const fs = require('fs');

module.exports = {
    registerCustomHandlebarsHelpers: (inputFolder, staticFolder) => {
        Handlebars.registerHelper('isLink', function (test, options) {
            if (test.text && test.href) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        });

        Handlebars.registerHelper('inlineSvg', function (name) {
            return new Handlebars.SafeString(
                fs
                    .readFileSync(
                        `${inputFolder}/${staticFolder}/icons/mingcute_${name}-fill.svg`,
                        'utf8',
                    )
                    .replace('svg', `svg class='icon'`),
            );
        });

        const renderListElement = (str) => {
            return `<li>${str}</li>`;
        };

        Handlebars.registerHelper('renderExpSummary', function (summary) {
            if (typeof summary === 'string') {
                return new Handlebars.SafeString(
                    `<ul><li>${summary}</li></ul>`,
                );
            }

            return new Handlebars.SafeString(
                summary
                    .map((item) => {
                        return `
    <p><span class='highlighted'>${item.header}:</span></p>
    <ul>${item.list.map(renderListElement).join('')}</ul>
    `;
                    })
                    .join(''),
            );
        });
    },
};
