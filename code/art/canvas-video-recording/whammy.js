/*
	var vid = new Whammy.Video();
	vid.add(canvas or data url)
	vid.compile()
*/


// in this case, frames has a very specific meaning, which will be 
// detailed once i finish writing the code
function toWebM(frames, outputAsArray) {
	const info = checkFrames(frames);

	// max duration by cluster in milliseconds
	const CLUSTER_MAX_DURATION = 30000;

	const EBML = [
		{
			"id": 0x1A45DFA3,
			"data": [
				{
					"data": 1,
					"id": 0x4286,
				},
				{
					"data": 1,
					"id": 0x42F7,
				},
				{
					"data": 4,
					"id": 0x42F2,
				},
				{
					"data": 8,
					"id": 0x42F3,
				},
				{
					"data": `webm`,
					"id": 0x4282,
				},
				{
					"data": 2,
					"id": 0x4287,
				},
				{
					"data": 2,
					"id": 0x4285,
				},
			],
		},
		{
			"id": 0x18538067,
			"data": [
				{
					"id": 0x1549A966,
					"data": [
						{
							"data": 1e6,
							"id": 0x2AD7B1,
						},
						{
							"data": `whammy`,
							"id": 0x4D80,
						},
						{
							"data": `whammy`,
							"id": 0x5741,
						},
						{
							"data": doubleToString(info.duration),
							"id": 0x4489,
						},
					],
				},
				{
					"id": 0x1654AE6B,
					"data": [
						{
							"id": 0xAE,
							"data": [
								{
									"data": 1,
									"id": 0xD7,
								},
								{
									"data": 1,
									"id": 0x63C5,
								},
								{
									"data": 0,
									"id": 0x9C,
								},
								{
									"data": `und`,
									"id": 0x22B59C,
								},
								{
									"data": `V_VP8`,
									"id": 0x86,
								},
								{
									"data": `VP8`,
									"id": 0x258688,
								},
								{
									"data": 1,
									"id": 0x83,
								},
								{
									"id": 0xE0,
									"data": [
										{
											"data": info.width,
											"id": 0xB0,
										},
										{
											"data": info.height,
											"id": 0xBA,
										},
									],
								},
							],
						},
					],
				},
			],
		},
	];


	// Generate clusters (max duration)
	let frameNumber = 0;
	let clusterTimecode = 0;
	while (frameNumber < frames.length) {

		const clusterFrames = [];
		let clusterDuration = 0;
		do {
			clusterFrames.push(frames[frameNumber]);
			clusterDuration += frames[frameNumber].duration;
			frameNumber++;
		} while (frameNumber < frames.length && clusterDuration < CLUSTER_MAX_DURATION);

		var clusterCounter = 0;
		const cluster = {
			"id": 0x1F43B675,
			"data": [
				{
					"data": clusterTimecode,
					"id": 0xE7,
				},
			].concat(clusterFrames.map(function (webp) {
				const block = makeSimpleBlock({
					discardable: 0,
					frame: webp.data.slice(webp.data.indexOf(`\u009D\u0001\u002A`) - 3),
					// frame: webp.data.slice(4),
					invisible: 0,
					keyframe: 1,
					lacing: 0,
					trackNum: 1,
					timecode: Math.round(clusterCounter),
				});
				clusterCounter += webp.duration;
				return {
					data: block,
					id: 0xA3,
				};
			})),
		};

		// Add cluster to segment
		EBML[1].data.push(cluster);
		clusterTimecode += clusterDuration;
	}

	return generateEBML(EBML, outputAsArray);
}

// sums the lengths of all the frames and gets the duration, woo
function checkFrames(frames) {
	const { width } = frames[0];
	const { height } = frames[0];
	let { duration } = frames[0];

	console.log(`checkFrames`, { frames });

	for (let i = 1; i < frames.length; i++) {
		if (frames[i].width != width)
			throw `Frame ${i + 1} has a different width`;
		if (frames[i].height != height)
			throw `Frame ${i + 1} has a different height`;
		if (frames[i].duration < 0 || frames[i].duration > 0x7FFF)
			throw `Frame ${i + 1} has a weird duration (must be between 0 and 32767)`;
		duration += frames[i].duration;
	}
	return {
		duration,
		width,
		height,
	};
}


function numToBuffer(num) {
	const parts = [];
	while (num > 0) {
		parts.push(num & 0xFF);
		num >>= 8;
	}
	return new Uint8Array(parts.reverse());
}

