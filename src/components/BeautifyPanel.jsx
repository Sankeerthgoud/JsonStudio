import { useState, useEffect } from 'react'
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Play, Copy, Download, Sparkles, Minimize2, ChevronRight, ChevronDown } from 'lucide-react'

// Collapsible JSON Node Component
function CollapsibleJsonNode({ data, level = 0, path = '', onToggle, collapsedPaths }) {
  const isCollapsed = collapsedPaths.has(path)

  if (data === null) {
    return <span className="text-gray-500 dark:text-gray-400">null</span>
  }

  if (typeof data === 'boolean') {
    return <span className="text-purple-600 dark:text-purple-400">{data.toString()}</span>
  }

  if (typeof data === 'number') {
    return <span className="text-blue-600 dark:text-blue-400">{data}</span>
  }

  if (typeof data === 'string') {
    return <span className="text-green-600 dark:text-green-400">"{data}"</span>
  }

  if (Array.isArray(data)) {
    const canCollapse = data.length > 0
    return (
      <div className="ml-4">
        {canCollapse && (
          <span
            onClick={() => onToggle(path)}
            className="cursor-pointer inline-flex items-center mr-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </span>
        )}
        <span className="text-gray-700 dark:text-gray-300">[</span>
        {!isCollapsed && (
          <div className="ml-4">
            {data.map((item, index) => (
              <div key={index} className="py-1">
                <CollapsibleJsonNode
                  data={item}
                  level={level + 1}
                  path={`${path}[${index}]`}
                  onToggle={onToggle}
                  collapsedPaths={collapsedPaths}
                />
                {index < data.length - 1 && <span className="text-gray-500 dark:text-gray-400">,</span>}
              </div>
            ))}
          </div>
        )}
        {canCollapse && isCollapsed && (
          <span className="text-gray-500 dark:text-gray-400"> ... </span>
        )}
        <span className="text-gray-700 dark:text-gray-300">]</span>
      </div>
    )
  }

  if (typeof data === 'object') {
    const keys = Object.keys(data)
    const canCollapse = keys.length > 0
    return (
      <div className="ml-4">
        {canCollapse && (
          <span
            onClick={() => onToggle(path)}
            className="cursor-pointer inline-flex items-center mr-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </span>
        )}
        <span className="text-gray-700 dark:text-gray-300">{"{"}</span>
        {!isCollapsed && (
          <div className="ml-4">
            {keys.map((key, index) => (
              <div key={key} className="py-1">
                <span className="text-blue-600 dark:text-blue-400">"{key}"</span>
                <span className="text-gray-500 dark:text-gray-400">: </span>
                <CollapsibleJsonNode
                  data={data[key]}
                  level={level + 1}
                  path={`${path}.${key}`}
                  onToggle={onToggle}
                  collapsedPaths={collapsedPaths}
                />
                {index < keys.length - 1 && <span className="text-gray-500 dark:text-gray-400">,</span>}
              </div>
            ))}
          </div>
        )}
        {canCollapse && isCollapsed && (
          <span className="text-gray-500 dark:text-gray-400"> ... </span>
        )}
        <span className="text-gray-700 dark:text-gray-300">{"}"}</span>
      </div>
    )
  }

  return <span className="text-gray-500 dark:text-gray-400">undefined</span>
}

// Collapsible JSON Viewer Component
function CollapsibleJsonViewer({ jsonString, darkMode }) {
  const [collapsedPaths, setCollapsedPaths] = useState(new Set())
  const [parsedData, setParsedData] = useState(null)

  useEffect(() => {
    try {
      const parsed = JSON.parse(jsonString)
      setParsedData(parsed)
    } catch (e) {
      setParsedData(null)
    }
  }, [jsonString])

  const handleToggle = (path) => {
    setCollapsedPaths(prev => {
      const newSet = new Set(prev)
      if (newSet.has(path)) {
        newSet.delete(path)
      } else {
        newSet.add(path)
      }
      return newSet
    })
  }

  if (!parsedData) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-base font-medium">Your formatted JSON will appear here</p>
          <p className="text-sm mt-2 opacity-75">Click "Format JSON" to get started</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 pl-20 overflow-auto h-full font-mono text-sm">
      <CollapsibleJsonNode
        data={parsedData}
        onToggle={handleToggle}
        collapsedPaths={collapsedPaths}
      />
    </div>
  )
}

