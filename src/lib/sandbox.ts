import Sandbox, { type Options } from 'websandbox';

export async function initSandbox(frameContainer: HTMLDivElement) {
    const localApi = {
        makeWorkerScript: async() => await fetch("./_worker.js").then(t=>t.blob()).then(t=>t.text())
    };

    const sandboxOptions: Options = {
        frameContainer,
        frameClassName: "result-iframe"
    };

    const sandbox = await Sandbox.create(localApi, sandboxOptions).promise;

    await sandbox.importScript("./_sandbox.js");

    return {
        reload(code: string) {
            sandbox.run("generateWorker(\"void \"+ (function main(){"+code+"\n}).toString() + \"();\");");
        }
    };
}

