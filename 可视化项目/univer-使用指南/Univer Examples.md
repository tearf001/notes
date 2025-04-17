
https://github.com/dream-num/univer/tree/dev/examples


# Sheets

没有使用`presets`

```ts

import { LocaleType, LogLevel, Univer, UniverInstanceType, UserManagerService } from '@univerjs/core';
import { FUniver } from '@univerjs/core/facade';
import { UniverDebuggerPlugin } from '@univerjs/debugger';
import { defaultTheme } from '@univerjs/design';
import { UniverDocsPlugin } from '@univerjs/docs';
import { UniverDocsDrawingUIPlugin } from '@univerjs/docs-drawing-ui';
import { UniverDocsMentionUIPlugin } from '@univerjs/docs-mention-ui';
import { UniverDocsUIPlugin } from '@univerjs/docs-ui';
import { UniverFormulaEnginePlugin } from '@univerjs/engine-formula';
import { UniverRenderEnginePlugin } from '@univerjs/engine-render';
import { DEFAULT_WORKBOOK_DATA_DEMO } from '@univerjs/mockdata'; // 模拟数据
import { UniverNetworkPlugin } from '@univerjs/network';
import { UniverRPCMainThreadPlugin } from '@univerjs/rpc'; // here here 主线程worker 插件注册
import { UniverSheetsPlugin } from '@univerjs/sheets';
import { UniverSheetsConditionalFormattingPlugin } from '@univerjs/sheets-conditional-formatting';
import { UniverSheetsDataValidationPlugin } from '@univerjs/sheets-data-validation';
import { UniverSheetsFilterPlugin } from '@univerjs/sheets-filter';
import { UniverSheetsFormulaPlugin } from '@univerjs/sheets-formula';
import { UniverSheetsFormulaUIPlugin } from '@univerjs/sheets-formula-ui';
import { UniverSheetsHyperLinkPlugin } from '@univerjs/sheets-hyper-link';
import { UniverSheetsNumfmtPlugin } from '@univerjs/sheets-numfmt';
import { UniverSheetsNumfmtUIPlugin } from '@univerjs/sheets-numfmt-ui';
import { UniverSheetsSortPlugin } from '@univerjs/sheets-sort';
import { UniverSheetsBindingSourcePlugin } from '@univerjs/sheets-source-binding';
import { UniverSheetsThreadCommentPlugin } from '@univerjs/sheets-thread-comment';
import { UniverSheetsThreadCommentUIPlugin } from '@univerjs/sheets-thread-comment-ui';
import { UniverSheetsUIPlugin } from '@univerjs/sheets-ui';
import { UniverSheetsZenEditorPlugin } from '@univerjs/sheets-zen-editor';
import { UniverThreadCommentUIPlugin } from '@univerjs/thread-comment-ui';
import { UniverUIPlugin } from '@univerjs/ui';

import { enUS, faIR, frFR, ruRU, viVN, zhCN, zhTW } from '../locales';

import { UniverSheetsCustomMenuPlugin } from './custom-menu';

// facades
import '@univerjs/sheets/facade';
import '@univerjs/ui/facade';
import '@univerjs/docs-ui/facade';
import '@univerjs/sheets-ui/facade';
import '@univerjs/sheets-data-validation/facade';
import '@univerjs/engine-formula/facade';
import '@univerjs/sheets-filter/facade';
import '@univerjs/sheets-formula/facade';
import '@univerjs/sheets-numfmt/facade';
import '@univerjs/sheets-hyper-link-ui/facade';
import '@univerjs/sheets-thread-comment/facade';
import '@univerjs/sheets-conditional-formatting/facade';
import '@univerjs/sheets-find-replace/facade';
import '@univerjs/sheets-drawing-ui/facade';
import '@univerjs/sheets-zen-editor/facade';
import '@univerjs/sheets-source-binding/facade';
import '@univerjs/sheets-crosshair-highlight/facade';
import '@univerjs/sheets-formula-ui/facade';
import '@univerjs/sheets-sort/facade';
import '@univerjs/network/facade';

// styles
import '../global.css';
import './styles';

/* eslint-disable-next-line node/prefer-global/process */
const IS_E2E: boolean = !!process.env.IS_E2E;

const LOAD_LAZY_PLUGINS_TIMEOUT = 100;
const LOAD_VERY_LAZY_PLUGINS_TIMEOUT = 1_000;

export const mockUser = {
    userID: 'Owner_qxVnhPbQ',
    name: 'Owner',
    avatar: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAInSURBVHgBtZU9TxtBEIbfWRzFSIdkikhBSqRQkJqkCKTCFkqVInSUSaT0wC8w/gXxD4gU2nRJkXQWhAZowDUUWKIwEgWWbEEB3mVmx3dn4DA2nB/ppNuPeWd29mMIPXDr+RxwtgRHeW6+guNPRxogqnL7Dwz9psJ27S4NShaeZTH3kwXy6I81dlRKcmRui88swdq9AcSFL7Buz1Vmlns64MiLsCjzwnIYHLH57tbfFbs7KRaXyEU8FVZofqccOfA5l7Q8LPIkGrwnb2RPNEXWFVMUF3L+kDCk0btDDAMzOm5YfAHDwp4tG74wnzAsiOYMnJ3GoDybA7IT98/jm5+JNnfiIzAS6LlqHQBN/i6b2t/cV1Hh6BfwYlHnHP4AXi5q/8kmMMpOs8+BixZw/Fd6xUEHEbnkgclvQP2fGp7uShRKnQ3G32rkjV1th8JhIGG7tR/JyjGteSOZELwGMmNqIIigRCLRh2OZIE6BjItdd7pCW6Uhm1zzkUtungSxwEUzNpQ+GQumtH1ej1MqgmNT6vwmhCq5yuwq56EYTbgeQUz3yvrpV1b4ok3nYJ+eYhgYmjRUqErx2EDq0Fr8FhG++iqVGqxlUJI/70Ar0UgJaWHj6hYVHJrfKssAHot1JfqwE9WVWzXZVd5z2Ws/4PnmtEjkXeKJDvxUecLbWOXH/DP6QQ4J72NS0adedp1aseBfXP8odlZFfPvBF7SN/8hky1TYuPOAXAEipMx15u5ToAAAAABJRU5ErkJggg==',
    anonymous: false,
    canBindAnonymous: false,
};

// eslint-disable-next-line max-lines-per-function
function createNewInstance() {
    // univer
    const univer = new Univer({
        theme: defaultTheme,
        locale: LocaleType.ZH_CN,
        locales: { [LocaleType.ZH_CN]: zhCN },
        logLevel: LogLevel.VERBOSE,
    });

    const worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' }); // worker线程
    univer.registerPlugin(UniverRPCMainThreadPlugin, { workerURL: worker }); // 主线程插件

    univer.registerPlugin(UniverDocsPlugin);
    univer.registerPlugin(UniverRenderEnginePlugin);
    univer.registerPlugin(UniverUIPlugin, { container: 'app' });
    univer.registerPlugin(UniverDocsUIPlugin);
    univer.registerPlugin(UniverDocsDrawingUIPlugin);
    univer.registerPlugin(UniverDocsMentionUIPlugin);

    univer.registerPlugin(UniverSheetsPlugin, { notExecuteFormula: true });
    univer.registerPlugin(UniverSheetsUIPlugin);
    univer.registerPlugin(UniverSheetsNumfmtPlugin, {
        disableTextFormatAlert: true,
        disableTextFormatMark: true,
    });
    univer.registerPlugin(UniverSheetsZenEditorPlugin);
    univer.registerPlugin(UniverFormulaEnginePlugin, { notExecuteFormula: true });
    univer.registerPlugin(UniverSheetsNumfmtUIPlugin);
    univer.registerPlugin(UniverSheetsFormulaPlugin, { notExecuteFormula: true });
    univer.registerPlugin(UniverSheetsFormulaUIPlugin);
    univer.registerPlugin(UniverSheetsDataValidationPlugin);
    univer.registerPlugin(UniverSheetsConditionalFormattingPlugin);
    univer.registerPlugin(UniverSheetsFilterPlugin);
    univer.registerPlugin(UniverSheetsSortPlugin);
    univer.registerPlugin(UniverSheetsHyperLinkPlugin);
    univer.registerPlugin(UniverThreadCommentUIPlugin);
    univer.registerPlugin(UniverSheetsThreadCommentPlugin);
    univer.registerPlugin(UniverSheetsThreadCommentUIPlugin);
    univer.registerPlugin(UniverSheetsBindingSourcePlugin);
    univer.registerPlugin(UniverSheetsCustomMenuPlugin);
    univer.registerPlugin(UniverNetworkPlugin);

    // If we are running in e2e platform, we should immediately register the debugger plugin.
    if (IS_E2E) {
        univer.registerPlugin(UniverDebuggerPlugin); // 调试插件
    }

    const injector = univer.__getInjector(); // 注入器
    const userManagerService = injector.get(UserManagerService);
    userManagerService.setCurrentUser(mockUser); // 设置

    // create univer sheet instance  // 模拟数据
    if (!IS_E2E) {
        univer.createUnit(UniverInstanceType.UNIVER_SHEET, DEFAULT_WORKBOOK_DATA_DEMO); 
    }

    // 动态插件
    setTimeout(() => {
        // 条件验证, 数据验证, drawing, filter
        import('./lazy').then((lazy) => {
            const plugins = lazy.default();
            plugins.forEach((p) => univer.registerPlugin(p[0], p[1]));
        });
    }, LOAD_LAZY_PLUGINS_TIMEOUT);

    setTimeout(() => {
        // 不常见插件: 记录, 排序, 水印 超链接, crosshair-highlight
        import('./very-lazy').then((lazy) => {
            const plugins = lazy.default();
            plugins.forEach((p) => univer.registerPlugin(p[0], p[1]));
        });
    }, LOAD_VERY_LAZY_PLUGINS_TIMEOUT);
    // cleanups
    univer.onDispose(() => {
        worker.terminate();
        window.univer = undefined;
        window.univerAPI = undefined;
    });

    window.univer = univer;
    window.univerAPI = FUniver.newAPI(univer);
}

createNewInstance();
window.createNewInstance = createNewInstance;

declare global {
    // eslint-disable-next-line ts/naming-convention
    interface Window {
        univer?: Univer;
        univerAPI?: ReturnType<typeof FUniver.newAPI>;
        createNewInstance?: typeof createNewInstance;
    }
}
```

