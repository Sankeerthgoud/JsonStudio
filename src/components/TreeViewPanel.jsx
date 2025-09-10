import { useState, useEffect } from 'react'
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { TreePine, ChevronDown, ChevronRight, Play, Minimize2, Maximize2 } from 'lucide-react'

function TreeNode({ data, level = 0, expandedAll }) {
  const [expanded, setExpanded] = useState(expandedAll || level < 2)

  const toggle = () => {
    setExpanded(!expanded)
  }

  if (typeof data !== 'object' || data === null) {
    return (
      <div className={`tree-indent py-1 text-sm font-mono ${
        typeof data === 'string' ? 'text-green-600 dark:text-green-400' :
        typeof data === 'number' ? 'text-blue-600 dark:text-blue-400' :
        typeof data === 'boolean' ? 'text-purple-600 dark:text-purple-400' :
        'text-gray-600 dark:text-gray-400'
      }`}>
        {JSON.stringify(data)}
      </div>
    )
  }

  const isArray = Array.isArray(data)

  return (
    <div className="tree-indent">
      <div
        onClick={toggle}
        className="tree-node flex items-center space-x-2 py-1 px-2 rounded cursor-pointer"
      >
        {expanded ? (
          <ChevronDown className="w-3 h-3 text-gray-500 flex-shrink-0" />
        ) : (
          <ChevronRight className="w-3 h-3 text-gray-500 flex-shrink-0" />
        )}
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {isArray ? `Array [${data.length}]` : `Object {${Object.keys(data).length}}`}
        </span>
      </div>
      {expanded && (
        <div className="ml-4">
          {Object.entries(data).map(([key, value], index) => (
            <div key={key} className="py-1">
              <div className="flex items-start space-x-2">
                <span className="text-gray-500 dark:text-gray-400 text-xs font-mono mt-1 flex-shrink-0">
                  {isArray ? `[${index}]` : `"${key}"`}:
                </span>
                <TreeNode data={value} level={level + 1} expandedAll={expandedAll} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function TreeViewPanel() {
  const [input, setInput] = useState(() => {
    return localStorage.getItem('jsonStudio-tree-input') || ''
  })
  const [parsed, setParsed] = useState(() => {
    const saved = localStorage.getItem('jsonStudio-tree-parsed')
    return saved ? JSON.parse(saved) : null
  })
  const [expandedAll, setExpandedAll] = useState(() => {
    return localStorage.getItem('jsonStudio-tree-expanded') === 'true'
  })

  const parse = () => {
    try {
      const data = JSON.parse(input)
      setParsed(data)
    } catch (e) {
      setParsed(null)
    }
  }

  const toggleAll = () => {
    setExpandedAll(!expandedAll)
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey) {
        if (e.key === 'e') {
          e.preventDefault()
          setExpandedAll(true)
        } else if (e.key === 'c') {
          e.preventDefault()
          setExpandedAll(false)
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('jsonStudio-tree-input', input)
  }, [input])

  useEffect(() => {
    if (parsed) {
      localStorage.setItem('jsonStudio-tree-parsed', JSON.stringify(parsed))
    } else {
      localStorage.removeItem('jsonStudio-tree-parsed')
    }
  }, [parsed])

  useEffect(() => {
    localStorage.setItem('jsonStudio-tree-expanded', expandedAll.toString())
  }, [expandedAll])

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-16 p-4">
        {/* Input Section */}
        <div className="component-spacing">
          <div className="flex items-center justify-between element-spacing">
            <div className="flex items-center space-x-3">
              <div className="icon-container">
                <TreePine className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Input JSON</h3>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={parse}
                className="btn-primary"
              >
                Parse JSON
              </button>
              <button
                onClick={toggleAll}
                className="btn-secondary"
                title={expandedAll ? "Collapse all" : "Expand all"}
              >
                {expandedAll ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="code-editor h-96">
            <div className="line-numbers">
              {Array.from({ length: Math.max(1, input.split('\n').length) }, (_, i) => (
                <div key={i + 1}>{i + 1}</div>
              ))}
            </div>
            <textarea
              placeholder="Paste your JSON here to visualize as a tree..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Output Section */}
        <div className="component-spacing">
          <div className="flex items-center space-x-3 element-spacing">
            <div className="icon-container">
              <TreePine className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Tree Structure</h3>
          </div>
          <div className="code-editor h-96">
            <div className="p-4 pl-8 overflow-auto h-full">
              {parsed ? (
                <TreeNode data={parsed} expandedAll={expandedAll} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  <div className="text-center">
                    <TreePine className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-base font-medium">Your tree structure will appear here</p>
                    <p className="text-sm mt-2 opacity-75">Click "Parse JSON" to visualize</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TreeViewPanel
