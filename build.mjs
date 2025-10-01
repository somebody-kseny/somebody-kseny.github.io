import Handlebars from 'handlebars';
import fs from 'fs';
import { fileURLToPath } from 'url';

const INPUT_FOLDER = fileURLToPath(import.meta.resolve('.'));
const OUTPUT_FOLDER = 'dist';
const CSS_FILENAME = 'styles.css';
const STATIC_FILENAME = 'static';

const input = fs.readFileSync(`${INPUT_FOLDER}/index.handlebars`, 'utf8');

const template = Handlebars.compile(input);

if (!fs.existsSync(OUTPUT_FOLDER)) {
    fs.mkdirSync(OUTPUT_FOLDER);
}

fs.writeFileSync(
    `./${OUTPUT_FOLDER}/index.html`,
    template({ test: 'Hello world' }),
    { flag: 'w+' },
);

fs.copyFileSync(
    `${INPUT_FOLDER}/${CSS_FILENAME}`,
    `${OUTPUT_FOLDER}/${CSS_FILENAME}`,
);

fs.cpSync(
    `${INPUT_FOLDER}/${STATIC_FILENAME}`,
    `${OUTPUT_FOLDER}/${STATIC_FILENAME}`,
    { recursive: true },
);
