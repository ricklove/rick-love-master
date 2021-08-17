
import { Parser } from 'binary-parser';
import FS from 'fs';
import { Buffer } from 'buffer';
import Lazy from 'lazy.js';
import PNGImage from 'pngjs-image';
import XCFCompositer from './lib/xcfcompositer';

const PROP_END = 0;
const PROP_COLORMAP = 1;
const PROP_ACTIVE_LAYER = 2;
const PROP_ACTIVE_CHANNEL = 3;
const PROP_SELECTION = 4;
const PROP_FLOATING_SELECTION = 5;
const PROP_OPACITY = 6;
const PROP_MODE = 7;
const PROP_VISIBLE = 8;
const PROP_LINKED = 9;
const PROP_LOCK_ALPHA = 10;
const PROP_APPLY_MASK = 11;
const PROP_EDIT_MASK = 12;
const PROP_SHOW_MASK = 13;
const PROP_SHOW_MASKED = 14;
const PROP_OFFSETS = 15;
const PROP_COLOR = 16;
const PROP_COMPRESSION = 17;
const PROP_GUIDES = 18;
const PROP_RESOLUTION = 19;
const PROP_TATTOO = 20;
const PROP_PARASITES = 21;
const PROP_UNIT = 22;
const PROP_PATHS = 23;
const PROP_USER_UNIT = 24;
const PROP_VECTORS = 25;
const PROP_TEXT_LAYER_FLAGS = 26;
const PROP_SAMPLE_POINTS = 27;
const PROP_LOCK_CONTENT = 28;
const PROP_GROUP_ITEM = 29;
const PROP_ITEM_PATH = 30;
const PROP_GROUP_ITEM_FLAGS = 31;
const PROP_LOCK_POSITION = 32;
const PROP_FLOAT_OPACITY = 33;

var itemIsZero = function (item, buffer) {
    return item === 0;
};


var stringParser = new Parser()
    .string('data', { zeroTerminated: true });

var rgbParser = new Parser()
    .uint8('red')
    .uint8('greed')
    .uint8('blue');

var rgbaParser = new Parser()
    .uint8('red')
    .uint8('greed')
    .uint8('blue')
    .uint8('alpha', {
        formatter: function (aplha) {
            return Math.round((alpha / 255) * 100);
        }
    });

var prop_colorMapParser = new Parser()
    .uint32('length')
    .uint32('numcolours')
    .array('colours', {
        type: rgbParser,
        length: 'numcolours'
    });

var prop_guidesParser = new Parser()
    .uint32('length')
    .array('guides', {
        type: new Parser().int32('c').int8('o'),
        length: function () { return this.length / 5; }
    });

var prop_modeParser = new Parser()
    .uint32('length', { assert: 4 })
    .uint32('mode');

var parasiteParser = new Parser()
    .uint32('length')
    .buffer('parasite', { length: 'length' });

var parasiteArrayItemParser = new Parser()
    .uint32('name_length')
    .string('name', {
        encoding: 'ascii',
        zeroTerminated: true
    })
    .uint32('flags')
    .uint32('length')
    .buffer('details', { length: 'length' });

var fullParasiteParser = new Parser()
    .array('items', {
        type: parasiteArrayItemParser,
        readUntil: 'eof'
    })

var propLengthF = new Parser().uint32('length', { assert: 4 }).uint32('f');

