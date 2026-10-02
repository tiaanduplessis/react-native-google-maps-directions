const assert = require('assert')
const { execFileSync } = require('child_process')
const fs = require('fs')
const os = require('os')
const path = require('path')
const vm = require('vm')
const ts = require('typescript')

const root = path.resolve(__dirname, '..')
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'maps-directions-test-'))
const packageName = 'react-native-google-maps-directions'
const packagePath = path.join(temporary, 'node_modules', packageName)
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'

function runNpm (args, cwd) {
  return execFileSync(npm, args, {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, npm_config_cache: path.join(temporary, 'cache') },
    shell: process.platform === 'win32'
  })
}

function checkTypes (source, options = {}) {
  const filename = path.join(temporary, 'consumer.ts')
  fs.writeFileSync(filename, source)
  const program = ts.createProgram([filename], {
    strict: true,
    noEmit: true,
    skipLibCheck: false,
    types: [],
    target: ts.ScriptTarget.ES2018,
    module: ts.ModuleKind.CommonJS,
    moduleResolution: ts.ModuleResolutionKind.Node10,
    ...options
  })
  const diagnostics = ts.getPreEmitDiagnostics(program)
  assert.strictEqual(diagnostics.length, 0, ts.formatDiagnosticsWithColorAndContext(diagnostics, {
    getCanonicalFileName: filename => filename,
    getCurrentDirectory: () => temporary,
    getNewLine: () => '\n'
  }))
}

function loadRuntime (linking) {
  const source = fs.readFileSync(path.join(packagePath, 'index.js'), 'utf8')
  const result = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2018 }
  })
  const exports = {}
  vm.runInNewContext(result.outputText, {
    exports,
    require: name => {
      assert.strictEqual(name, 'react-native')
      return { Linking: linking }
    }
  })
  assert.deepStrictEqual(Object.keys(exports), ['default'])
  assert.strictEqual(typeof exports.default, 'function')
  return exports.default
}

async function main () {
  const packed = JSON.parse(runNpm(['pack', '--ignore-scripts', '--json', '--pack-destination', temporary], root))[0]
  assert.deepStrictEqual(packed.files.map(file => file.path).sort(), [
    'LICENSE', 'README.md', 'index.d.ts', 'index.js', 'package.json'
  ])
  fs.writeFileSync(path.join(temporary, 'package.json'), '{"private":true}')
  runNpm([
    'install', path.join(temporary, packed.filename), '--ignore-scripts', '--offline',
    '--no-audit', '--no-fund', '--no-package-lock'
  ], temporary)
  const manifest = JSON.parse(fs.readFileSync(path.join(packagePath, 'package.json'), 'utf8'))
  assert.strictEqual(manifest.types, 'index.d.ts')
  assert.strictEqual(manifest.main, 'index.js')

  const consumer = fs.readFileSync(path.join(__dirname, 'consumer.ts'), 'utf8')
  checkTypes(consumer)
  checkTypes(consumer, { esModuleInterop: true })
  checkTypes(consumer, {
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    verbatimModuleSyntax: true
  })
  checkTypes(`import directions = require('${packageName}')\nconst result: Promise<any> = directions.default()\n`)

  const readme = fs.readFileSync(path.join(packagePath, 'README.md'), 'utf8')
  const example = readme.match(/```ts\n([\s\S]*?)```/)
  assert.ok(example, 'README must include a TypeScript example')
  checkTypes(example[1], {
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    verbatimModuleSyntax: true
  })

  const checked = []
  const opened = []
  const resolvedValue = { opened: true }
  const getDirections = loadRuntime({
    canOpenURL: async url => { checked.push(url); return true },
    openURL: async url => { opened.push(url); return resolvedValue }
  })
  assert.strictEqual(await getDirections(), resolvedValue)
  assert.strictEqual(await getDirections({}), resolvedValue)
  await getDirections({ destination: { latitude: -33.86, longitude: 18.69 } })
  await getDirections({ source: { latitude: 0, longitude: 0 } })
  await getDirections({
    source: { latitude: -90, longitude: -180 },
    destination: { latitude: 90, longitude: 180 },
    params: [{ key: 'travelmode', value: 'driving' }, { key: 'dir_action', value: 'navigate' }],
    waypoints: [{ latitude: 1, longitude: 2 }, { latitude: 3, longitude: 4 }]
  })
  await getDirections({
    destination: { latitude: 91, longitude: 0 },
    source: { latitude: 0, longitude: -181 }
  })
  const base = 'https://www.google.com/maps/dir/?api=1&'
  assert.deepStrictEqual(opened, [
    base, base, `${base}destination=-33.86,18.69`, `${base}origin=0,0`,
    `${base}travelmode=driving&dir_action=navigate&destination=90,180&origin=-90,-180&waypoints=1,2|3,4`,
    base
  ])
  assert.deepStrictEqual(checked, opened)

  const unexpectedOpen = () => assert.fail('openURL must not run when canOpenURL fails')
  await assert.rejects(loadRuntime({ canOpenURL: async () => false, openURL: unexpectedOpen })(), {
    message: `Could not open the url: ${base}`
  })
  const checkError = new Error('canOpenURL failed')
  await assert.rejects(loadRuntime({ canOpenURL: async () => { throw checkError }, openURL: unexpectedOpen })(),
    error => error === checkError)
  const openError = new Error('openURL failed')
  await assert.rejects(loadRuntime({
    canOpenURL: async () => true,
    openURL: async () => { throw openError }
  })(), error => error === openError)
  console.log('Passed: packed declarations, 4 strict consumer configurations, and mocked Linking behavior')
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
}).finally(() => fs.rmSync(temporary, { recursive: true, force: true }))
