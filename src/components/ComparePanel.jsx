import { useState, useEffect } from 'react'
import { Textarea } from "./ui/textarea"
import { GitCompare, ArrowLeft, ArrowRight } from 'lucide-react'

function ComparePanel({ darkMode }) {
  const [left, setLeft] = useState(() => {
    return localStorage.getItem('jsonStudio-compare-left') || ''
  })
  const [right, setRight] = useState(() => {
    return localStorage.getItem('jsonStudio-compare-right') || ''
  })
  const [leftLines, setLeftLines] = useState(1)
  const [rightLines, setRightLines] = useState(1)
  const [differences, setDifferences] = useState({})

  const updateLineNumbers = (text, setLines) => {
    const lines = text.split('\n').length
    setLines(Math.max(lines, 1))
  }

  useEffect(() => {
    updateLineNumbers(left, setLeftLines)
  }, [left])

  useEffect(() => {
    updateLineNumbers(right, setRightLines)
  }, [right])

  // Simple difference highlighting (you can enhance this with more sophisticated diff logic)
  useEffect(() => {
    if (left && right) {
      const leftLines = left.split('\n')
      const rightLines = right.split('\n')
      const diff = {}

      leftLines.forEach((line, index) => {
        if (!rightLines[index]) {
          diff[index] = 'removed'
        } else if (line !== rightLines[index]) {
          diff[index] = 'modified'
        }
      })

      rightLines.forEach((line, index) => {
        if (!leftLines[index]) {
          diff[index] = 'added'
        }
      })

      setDifferences(diff)
    }
  }, [left, right])

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('jsonStudio-compare-left', left)
  }, [left])

  useEffect(() => {
    localStorage.setItem('jsonStudio-compare-right', right)
  }, [right])

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-8">
        {/* Left Input Section */}
        <div className="component-spacing">
          <div className="flex items-center space-x-3 element-spacing">
            <div className="icon-container">
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Left JSON</h3>
          </div>
          <div className="code-editor h-80">
            <div className="line-numbers">
              {Array.from({ length: leftLines }, (_, i) => (
                <div key={i + 1} className={differences[i] ? `diff-${differences[i]}` : ''}>
                  {i + 1}
                </div>
              ))}
            </div>
            <textarea
              placeholder="Paste your first JSON here..."
              value={left}
              onChange={(e) => setLeft(e.target.value)}
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Right Input Section */}
        <div className="component-spacing">
          <div className="flex items-center space-x-3 element-spacing">
            <div className="icon-container">
              <ArrowRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Right JSON</h3>
          </div>
          <div className="code-editor h-80">
            <div className="line-numbers">
              {Array.from({ length: rightLines }, (_, i) => (
                <div key={i + 1} className={differences[i] ? `diff-${differences[i]}` : ''}>
                  {i + 1}
                </div>
              ))}
            </div>
            <textarea
              placeholder="Paste your second JSON here..."
              value={right}
              onChange={(e) => setRight(e.target.value)}
              className="w-full h-full"
            />
          </div>
        </div>
      </div>

      {/* Comparison Section */}
      <div className="component-spacing">
        <div className="flex items-center justify-center element-spacing">
          <div className="flex items-center space-x-3">
            <div className="icon-container">
              <GitCompare className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Comparison</h3>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div className="component-spacing">
            <div className="flex items-center space-x-3 element-spacing">
              <div className="icon-container">
                <ArrowLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">Left</h4>
            </div>
            <div className="code-editor h-80">
              <div className="line-numbers">
                {Array.from({ length: leftLines }, (_, i) => (
                  <div key={i + 1} className={differences[i] ? `diff-${differences[i]}` : ''}>
                    {i + 1}
                  </div>
                ))}
              </div>
              <pre className="text-sm font-mono text-gray-700 dark:text-gray-300 whitespace-pre-wrap p-4">
                {left.split('\n').map((line, index) => (
                  <div key={index} className={differences[index] ? `diff-${differences[index]}` : ''}>
                    {line || '\u00A0'}
                  </div>
                ))}
              </pre>
            </div>
          </div>
          <div className="component-spacing">
            <div className="flex items-center space-x-3 element-spacing">
              <div className="icon-container">
                <ArrowRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">Right</h4>
            </div>
            <div className="code-editor h-80">
              <div className="line-numbers">
                {Array.from({ length: rightLines }, (_, i) => (
                  <div key={i + 1} className={differences[i] ? `diff-${differences[i]}` : ''}>
                    {i + 1}
                  </div>
                ))}
              </div>
              <pre className="text-sm font-mono text-gray-700 dark:text-gray-300 whitespace-pre-wrap p-4">
                {right.split('\n').map((line, index) => (
                  <div key={index} className={differences[index] ? `diff-${differences[index]}` : ''}>
                    {line || '\u00A0'}
                  </div>
                ))}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComparePanel
