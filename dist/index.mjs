// src/index.ts
var imageminPngquant = (options) => async (input) => {
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
    if (ow.default.isValid(
      options.speed,
      ow.default.number.integer.inRange(1, 11)
    )) {
      args.push("--speed", `${options.speed}`);
    }
  }
  if (typeof options.strip !== "undefined") {
    if (ow.default.isValid(options.strip, ow.default.boolean) && options.strip) {
      args.push("--strip");
    }
  }
  if (typeof options.quality !== "undefined") {
    if (ow.default.isValid(
      options.quality,
      ow.default.array.length(2).ofType(ow.default.number.inRange(0, 1))
    )) {
      const [min, max] = options.quality;
      args.push(
        "--quality",
        `${Math.round(min * 100)}-${Math.round(max * 100)}`
      );
    }
  }
  if (typeof options.dithering !== "undefined") {
    if (ow.default.isValid(
      options.dithering,
      ow.default.any(
        ow.default.number.inRange(0, 1),
        ow.default.boolean.false
      )
    )) {
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
  const subprocess = await execa.execa(options.binaryPath, args, {
    encoding: null,
    maxBuffer: Infinity,
    input
  });
  if (subprocess.failed) {
    if (subprocess.exitCode === 99) {
      return input;
    }
    throw subprocess.stderr;
  }
  return subprocess.stdout;
};
var src_default = imageminPngquant;
export {
  src_default as default
};
