import Sandbox, { type Options } from 'websandbox';

const pathPrefix = process.env.NODE_ENV === "production" ? "/code-together" : "";

export async function initSandbox(frameContainer: HTMLDivElement) {
    const localApi = {
        makeWorkerScript: async() => await fetch(pathPrefix + "/_worker.js").then(t=>t.blob()).then(t=>t.text())
    };

    const sandboxOptions: Options = {
        frameContainer,
        frameClassName: "result-iframe"
    };

    const sandbox = await Sandbox.create(localApi, sandboxOptions).promise;

    await sandbox.importScript(pathPrefix + "/_sandbox.js");

    return {
        reload(code: string) {
            sandbox.run("generateWorker(\"void \"+ (function main(){"+code+"\n}).toString() + \"();\");");
        }
    };
}

