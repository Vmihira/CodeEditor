import React, { useState } from 'react';
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackConsole,
  useActiveCode,
  SandpackThemeProvider,
  useSandpack,
  SandpackStack,
  FileTabs,
  SandpackFileExplorer,
} from '@codesandbox/sandpack-react';
import { monokaiPro } from '@codesandbox/sandpack-themes';
import { Terminal, Code2, Eye, Terminal as Terminal2, FolderPlus, Trash2, Files, RefreshCw, Loader, Layout, Maximize2, Minimize2 } from 'lucide-react';

const CustomFileExplorer = () => {
  const { sandpack } = useSandpack();
  const [newFileName, setNewFileName] = useState('');
  const [showNewFileInput, setShowNewFileInput] = useState(false);

  const createFile = () => {
    if (newFileName) {
      const fileName = newFileName.startsWith('/') ? newFileName : `/${newFileName}`;
      sandpack.addFile(fileName, '// Write your code here');
      setNewFileName('');
      setShowNewFileInput(false);
    }
  };

  const deleteFile = (fileName: string) => {
    if (fileName !== '/App.js') {
      sandpack.deleteFile(fileName);
    }
  };

  return (
    <div className="bg-gray-900 p-4 rounded-lg h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Files className="w-4 h-4 text-gray-400" />
          <span className="text-gray-200 font-medium">Files</span>
        </div>
        <button
          className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors"
          onClick={() => setShowNewFileInput(true)}
        >
          <FolderPlus className="w-4 h-4" />
          <span className="text-sm">New File</span>
        </button>
      </div>

      {showNewFileInput && (
        <div className="mb-4 flex space-x-2">
          <input
            type="text"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            placeholder="filename.js"
            className="flex-1 bg-gray-800 text-white px-2 py-1 rounded text-sm border border-gray-700 focus:border-blue-500 focus:outline-none"
            onKeyPress={(e) => e.key === 'Enter' && createFile()}
          />
          <button
            onClick={createFile}
            className="px-2 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
          >
            Create
          </button>
        </div>
      )}

      <div className="flex-1 overflow-auto custom-file-explorer">
        <SandpackFileExplorer />
      </div>
    </div>
  );
};

const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const [hasError, setHasError] = useState(false);
  const { sandpack } = useSandpack();

  const handleReset = () => {
    setHasError(false);
    sandpack.resetAllFiles();
  };

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-red-900/20 rounded-lg p-8">
        <h2 className="text-xl font-bold text-red-400 mb-4">Something went wrong</h2>
        <p className="text-gray-300 mb-4 text-center">
          There was an error connecting to the Sandpack runtime. This might be due to network issues or a timeout.
        </p>
        <button
          onClick={handleReset}
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reset & Try Again</span>
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

const LoadingOverlay = () => (
  <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center">
    <div className="flex items-center space-x-3">
      <Loader className="w-6 h-6 text-blue-400 animate-spin" />
      <span className="text-white font-medium">Loading Sandbox...</span>
    </div>
  </div>
);