var propertyListParser = new Parser()
    .endianess('big')
    .uint32('type')
    .choice('data', {
        tag: 'type',
        choices: {
            [PROP_END]: new Parser().uint32('length', { assert: 0 }),//0
            [PROP_COLORMAP]: prop_colorMapParser, //1
            [PROP_ACTIVE_LAYER]: new Parser().uint32('length', { assert: 0 }), //2
            [PROP_ACTIVE_CHANNEL]: new Parser().uint32('length', { assert: 0 }),//3
            [PROP_SELECTION]: new Parser().uint32('length', { assert: 0 }),//4
            [PROP_FLOATING_SELECTION]: new Parser().uint32('length', { assert: 4 }).uint32('layerPtr'), // 5 
            [PROP_OPACITY]: new Parser().uint32('length').uint32('opacity'), // 6
            [PROP_MODE]: prop_modeParser, //7
            [PROP_VISIBLE]: new Parser().uint32('length', { assert: 4 }).uint32('isVisible'), // 8
            [PROP_LINKED]: new Parser().uint32('length', { assert: 4 }).uint32('isLinked'), // 9
            [PROP_LOCK_ALPHA]: new Parser().uint32('length', { assert: 4 }).uint32('alpha'),//10
            [PROP_APPLY_MASK]: new Parser().uint32('length', { assert: 4 }).uint32('mask'),//11
            [PROP_EDIT_MASK]: new Parser().uint32('length', { assert: 4 }).uint32('editmask'),//12
            [PROP_SHOW_MASK]: new Parser().uint32('length', { assert: 4 }).uint32('showmask'),// 13
            [PROP_SHOW_MASKED]: new Parser().uint32('length', { assert: 4 }).uint32('showmasked'),// 14
            [PROP_OFFSETS]: new Parser().uint32('length', { assert: 8 }).int32('dx').int32('dy'), // 15
            [PROP_COLOR]: new Parser().uint32('length', { assert: 3 }).int8('r').int8('g').int8('b'), // 16
            [PROP_COMPRESSION]: new Parser().uint32('length', { assert: 1 }).uint8('compressionType'),//17
            [PROP_GUIDES]: prop_guidesParser,//18
            [PROP_RESOLUTION]: new Parser().uint32('length').float('x').float('y'),//19
            [PROP_TATTOO]: new Parser().uint32('length').uint32('tattoo'),//20
            [PROP_PARASITES]: parasiteParser,//21
            [PROP_UNIT]: new Parser().uint32('length').uint32('c'),//22
            [PROP_TEXT_LAYER_FLAGS]: propLengthF, // 26
            [PROP_LOCK_CONTENT]: new Parser().uint32('length').uint32('isLocked'),
            [PROP_GROUP_ITEM]: new Parser().uint32('length', { assert: 0 }),
            [PROP_ITEM_PATH]: new Parser().uint32('length', { formatter: function (value) { return value / 4; } }).array('items', { type: 'uint32be', length: 'length' }), // 30
            [PROP_GROUP_ITEM_FLAGS]: new Parser().uint32('length').uint32('flags')
        },
        defaultChoice: new Parser().uint32('length').buffer('buffer', { length: function () { return this.length; } })
    })

var layerParser = new Parser()
    .uint32('width')
    .uint32('height')
    .uint32('type')
    .uint32('name_length')
    .string('name', {
        encoding: 'ascii',
        zeroTerminated: true
    })
    .array(
        'propertyList',
        {
            type: propertyListParser,
            readUntil: function (item, buffer) {
                return item.type === 0;
            }
        }
    )
    .uint32('hptr')
    .uint32('mptr');

var hirerarchyParser = new Parser()
    .uint32('width')
    .uint32('height')
    .uint32('bpp')
    .uint32('lptr');

var levelParser = new Parser()
    .uint32('width')
    .uint32('height')
    .array('tptr', {
        type: 'uint32be',
        readUntil: itemIsZero
    })

var gimpHeader = new Parser()
    .endianess('big')
    .string('magic', {
        encoding: 'ascii',
        length: 9,
        /*assert: function(value, name) {
         
            return value == 'gimp xcf';
        }*/
    })
    .string('version', {
        encoding: 'ascii',
        length: 4,
    })
    .int8('padding', { assert: 0 })
    .uint32('width')
    .uint32('height')
    .uint32('base_type', { assert: 0 })
    .array(
        'propertyList',
        {
            type: propertyListParser,
            readUntil: function (item, buffer) {
                return item.type === 0;
            }
        }
    )
    .array(
        'layerList',
        {
            type: 'int32be',
            readUntil: itemIsZero
        }
    )
    .array(
        'channelList',
        {
            type: 'int32be',
            readUntil: itemIsZero
        }
    );

