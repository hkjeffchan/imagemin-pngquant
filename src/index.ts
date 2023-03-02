export interface Options {
	/**
	Speed `10` has 5% lower quality, but is about 8 times faster than the default. Speed `11` disables dithering and lowers compression level.

	Values: `1` (brute-force) to `11` (fastest)

	@default 3
	*/
	speed?: number;

	/**
	Remove optional metadata.

	@default false
	*/
	strip?: boolean;

	/**
	Instructs pngquant to use the least amount of colors required to meet or exceed the max quality. If conversion results in quality below the min quality the image won't be saved.

	Min and max are numbers in range 0 (worst) to 1 (perfect), similar to JPEG.

	Values: `[0...1, 0...1]`

	@example [0.3, 0.5]
	*/
	quality?: [number, number];

	/**
	Set the dithering level using a fractional number between 0 (none) and 1 (full).

	Pass in `false` to disable dithering.

	Values: 0...1

	@default 1
	*/
	dithering?: number | boolean;

	/**
	Truncate number of least significant bits of color (per channel).

	Use this when image will be output on low-depth displays (e.g. 16-bit RGB). pngquant will make almost-opaque pixels fully opaque and will reduce amount of semi-transparent colors.
	*/
	posterize?: number;

	/**
	Print verbose status messages.

	@default false
	*/
	verbose?: boolean;
}

const imageminPngquant =
	(options: Options = {}) =>
	async (input: Buffer) => {
		const isBuffer = Buffer.isBuffer(input);

		const isPng = await import("is-png");
		const isStream = await import("is-stream");
		const ow = await import("ow");

		if (!isBuffer && !isStream.isStream(input)) {
			return Promise.reject(
				new TypeError(`Expected a Buffer or Stream, got ${typeof input}`)
			);
		}

		if (isBuffer && !isPng.default(input)) {
			return Promise.resolve(input);
		}

		const args = ["-"];

		if (typeof options.speed !== "undefined") {
			if (
				ow.default.isValid(
					options.speed,
					ow.default.number.integer.inRange(1, 11)
				)
			) {
				args.push("--speed", `${options.speed}`);
			}
		}

		if (typeof options.strip !== "undefined") {
			if (
				ow.default.isValid(options.strip, ow.default.boolean) &&
				options.strip
			) {
				args.push("--strip");
			}
		}

		if (typeof options.quality !== "undefined") {
			if (
				ow.default.isValid(
					options.quality,
					ow.default.array.length(2).ofType(ow.default.number.inRange(0, 1))
				)
			) {
				const [min, max] = options.quality;
				args.push(
					"--quality",
					`${Math.round(min * 100)}-${Math.round(max * 100)}`
				);
			}
		}

		if (typeof options.dithering !== "undefined") {
			if (
				ow.default.isValid(
					options.dithering,
					ow.default.any(
						ow.default.number.inRange(0, 1),
						ow.default.boolean.false
					)
				)
			) {
				if (typeof options.dithering === "number") {
					args.push(`--floyd=${options.dithering}`);
				} else if (options.dithering === false) {
					args.push("--ordered");
				}
			}
		}

		if (typeof options.posterize !== "undefined") {
			if (ow.default.isValid(options.posterize, ow.default.number)) {
				args.push("--posterize", `${options.posterize}`);
			}
		}

		if (typeof options.verbose !== "undefined") {
			if (ow.default.isValid(options.verbose, ow.default.boolean)) {
				args.push("--verbose");
			}
		}

		const execa = await import("execa");
		const pngquant = await import("pngquant-bin");

		const subprocess = await execa.execa(pngquant.default, args, {
			encoding: null,
			maxBuffer: Infinity,
			input,
		});

		if (subprocess.failed) {
			if (subprocess.exitCode === 99) {
				return input;
			}

			throw subprocess.stderr;
		}

		return subprocess.stdout;
	};

export default imageminPngquant;