const CustomEditor = () => {
  const { code, updateCode } = useActiveCode();
  const [showConsole, setShowConsole] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [layout, setLayout] = useState<'horizontal' | 'vertical'>('horizontal');

  const toggleLayout = () => {
    setLayout(prev => prev === 'horizontal' ? 'vertical' : 'horizontal');
  };

  return (
    <div className={`h-screen flex flex-col ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <div className="bg-gray-900 text-white p-4 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <Code2 className="w-6 h-6 text-blue-400" />
          <h1 className="text-xl font-bold">React Editor</h1>
        </div>
        <div className="flex space-x-4">
          <button
            className="flex items-center space-x-2 px-3 py-1.5 rounded-md bg-gray-800 hover:bg-gray-700 transition-colors"
            onClick={toggleLayout}
          >
            <Layout className="w-4 h-4" />
            <span>Toggle Layout</span>
          </button>
          <button
            className="flex items-center space-x-2 px-3 py-1.5 rounded-md bg-gray-800 hover:bg-gray-700 transition-colors"
            onClick={() => setShowConsole(!showConsole)}
          >
            <Terminal2 className="w-4 h-4" />
            <span>Toggle Console</span>
          </button>
          <button
            className="flex items-center space-x-2 px-3 py-1.5 rounded-md bg-gray-800 hover:bg-gray-700 transition-colors"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
          </button>
        </div>
      </div>

      <div className={`flex-1 grid gap-4 p-4 bg-gray-800 ${
        layout === 'horizontal' 
          ? 'grid-cols-[250px_1fr_1fr]' 
          : 'grid-cols-[250px_1fr] grid-rows-[1fr_1fr]'
      }`}>
        <CustomFileExplorer />

        <div className={`flex flex-col bg-gray-900 rounded-lg overflow-hidden ${
          layout === 'vertical' ? 'col-start-2 row-span-2' : ''
        }`}>
          <div className="bg-gray-800 p-2 flex items-center space-x-2 border-b border-gray-700">
            <Code2 className="w-4 h-4 text-gray-400" />
            <span className="text-gray-200">Editor</span>
          </div>
          <div className="flex-1 relative">
            <ErrorBoundary>
              <SandpackCodeEditor
                showTabs
                showLineNumbers
                showInlineErrors
                wrapContent
                closableTabs
                style={{ height: '100%' }}
              />
            </ErrorBoundary>
          </div>
        </div>

        <div className={`flex flex-col bg-gray-900 rounded-lg overflow-hidden ${
          layout === 'vertical' ? 'col-start-3 row-span-2' : ''
        }`}>
          <div className="bg-gray-800 p-2 flex items-center space-x-2 border-b border-gray-700">
            <Eye className="w-4 h-4 text-gray-400" />
            <span className="text-gray-200">Preview</span>
          </div>
          <div className="flex-1 relative">
            <ErrorBoundary>
              <SandpackPreview
                showNavigator
                showRefreshButton
                style={{ height: '100%' }}
              />
            </ErrorBoundary>
          </div>
        </div>
      </div>

      {showConsole && (
        <div className="h-64 bg-gray-900 border-t border-gray-700">
          <div className="bg-gray-800 p-2 flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-gray-400" />
            <span className="text-gray-200">Console</span>
          </div>
          <div className="h-[calc(100%-2.5rem)] overflow-auto">
            <SandpackConsole className="h-full" />
          </div>
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <SandpackThemeProvider theme={monokaiPro}>
      <SandpackProvider
        template="react"
        customSetup={{
          dependencies: {
            "react": "^18.0.0",
            "react-dom": "^18.0.0",
            "@types/react": "^18.0.0",
            "@types/react-dom": "^18.0.0"
          },
          environment: "create-react-app"
        }}
        files={{
          "/App.js": `import React, { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ 
      padding: 20,
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1 style={{ 
        fontSize: '2rem',
        marginBottom: '1rem',
        color: '#1a1a1a'
      }}>
        Hello Sandpack!
      </h1>
      <button 
        onClick={() => setCount(c => c + 1)}
        style={{
          padding: '8px 16px',
          background: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '1rem',
          transition: 'background-color 0.2s',
        }}
        onMouseOver={(e) => e.currentTarget.style.background = '#45a049'}
        onMouseOut={(e) => e.currentTarget.style.background = '#4CAF50'}
      >
        Count: {count}
      </button>
    </div>
  );
}`
        }}
        options={{
          timeoutDelay: 30000,
          showLoadingScreen: true,
          loadingScreen: LoadingOverlay,
          recompileMode: "delayed",
          recompileDelay: 500,
          classes: {
            'sp-wrapper': 'custom-wrapper',
            'sp-layout': 'custom-layout',
            'sp-tab-button': 'custom-tab'
          }
        }}
      >
        <SandpackLayout>
          <CustomEditor />
        </SandpackLayout>
      </SandpackProvider>
    </SandpackThemeProvider>
  );
}

export default App;