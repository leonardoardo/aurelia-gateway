import { pathsToModuleNameMapper } from "ts-jest";
import fs from "fs";

const tsconfig = JSON.parse(fs.readFileSync("./tsconfig.json", "utf8"));

export default {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  rootDir: ".",

  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1",
    ...pathsToModuleNameMapper(tsconfig.compilerOptions?.paths || {}, {
      prefix: "<rootDir>/",
    }),
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },

  transform: {
    "^.+\\.(t|j)s$": [
      "ts-jest",
      { useESM: true }
    ],
  },

  moduleFileExtensions: ["ts", "js", "json"],
  testRegex: ".*\\.spec\\.ts$",
  collectCoverageFrom: ["src/**/*.(t|j)s"],
  coverageDirectory: "coverage",
};