function BeautifyPanel({ darkMode }) {
  const [input, setInput] = useState(() => {
    return localStorage.getItem('jsonStudio-beautify-input') || ''
  })
  const [beautified, setBeautified] = useState(() => {
    return localStorage.getItem('jsonStudio-beautify-output') || ''
  })
  const [isMinified, setIsMinified] = useState(() => {
    return localStorage.getItem('jsonStudio-beautify-minified') === 'true'
  })
  const [inputLines, setInputLines] = useState(1)
  const [outputLines, setOutputLines] = useState(1)

  const updateLineNumbers = (text, setLines) => {
    const lines = text.split('\n').length
    setLines(Math.max(lines, 1))
  }

  useEffect(() => {
    updateLineNumbers(input, setInputLines)
  }, [input])

  useEffect(() => {
    updateLineNumbers(beautified, setOutputLines)
  }, [beautified])

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('jsonStudio-beautify-input', input)
  }, [input])

  useEffect(() => {
    localStorage.setItem('jsonStudio-beautify-output', beautified)
  }, [beautified])

  useEffect(() => {
    localStorage.setItem('jsonStudio-beautify-minified', isMinified.toString())
  }, [isMinified])

  const beautify = () => {
    try {
      // Try to parse input first, if that fails, try to parse the current output
      let parsed
      try {
        parsed = JSON.parse(input)
      } catch {
        parsed = JSON.parse(beautified)
      }
      setBeautified(JSON.stringify(parsed, null, 2))
    } catch (e) {
      setBeautified('Invalid JSON')
    }
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'b') {
        e.preventDefault()
        beautify()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [input])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(beautified)
  }

  const toggleMinify = () => {
    try {
      let parsed
      try {
        parsed = JSON.parse(input)
      } catch {
        parsed = JSON.parse(beautified)
      }

      if (isMinified) {
        // Currently minified, so beautify it
        setBeautified(JSON.stringify(parsed, null, 2))
        setIsMinified(false)
      } else {
        // Currently beautified, so minify it
        setBeautified(JSON.stringify(parsed))
        setIsMinified(true)
      }
    } catch (e) {
      setBeautified('Invalid JSON')
    }
  }

  const download = () => {
    const blob = new Blob([beautified], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'beautified.json'
    a.click()
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Input JSON</h3>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={beautify}
                className="btn-primary"
              >
                Format JSON
              </button>
              <button
                onClick={toggleMinify}
                className={`btn-secondary ${isMinified ? 'bg-orange-100 dark:bg-orange-900 border-orange-300 dark:border-orange-600' : ''}`}
                title={isMinified ? "Expand JSON" : "Minify JSON"}
              >
                <Minimize2 className={`w-4 h-4 ${isMinified ? 'text-orange-600 dark:text-orange-400' : ''}`} />
              </button>
            </div>
          </div>
          <div className="code-editor h-96">
            <div className="line-numbers">
              {Array.from({ length: inputLines }, (_, i) => (
                <div key={i + 1}>{i + 1}</div>
              ))}
            </div>
            <textarea
              placeholder="Paste your JSON here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Output Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Formatted Output</h3>
            </div>
            {beautified && (
              <div className="flex space-x-2">
                <button
                  onClick={copyToClipboard}
                  className="btn-secondary"
                  title="Copy to clipboard"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={download}
                  className="btn-secondary"
                  title="Download JSON"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          <div className="code-editor h-96">
            <div className="line-numbers">
              {Array.from({ length: outputLines }, (_, i) => (
                <div key={i + 1}>{i + 1}</div>
              ))}
            </div>
            {beautified ? (
              <SyntaxHighlighter
                language="json"
                style={darkMode ? oneDark : oneLight}
                className="!bg-transparent !p-0 !m-0 !text-sm"
                customStyle={{
                  background: 'transparent',
                  fontSize: '13px',
                  lineHeight: '1.6',
                  padding: '20px',
                  paddingLeft: '70px'
                }}
              >
                {beautified}
              </SyntaxHighlighter>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-base font-medium">Your formatted JSON will appear here</p>
                  <p className="text-sm mt-2 opacity-75">Click "Format JSON" to get started</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BeautifyPanel
