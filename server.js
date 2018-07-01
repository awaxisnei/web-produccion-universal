// Angular requires Zone.js
require('zone.js/dist/zone-node');

const express = require('express');
const ngExpressEngine = require('@nguniversal/express-engine/modules/express-engine')
    .ngExpressEngine;
const fs = require('fs');

// Find the main.hash.bundle in the dist-server folder
var files;
try {
    files = fs.readdirSync('${process.cwd()}/dist-server');
} catch (error) {
    console.error(error);
}
var mainFiles = files.filter(file => file.startsWith('main'));
var split = mainFiles[0].split('.');
var hash = '';
if (split.length > 3) hash = split[1] + '.';
var {
    ServerAppModuleNgFactory,
    LAZY_MODULE_MAP
} = require('./dist-server/main.${hash}bundle');
//PAra hacer el build -->  ng build --prod --app 1 --output-hashing none

const app = express();

app.engine(
    'html',
    ngExpressEngine({
        bootstrap: ServerAppModuleNgFactory,
        providers: [provider]
    })
);

app.set('view engine', 'html');
app.set('views', __dirname);

app.use(express.static(__dirname + '/assets', { index: false }));
app.use(express.static(__dirname + '/dist', { index: false }));

app.get('/*', (req, res) => {
    console.time(`GET: ${req.originalUrl}`);
    res.render('./dist/index', {
        req: req,
        res: res
    });
    console.timeEnd(`GET: ${req.originalUrl}`);
});

app.listen(process.env.PORT || 8080, () => {});