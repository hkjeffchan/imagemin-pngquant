"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => src_default
});
module.exports = __toCommonJS(src_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
