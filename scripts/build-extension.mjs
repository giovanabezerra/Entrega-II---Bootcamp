import fs from 'fs-extra';
import archiver from 'archiver'; // Correção de importação para Node.js MJS
import path from 'path';

const EXTENSION_DIR = 'hello-ext';
const BUILD_DIR = 'dist';
const ARCHIVE_FILE = `${BUILD_DIR}/extension.zip`;

// Caminhos de entrada
const EXTENSION_PATH = path.join(process.cwd(), EXTENSION_DIR);
const MANIFEST_ROOT_PATH = path.join(process.cwd(), 'manifest.json');
const MANIFEST_EXT_PATH = path.join(EXTENSION_PATH, 'manifest.json');

// Caminhos de saída
const BUILD_PATH = path.join(process.cwd(), BUILD_DIR);

/**
 * Determina qual manifest.json usar (prioriza hello-ext/manifest.json)
 */
function getManifestPath() {
    if (fs.existsSync(MANIFEST_EXT_PATH)) {
        return MANIFEST_EXT_PATH;
    }
    if (fs.existsSync(MANIFEST_ROOT_PATH)) {
        return MANIFEST_ROOT_PATH;
    }
    return null;
}

async function runBuild() {
    console.log(`\nIniciando build para ${EXTENSION_DIR}...`);

    try {
        // 1. Limpa o diretório de build
        await fs.remove(BUILD_PATH);
        await fs.ensureDir(BUILD_PATH);

        // 2. Determina o caminho do manifest
        const manifestSourcePath = getManifestPath();
        if (!manifestSourcePath) {
            throw new Error('manifest.json não encontrado nem na raiz, nem em hello-ext/');
        }

        // 3. Copia a pasta da extensão (hello-ext) para dist/
        console.log(`Copiando arquivos de ${EXTENSION_DIR}/ para ${BUILD_DIR}/...`);
        await fs.copy(EXTENSION_PATH, BUILD_PATH, {
            overwrite: true,
            filter: (src) => !src.includes('node_modules')
        });

        // 4. Garante que o manifest.json está na raiz de dist/
        await fs.copy(manifestSourcePath, path.join(BUILD_PATH, 'manifest.json'));
        console.log('Copiado manifest.json para a raiz de dist/.');


        // 5. Cria o arquivo .zip da extensão
        await new Promise((resolve, reject) => {
            const archive = archiver('zip', { zlib: { level: 9 } });
            const output = fs.createWriteStream(ARCHIVE_FILE);

            output.on('close', () => {
                console.log(`Build gerado em ${BUILD_DIR}/ e ${ARCHIVE_FILE}`);
                resolve();
            });

            archive.on('error', (err) => reject(err));

            archive.pipe(output);

            // Adiciona todos os arquivos do diretório de build (dist) ao zip
            archive.directory(BUILD_PATH, false, { dot: true, ignore: [ARCHIVE_FILE] });

            archive.finalize();
        });

    } catch (error) {
        console.error('Falha no processo de build:', error.message);
        process.exit(1);
    }
}

runBuild();