## worker.ts

Univer ***web worker*** is also a univer **application**.

```ts
import { LocaleType, LogLevel, Univer } from '@univerjs/core';
import { UniverFormulaEnginePlugin } from '@univerjs/engine-formula';
import { UniverRPCWorkerThreadPlugin } from '@univerjs/rpc'; // here here
import { UniverSheetsPlugin } from '@univerjs/sheets';
import { UniverSheetsFilterPlugin } from '@univerjs/sheets-filter';
import { UniverRemoteSheetsFormulaPlugin } from '@univerjs/sheets-formula';
import { enUS, faIR, ruRU, viVN, zhCN, zhTW } from '../locales';

// Univer web worker is also a univer application.
const univer = new Univer({
    locale: LocaleType.ZH_CN,
    // ...
});

univer.registerPlugin(UniverSheetsPlugin, { onlyRegisterFormulaRelatedMutations: true });
univer.registerPlugin(UniverFormulaEnginePlugin);
univer.registerPlugin(UniverRPCWorkerThreadPlugin); // here here 注册
univer.registerPlugin(UniverRemoteSheetsFormulaPlugin);
univer.registerPlugin(UniverSheetsFilterPlugin);

declare let self: WorkerGlobalScope & typeof globalThis & { univer: Univer };
self.univer = univer;
```