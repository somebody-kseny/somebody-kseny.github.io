const Handlebars = require('handlebars');
const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

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
                `${INPUT_FOLDER}/${STATIC_FILENAME}/icons/mingcute_${name}-fill.svg`,
                'utf8',
            )
            .replace('svg', `svg class='icon'`),
    );
});

const content = yaml.load(
    fs
        .readFileSync('./content.yaml', 'utf8')
        .replace(/\$env\.([A-Z]+)/g, (_, name) => {
            return process.env[name];
        }),
);

const INPUT_FOLDER = path.resolve(__dirname);
const OUTPUT_FOLDER = 'dist';
const CSS_FILENAMES = ['styles.css', 'drop_default.css'];
const STATIC_FILENAME = 'static';

const input = fs.readFileSync(`${INPUT_FOLDER}/index.handlebars`, 'utf8');

const template = Handlebars.compile(input);

if (!fs.existsSync(OUTPUT_FOLDER)) {
    fs.mkdirSync(OUTPUT_FOLDER);
}

fs.writeFileSync(`./${OUTPUT_FOLDER}/index.html`, template(content), {
    flag: 'w+',
});

CSS_FILENAMES.forEach((cssFile) => {
    fs.copyFileSync(
        `${INPUT_FOLDER}/${cssFile}`,
        `${OUTPUT_FOLDER}/${cssFile}`,
    );
});

fs.cpSync(
    `${INPUT_FOLDER}/${STATIC_FILENAME}`,
    `${OUTPUT_FOLDER}/${STATIC_FILENAME}`,
    { recursive: true },
);
