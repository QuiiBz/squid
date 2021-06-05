const path = require('path')
const fs = require('fs')

const isArm = require('os').arch === 'arm64';

exports.default = async (context) => {
    const baseDirPath = path.resolve(__dirname, '..', '..')
    const snapshotName = isArm ? 'v8_context_snapshot.bin' : 'v8_context_snapshot.arm64.bin';
    const pathToBlob = path.join(baseDirPath, snapshotName)

    switch (process.platform) {
      case 'darwin': {
        const macDist = fs.existsSync(path.resolve(__dirname, '..', '..', 'dist', 'mac-arm64'))
            ? 'mac-arm64'
            : 'mac';

        const pathToElectron = path.resolve(
          __dirname,
          '..',
          '..',
          `dist/${macDist}/Squid.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Resources`
        )
        fs.copyFileSync(pathToBlob, path.join(pathToElectron, snapshotName))
        break
      }
      // TODO
      case 'win32':
      case 'linux': {
        break
      }
    }
}
