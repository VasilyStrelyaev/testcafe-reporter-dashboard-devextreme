export enum CommandType {
    click = 'click',
    rightClick = 'right-click',
    doubleClick = 'double-click',
    drag = 'drag',
    dragToElement = 'drag-to-element',
    hover = 'hover',
    typeText = 'type-text',
    selectText = 'select-text',
    selectTextAreaContent = 'select-text-area-content',
    selectEditableContent = 'select-editable-content',
    pressKey = 'press-key',
    wait = 'wait',
    navigateTo = 'navigate-to',
    setFilesToUpload = 'set-files-to-upload',
    clearUpload = 'clear-upload',
    executeClientFunction = 'execute-client-function',
    executeSelector = 'execute-selector',
    takeScreenshot = 'take-screenshot',
    takeElementScreenshot = 'take-element-screenshot',
    takeScreenshotOnFail = 'take-screenshot-on-fail',
    prepareBrowserManipulation = 'prepare-browser-manipulation',
    showAssertionRetriesStatus = 'show-assertion-retries-status',
    hideAssertionRetriesStatus = 'hide-assertion-retries-status',
    setBreakpoint = 'set-breakpoint',
    resizeWindow = 'resize-window',
    resizeWindowToFitDevice = 'resize-window-to-fit-device',
    maximizeWindow = 'maximize-window',
    switchToIframe = 'switch-to-iframe',
    switchToMainWindow = 'switch-to-main-window',
    setNativeDialogHandler = 'set-native-dialog-handler',
    getNativeDialogHistory = 'get-native-dialog-history',
    getBrowserConsoleMessages = 'get-browser-console-messages',
    setTestSpeed = 'set-test-speed',
    setPageLoadTimeout = 'set-page-load-timeout',
    debug = 'debug',
    assertion = 'assertion',
    useRole = 'useRole',
    testDone = 'test-done',
    backupStorages = 'backup-storages',
    executeExpression = 'execute-expression',
    executeAsyncExpression = 'execute-async-expression',
    unlockPage = 'unlock-page',
    recorder = 'recorder'
};

export enum TestPhase {
    initial = 'initial',
    inFixtureBeforeHook = 'inFixtureBeforeHook',
    inFixtureBeforeEachHook = 'inFixtureBeforeEachHook',
    inTestBeforeHook = 'inTestBeforeHook',
    inTest = 'inTest',
    inTestAfterHook = 'inTestAfterHook',
    inFixtureAfterEachHook = 'inFixtureAfterEachHook',
    inFixtureAfterHook = 'inFixtureAfterHook',
    inRoleInitializer = 'inRoleInitializer',
    inBookmarkRestore = 'inBookmarkRestore'
};

export type Error = {
    apiFnChain?: string[];
    apiFnIndex?: number;
    callsite: {
        filename: string;
        lineNum: number;
        callsiteFrameIdx: number;
        stackFrames: any[];
        isV8Frames: boolean;
    };
    code: string;
    errMsg: string;
    isTestCafeError: boolean;
    screenshotPath: string;
    testRunId: string;
    testRunPhase: string;
    userAgent: string;
};

export type BrowserInfo = {
    alias: string;
    engine: { name: string; version: string };
    headless: boolean;
    name: string;
    os: { name: string; version: string };
    platform: string;
    prettyUserAgent: string;
    userAgent: string;
    version: string;
}

type TestStartInfo = {
    testRunIds: string[];
    testId: string;
}

export type TestCafeActionInfo = {
    browser: BrowserInfo;
    command: Record<string, any> & { type: CommandType };
    duration?: number;
    err?: Error;
    test: {
        name: string;
        phase: TestPhase;
    };
    testRunId: string;
};

type Meta = Record<string, string>;

export type Quarantine = {
    [key: number]: {
        passed: boolean;
    };
}

export type Screenshot = {
    testRunId: string;
    screenshotPath: string;
    thumbnailPath: string;
    userAgent: string;
    quarantineAttempt: number;
    takenOnFail: boolean;
}

export type Video = {
    userAgent: string;
    quarantineAttempt: number;
    videoPath: string;
    testRunId: string;
}

export type TestRunInfo = {
    browsers: (BrowserInfo & { testRunId: string })[];
    durationMs: number;
    errs: Error[];
    quarantine: Quarantine;
    screenshotPath: string;
    screenshots: Screenshot[];
    skipped: boolean;
    testId: string;
    unstable: boolean;
    videos: Video[];
    warnings: string[];
}


export type DashboardBrowserRunInfo = {
    browser: BrowserInfo;
    actions: {
        apiName: string;
        testPhase: TestPhase;
        command: Record<string, any> & { type: CommandType };
        errors: Error[];
    }[];
}


export type TestResult = {
    failedCount: number;
    passedCount: number;
    skippedCount: number;
}

export type decoratorFn = (str: string) => string;

interface ReportedTestItem {
    id: string;
    name: string;
    skip: boolean;
}

interface ReportedFixtureItem {
    id: string;
    name: string;
    tests: ReportedTestItem[];
}

export interface ReportedTestStructureItem {
    fixture: ReportedFixtureItem;
}

export type ReporterMethods = {
    reportTaskStart: (startTime: Date, userAgents: string[], testCount: number, taskStructure: ReportedTestStructureItem[]) => Promise<void>;
    reportFixtureStart: (name: string, path: string, meta: Meta) => Promise<void>;
    reportTestStart?: (name: string, meta: Meta, testStartInfo: TestStartInfo) => Promise<void>;
    reportTestActionStart?: (apiActionName: string, actionInfo: TestCafeActionInfo) => Promise<void>;
    reportTestActionDone?: (apiActionName: string, actionInfo: TestCafeActionInfo) => Promise<void>;
    reportTestDone: (name: string, testRunInfo: TestRunInfo, meta?: Meta) => Promise<void>;
    reportTaskDone: (endTime: Date, passed: number, warnings: string[], result: TestResult) => Promise<void>;
};

export type ReporterPluginObject = ReporterMethods & {
    createErrorDecorator: () => Record<string, decoratorFn>;
};