function strToBuffer(str) {
	// return new Blob([str]);
	const arr = new Uint8Array(str.length);
	for (let i = 0; i < str.length; i++) {
		arr[i] = str.charCodeAt(i);
	}
	return arr;
	// this is slower
	// return new Uint8Array(str.split('').map(function(e){
	// 	return e.charCodeAt(0)
	// }))
}


// sorry this is ugly, and sort of hard to understand exactly why this was done
// at all really, but the reason is that there's some code below that i dont really
// feel like understanding, and this is easier than using my brain.
function bitsToBuffer(bits) {
	const data = [];
	const pad = (bits.length % 8) ? (new Array(1 + 8 - (bits.length % 8))).join(`0`) : ``;
	bits = pad + bits;
	for (let i = 0; i < bits.length; i += 8) {
		data.push(Number.parseInt(bits.substr(i, 8), 2));
	}
	return new Uint8Array(data);
}

function generateEBML(json, outputAsArray) {
	const ebml = [];
	for (const element of json) {
		let { data } = element;
		if (typeof data == `object`)
			data = generateEBML(data, outputAsArray);
		if (typeof data == `number`)
			data = bitsToBuffer(data.toString(2));
		if (typeof data == `string`)
			data = strToBuffer(data);

		if (data.length) {
			var z = z;
		}

		const len = data.size || data.byteLength || data.length;
		const zeroes = Math.ceil(Math.ceil(Math.log(len) / Math.log(2)) / 8);
		const size_str = len.toString(2);
		const padded = (new Array((zeroes * 7 + 7 + 1) - size_str.length)).join(`0`) + size_str;
		const size = `${(new Array(zeroes)).join(`0`)}1${padded}`;

		// i actually dont quite understand what went on up there, so I'm not really
		// going to fix this, i'm probably just going to write some hacky thing which
		// converts that string into a buffer-esque thing
		ebml.push(numToBuffer(element.id));
		ebml.push(bitsToBuffer(size));
		ebml.push(data);


	}

	// output as blob or byteArray
	if (outputAsArray) {
		// convert ebml to an array
		const buffer = toFlatArray(ebml);
		return new Uint8Array(buffer);
	}
	return new Blob(ebml, { type: `video/webm` });

}

function toFlatArray(arr, outBuffer) {
	if (outBuffer == null) {
		outBuffer = [];
	}
	for (const element of arr) {
		if (typeof element == `object`) {
			// an array
			toFlatArray(element, outBuffer);
		} else {
			// a simple element
			outBuffer.push(element);
		}
	}
	return outBuffer;
}

// OKAY, so the following two functions are the string-based old stuff, the reason they're
// still sort of in here, is that they're actually faster than the new blob stuff because
// getAsFile isn't widely implemented, or at least, it doesn't work in chrome, which is the
// only browser which supports get as webp
// Converting between a string of 0010101001's and binary back and forth is probably inefficient
// TODO: get rid of this function
function toBinStr_old(bits) {
	let data = ``;
	const pad = (bits.length % 8) ? (new Array(1 + 8 - (bits.length % 8))).join(`0`) : ``;
	bits = pad + bits;
	for (let i = 0; i < bits.length; i += 8) {
		data += String.fromCharCode(Number.parseInt(bits.substr(i, 8), 2));
	}
	return data;
}

function generateEBML_old(json) {
	let ebml = ``;
	for (const element of json) {
		let { data } = element;
		if (typeof data == `object`)
			data = generateEBML_old(data);
		if (typeof data == `number`)
			data = toBinStr_old(data.toString(2));

		const len = data.length;
		const zeroes = Math.ceil(Math.ceil(Math.log(len) / Math.log(2)) / 8);
		const size_str = len.toString(2);
		const padded = (new Array((zeroes * 7 + 7 + 1) - size_str.length)).join(`0`) + size_str;
		const size = `${(new Array(zeroes)).join(`0`)}1${padded}`;

		ebml += toBinStr_old(element.id.toString(2)) + toBinStr_old(size) + data;

	}
	return ebml;
}

// woot, a function that's actually written for this project!
// this parses some json markup and makes it into that binary magic
// which can then get shoved into the matroska comtainer (peaceably)
function makeSimpleBlock(data) {
	let flags = 0;
	if (data.keyframe)
		flags |= 128;
	if (data.invisible)
		flags |= 8;
	if (data.lacing)
		flags |= (data.lacing << 1);
	if (data.discardable)
		flags |= 1;
	if (data.trackNum > 127) {
		throw `TrackNumber > 127 not supported`;
	}
	const out = [data.trackNum | 0x80, data.timecode >> 8, data.timecode & 0xFF, flags].map(function (e) {
		return String.fromCharCode(e);
	}).join(``) + data.frame;

	return out;
}

