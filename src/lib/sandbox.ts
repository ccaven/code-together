import Sandbox, { type Options } from 'websandbox';

export async function initSandbox(frameContainer: HTMLDivElement, width: number) {
    const localApi = {
        makeWorkerScript: async() => await fetch("/_worker.js").then(t=>t.blob()).then(t=>t.text())
    };

    const sandboxOptions: Options = {
        frameContainer,
        frameClassName: "result-iframe"
    };

    const sandbox = await Sandbox.create(localApi, sandboxOptions).promise;

    await sandbox.importScript("/_sandbox.js");

    function reload (code: string, regenerate: boolean = false) {
        sandbox.run("generateWorker(\"void \"+ (function main(){let canvas=null; let ctx=null; delete canvas; delete ctx;"+code+"\n}).toString() + \"();\", " + regenerate.toString() + ");");
    }

    reload("");

    return { reload };
}

