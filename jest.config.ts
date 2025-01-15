import type { Config } from "@jest/types";
import path from "path";

const config: Config.InitialOptions = {
  moduleFileExtensions: ["ts", "js"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  testMatch: ["**/?(*.)+(spec|test).ts"],
  reporters: [
    "default",
    path.resolve(__dirname, "dist/src/tests/MyCustomReporter.js"),
  ],
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
  extensionsToTreatAsEsm: [".ts"],
  preset: "ts-jest/presets/default-esm",
};

export default config;