var remove_empty = function (data) {
    return data !== 0;
}

var isUnset = function (value) {
    return value === null || value === undefined;
}

var findProperty = function (propertyList, prop) {
    var prop = Lazy(propertyList).find(function (property) {
        return property.type == prop;
    });
    if (prop) {
        return prop.data;
    }
    return null;
}

class GimpLayer {
    constructor(parent, buffer) {
        this._parent = parent;
        this._buffer = buffer;
        this._compiled = false;
        this._props = null;
    }

    compile() {
        this._details = layerParser.parse(this._buffer);
        this._compiled = true;
    }

    get name() {
        if (!this._compiled) {
            this.compile();
        }
        if (isUnset(this._name)) {
            this._name = this._details.name;
            var pos = this._name.indexOf(' copy');

            if (pos > 0) {
                this._name = this._name.substr(0, pos);
            }
            pos = this._name.indexOf(' #');
            if (pos > 0) {
                this._name = this._name.substr(0, pos);
            }

            this._name = this._name.trim();
        }
        return this._name;
    }

    get pathInfo() {
        return this.getProps(PROP_ITEM_PATH);
    }

    get groupName() {
        if (!this._compiled) {
            this.compile();
        }
        var pathInfo = this.pathInfo;

        if (isUnset(pathInfo)) {
            return this.name;
        }

        pathInfo = pathInfo.data.items;
        var item = this._parent._groupLayers;
        var name = [];
        for (var index = 0; index < pathInfo.length; index += 1) {

            if (item.children) {
                item = item.children[pathInfo[index]];
            } else {
                item = item[pathInfo[index]];
            }
            name.push(item.layer.name);
        }

        return name.join('/');

    }
    get width() {
        if (!this._compiled) {
            this.compile();
        }
        return this._details.width;
    }

    get height() {
        if (!this._compiled) {
            this.compile();
        }
        return this._details.height;
    }

    get x() {
        return this.getProps(PROP_OFFSETS, 'dx');
    }

    get y() {
        return this.getProps(PROP_OFFSETS, 'dy');
    }

    get isVisible() {
        return this.getProps(PROP_VISIBLE, 'isVisible') !== 0;
    }

    get isGroup() {
        return this.getProps(PROP_GROUP_ITEM) != null;
    }

    get colourMode() {
        return this.getProps(PROP_MODE, 'mode');
    }

    get opacity() {
        return this.getProps(PROP_OPACITY, 'opacity');
    }

    get parasites() {
        if (this._parasites === undefined) {
            var parasite = this.getProps(PROP_PARASITES);
            this._parasites = {};
            if (parasite) {
                parasite = parasite.data.parasite;
                parasite = fullParasiteParser.parse(parasite);
                Lazy(parasite.items).each((parasite) => {
                    var name = parasite.name;
                    if (name == 'gimp-text-layer') {
                        var text = stringParser.parse(parasite.details).data;
                        var fields = {};
                        Lazy(text.match(/(\(.*\))+/g)).each((item) => {
                            item = item.substr(1, item.length - 2).split(' ');
                            var key = item[0];
                            item = item.splice(1).join(' ');
                            fields[key] = item.replace(/^[\"]+/, '').replace(/[\"]+$/, '');
                        });;
                        this._parasites[name] = fields;
                    }
                });
            }
        }
        return this._parasites;
    }

    getProps(prop, index) {
        if (!this._compiled) {
            this.compile();
        }

        if (isUnset(this._props)) {
            this._props = {};
            Lazy(this._details.propertyList).each(function (property) {
                this._props[property.type] = property;
            }.bind(this));
        }

        if (index && this._props[prop] && this._props[prop]['data']) {
            return this._props[prop]['data'][index];
        }
        return this._props[prop];
    }

    makeImage(image, useOffset) {
        if (useOffset && this.isGroup) {
            return image;
        }
        if (this.isVisible) {
            var x = 0, y = 0;
            var hDetails, levels, tilesAcross;
            var w = this.width, h = this.height;
            var mode = XCFCompositer.makeCompositer(this.mode, this.opacity);
            if (useOffset) {
                x = this.x;
                y = this.y;
                w = this._parent.width;
                h = this._parent.height;
            }
            if (isUnset(image)) {
                image = new XCFImage(w, h);
                image.fillRect(0, 0, w, h, { red: 0, green: 0, blue: 0, alpha: 1 });
            }
            hDetails = hirerarchyParser.parse(this._parent.getBufferForPointer(this._details.hptr));
            levels = levelParser.parse(this._parent.getBufferForPointer(hDetails.lptr));

            tilesAcross = Math.ceil(this.width / 64);
            Lazy(levels.tptr).each(function (tptr, index) {
                var xIndex = (index % tilesAcross) * 64;
                var yIndex = Math.floor(index / tilesAcross) * 64;
                var xpoints = Math.min(64, this.width - xIndex);
                var ypoints = Math.min(64, this.height - yIndex);
                this.copyTile(
                    image,
                    this.uncompress(
                        this._parent.getBufferForPointer(tptr),
                        xpoints,
                        ypoints,
                        hDetails.bpp),
                    x + xIndex,
                    y + yIndex,
                    xpoints,
                    ypoints,
                    hDetails.bpp,
                    mode);
            }.bind(this));
        }
        return image;
    }

    uncompress(compressedData, xpoints, ypoints, bpp) {
        var size = xpoints * ypoints;
        var tileBuffer = new Buffer(size * bpp);
        var compressOffset = 0;
        for (var bppLoop = 0; bppLoop < bpp; bppLoop += 1) {
            size = xpoints * ypoints;
            var offset = bppLoop;

            while (size > 0) {
                var length = compressedData[compressOffset];

                compressOffset += 1;
                if (length < 127) {
                    var newLength = length;
                    var byte = compressedData[compressOffset];
                    compressOffset += 1;
                    while (newLength >= 0) {
                        tileBuffer[offset] = byte;
                        offset += bpp;
                        size -= 1;
                        newLength -= 1;
                    }
                } else if (length === 127) {
                    var newLength = compressedData[compressOffset] * 256 + compressedData[compressOffset + 1];
                    compressOffset += 2;
                    var byte = compressedData[compressOffset];
                    compressOffset += 1;
                    while (newLength > 0) {
                        tileBuffer[offset] = byte;
                        offset += bpp;
                        size -= 1;
                        newLength -= 1;
                    }
                } else if (length === 128) {
                    var newLength = compressedData[compressOffset] * 256 + compressedData[compressOffset + 1];
                    compressOffset += 2;

                    while (newLength > 0) {
                        tileBuffer[offset] = compressedData[compressOffset];
                        compressOffset += 1;
                        offset += bpp;
                        size -= 1;
                        newLength -= 1;
                    }
                } else {
                    var newLength = 256 - length;
                    while (newLength > 0) {
                        tileBuffer[offset] = compressedData[compressOffset];
                        compressOffset += 1;
                        offset += bpp;
                        size -= 1;
                        newLength -= 1;
                    }
                }
            }
        }
        return tileBuffer;
    }
    copyTile(image, tileBuffer, xoffset, yoffset, xpoints, ypoints, bpp, mode) {
        var bufferOffset = 0;

        for (var yloop = 0; yloop < ypoints; yloop += 1) {
            for (var xloop = 0; xloop < xpoints; xloop += 1) {
                var colour = {
                    red: tileBuffer[bufferOffset],
                    green: tileBuffer[bufferOffset + 1],
                    blue: tileBuffer[bufferOffset + 2]
                }
                if (bpp === 4) {
                    colour.alpha = tileBuffer[bufferOffset + 3];
                }
                var bgCol = image.getAt(
                    xoffset + xloop,
                    yoffset + yloop);
                if (mode) {
                    colour = mode.compose(
                        bgCol,
                        colour);
                }
                image.setAt(
                    xoffset + xloop,
                    yoffset + yloop,
                    colour);
                bufferOffset += bpp;
            }
        }
    }
}

class GimpChannel {
    constructor(parent, buffer) {
        this._parent = parent;
        this._buffer = buffer;
        this._compiled = false;
    }
}
class XCFParser {
    static parseFile(file, callback) {
        var parser = new XCFParser();
        FS.readFile(file, function (err, data) {
            if (err) callback(err);

            try {
                parser.parse(data);
                callback(null, parser);
            } catch (error) {
                callback(error);
            }

        });
    }

    constructor() {
        this._layers = {};
        this._channels = {}
        this._buffer = null;
        this._header = null;
    }


    parse(buffer) {
        this._buffer = buffer;
        this._layers = {};
        this._channels = {};
        this._header = gimpHeader.parse(buffer);
        this._groupLayers = { layer: null, children: [] };

        console.log('parse buffer', { layerList: this._header.layerList });


        this._layers = Lazy(this._header.layerList).filter(remove_empty).map(function (layerPointer) {
            console.log('Loading layers');
            var layer = new GimpLayer(this, this._buffer.slice(layerPointer));
            var path = layer.pathInfo;
            if (!path) {
                this._groupLayers.children.push({ layer: layer, children: [] });

            } else {
                var item = this._groupLayers;
                var toCall = function (item, index) {
                    if (index == path.data.length) {
                        item.layer = layer;
                    } else {
                        if (isUnset(item.children[path.data.items[index]])) {
                            item.children[path.data.items[index]] = { layer: null, children: [] };
                        }
                        item.children[path.data.items[index]] = toCall.call(this, item.children[path.data.items[index]], index + 1);
                    }

                    return item;
                };

                this._groupLayers = toCall.call(this, this._groupLayers, 0);
            }
            return layer;
        }.bind(this)).toArray();

        this._channels = Lazy(this._header.channelList).filter(remove_empty).map(function (channelPointer) {
            return new GimpChannel(this, this._buffer.slice(channelPointer));
        }.bind(this)).toArray();

    }

    getBufferForPointer(offset) {
        return this._buffer.slice(offset);
    }

    get width() {

        return this._header.width;
    }

    get height() {
        return this._header.height;
    }

    get layers() {
        return this._layers;
    }

    get groupLayers() {
        if (isUnset(this._groupLayers)) {
            this._groupLayers = {};
            Lazy(this.layers).each((layer) => {
                var segments = layer.groupName.split('/');
                var cursor = this._groupLayers;

                for (var i = 0; i < segments.length - 1; ++i) {
                    cursor[segments[i]] = cursor[segments[i]] || {};
                    cursor[segments[i]].children = cursor[segments[i]].children || {};
                    cursor = cursor[segments[i]].children;
                }
                cursor[segments[segments.length - 1]] = cursor[segments[segments.length - 1]] || {};
                cursor[segments[segments.length - 1]].layer = layer;
            });
        }

        return this._groupLayers;
    }

    createImage(image) {
        if (isUnset(image)) {
            image = new XCFImage(this.width, this.height);
            image.fillRect(0, 0, this.width, this.height, { red: 0, green: 0, blue: 0, alpha: 1 });
        }

        Lazy(this.layers).reverse().each(function (layer) {
            layer.makeImage(image, true);
        });
        return image;
    }
}

var XCFImage = function (width, height) {
    this._width = width;
    this._height = height;
    this._image = PNGImage.createImage(width, height);
}

for (var key in PNGImage.prototype) {
    if (typeof PNGImage.prototype[key] === 'function') {
        (function (key) {
            XCFImage.prototype[key] = function () {
                return this._image[key].apply(this._image, arguments);
            }
        })(key);
    }
}

XCFImage.prototype.setAt = function (x, y, colour) {
    if (x < 0 || x > this._width || y < 0 || y > this._height) {
        return;
    }
    this._image.setAt(x, y, colour);
}

XCFImage.prototype.getAt = function (x, y) {
    var idx = this._image.getIndex(x, y);

    return {
        red: this._image.getRed(idx),
        green: this._image.getGreen(idx),
        blue: this._image.getBlue(idx),
        alpha: this._image.getAlpha(idx)
    }
}

export { XCFParser, XCFImage };