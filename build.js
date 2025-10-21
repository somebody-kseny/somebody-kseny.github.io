const Handlebars = require('handlebars');
const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
const {
    registerCustomHandlebarsHelpers,
} = require('./registerCustomHandlebarsHelpers.js');

const INPUT_FOLDER = path.resolve(__dirname);
const OUTPUT_FOLDER = 'dist';
const STATIC_FOLDER = 'static';
const CSS_FILENAMES = ['styles.css', 'drop_default.css'];

const content = yaml.load(
    fs
        .readFileSync('./content.yaml', 'utf8')
        .replace(/\$env\.([A-Z]+)/g, (_, name) => {
            return process.env[name];
        })
        .replace(/--/g, '—'),
);

const input = fs.readFileSync(`${INPUT_FOLDER}/index.handlebars`, 'utf8');

registerCustomHandlebarsHelpers(INPUT_FOLDER, STATIC_FOLDER);
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
    `${INPUT_FOLDER}/${STATIC_FOLDER}`,
    `${OUTPUT_FOLDER}/${STATIC_FOLDER}`,
    { recursive: true },
);