// here's something else taken verbatim from weppy, awesome rite?
function parseWebP(riff) {
	const VP8 = riff.RIFF[0].WEBP[0];

	const frame_start = VP8.indexOf(`\u009D\u0001\u002A`); // A VP8 keyframe starts with the 0x9d012a header
	for (var i = 0, c = []; i < 4; i++)
		c[i] = VP8.charCodeAt(frame_start + 3 + i);

	let width; let horizontal_scale; let height; let vertical_scale; let tmp;

	// the code below is literally copied verbatim from the bitstream spec
	tmp = (c[1] << 8) | c[0];
	width = tmp & 0x3FFF;
	horizontal_scale = tmp >> 14;
	tmp = (c[3] << 8) | c[2];
	height = tmp & 0x3FFF;
	vertical_scale = tmp >> 14;
	return {
		width,
		height,
		data: VP8,
		riff,
	};
}

// i think i'm going off on a riff by pretending this is some known
// idiom which i'm making a casual and brilliant pun about, but since
// i can't find anything on google which conforms to this idiomatic
// usage, I'm assuming this is just a consequence of some psychotic
// break which makes me make up puns. well, enough riff-raff (aha a
// rescue of sorts), this function was ripped wholesale from weppy
function parseRIFF(string) {
	let offset = 0;
	const chunks = {};

	while (offset < string.length) {
		const id = string.substr(offset, 4);
		const len = Number.parseInt(string.substr(offset + 4, 4).split(``).map(function (i) {
			const unpadded = i.charCodeAt(0).toString(2);
			return (new Array(8 - unpadded.length + 1)).join(`0`) + unpadded;
		}).join(``), 2);
		const data = string.substr(offset + 4 + 4, len);
		offset += 4 + 4 + len;
		chunks[id] = chunks[id] || [];

		if (id == `RIFF` || id == `LIST`) {
			chunks[id].push(parseRIFF(data));
		} else {
			chunks[id].push(data);
		}
	}
	return chunks;
}

// here's a little utility function that acts as a utility for other functions
// basically, the only purpose is for encoding "Duration", which is encoded as
// a double (considerably more difficult to encode than an integer)
function doubleToString(num) {
	return [].slice.call(
		new Uint8Array(
			(
				new Float64Array([num]) // create a float64 array
			).buffer) // extract the array buffer
		,
		0) // convert the Uint8Array into a regular array
		.map(function (e) {
			return String.fromCharCode(e); // encode all the bytes individually
		})
		.reverse() // correct the byte endianness (assume it's little endian for now)
		.join(``); // join the bytes in holy matrimony as a string
}

function WhammyVideo(speed, quality) {
	this.frames = [];
	this.duration = 1000 / speed;
	this.quality = quality || 0.8;
}

WhammyVideo.prototype.add = function (frame, duration) {
	if (typeof duration != `undefined` && this.duration)
		throw `you can't pass a duration if the fps is set`;
	if (typeof duration == `undefined` && !this.duration)
		throw `if you don't have the fps set, you ned to have durations here.`;
	if (typeof frame !== 'string') {
		if (`canvas` in frame) { // CanvasRenderingContext2D
			frame = frame.canvas;
		}
		if (`toDataURL` in frame) {
			frame = frame.toDataURL(`image/webp`, this.quality);
		} else if (typeof frame != `string`) {
			throw `frame must be a a HTMLCanvasElement, a CanvasRenderingContext2D or a DataURI formatted string`;
		}
	}
	if (!(/^data:image\/webp;base64,/gi).test(frame)) {
		throw `Input must be formatted properly as a base64 encoded DataURI of type image/webp`;
	}
	this.frames.push({
		image: frame,
		duration: duration || this.duration,
	});
};

WhammyVideo.prototype.compile = function (outputAsArray) {
	return new toWebM(this.frames.map(function (frame) {
		const webp = parseWebP(parseRIFF(atob(frame.image.slice(23))));
		webp.duration = frame.duration;
		return webp;
	}), outputAsArray);
};

export { WhammyVideo as Video };

export function fromImageArray(images, fps, outputAsArray) {
	return toWebM(images.map(function (image) {
		const webp = parseWebP(parseRIFF(atob(image.slice(23))));
		webp.duration = 1000 / fps;
		return webp;
	}), outputAsArray);
}

