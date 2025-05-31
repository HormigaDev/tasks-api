#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// ===============================
// ========== CONFIG =============
// ===============================

const [, , inputFileArg, outputDirArg] = process.argv;

if (!inputFileArg) {
    console.error(
        '❌ Error: Debes proporcionar la ruta del archivo de entrada.\nEjemplo: node generate-perms.js ./dev/perms.ts ./output',
    );
    process.exit(1);
}

const inputFile = path.resolve(inputFileArg);
const outputDir = outputDirArg ? path.resolve(outputDirArg) : __dirname;

// ===============================
// ========== FUNCIONES ==========
// ===============================

function parsePermissions(content) {
    const permissionsMap = new Map();

    const enumRegex = /(\w+)\s*:\s*1n\s*<<\s*(\d+)n/g;
    let match;
    while ((match = enumRegex.exec(content)) !== null) {
        const [, key, shift] = match;
        const value = BigInt(1) << BigInt(shift);
        permissionsMap.set(key, value);
    }

    const dictRegex = /\{\s*id:\s*Permissions\.(\w+),\s*name:\s*['"`]([^'"`]+)['"`]\s*\}/g;
    const result = [];

    while ((match = dictRegex.exec(content)) !== null) {
        const [, key, name] = match;
        const value = permissionsMap.get(key);

        if (value === undefined) {
            console.warn(
                `⚠️ Advertencia: No se encontró el valor para "${key}" en el enum Permissions.`,
            );
            continue;
        }
        result.push([name, value]);
    }

    return result;
}

function generateJsonFile(data, outputPath) {
    const json =
        '{\n' +
        '    "permissions": [\n' +
        data.map(([name, value]) => `        ["${name}", ${value.toString()}]`).join(',\n') +
        '\n    ]\n' +
        '}\n';

    fs.writeFileSync(outputPath, json);
}

// ===============================
// ========== MAIN ===============
// ===============================

try {
    if (!fs.existsSync(inputFile)) {
        console.error(`❌ Error: No se encontró el archivo de entrada en ${inputFile}`);
        process.exit(1);
    }

    const content = fs.readFileSync(inputFile, 'utf8');
    const parsed = parsePermissions(content);

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, 'permissions.json');

    generateJsonFile(parsed, outputPath);

    console.log(`✅ Archivo generado correctamente en: ${outputPath}`);
} catch (error) {
    console.error('❌ Error durante la ejecución:', error);
    process.exit(1);
}
