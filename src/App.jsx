import { useState, useEffect } from 'react'
import { Moon, Sun, Sparkles, TreePine, GitCompare } from 'lucide-react'
import { Button } from "./components/ui/button"
import BeautifyPanel from './components/BeautifyPanel'
import TreeViewPanel from './components/TreeViewPanel'
import ComparePanel from './components/ComparePanel'

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [activeTab, setActiveTab] = useState('beautify')

  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-mode', 'dark')
    } else {
      document.documentElement.removeAttribute('data-mode')
    }
  }, [darkMode])

  const tabs = [
    { id: 'beautify', label: 'Beautify', icon: Sparkles },
    { id: 'tree', label: 'Tree View', icon: TreePine },
    { id: 'compare', label: 'Compare', icon: GitCompare }
  ]

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <nav className="bg-transparent border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                JSON Studio
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`nav-tab ${
                        activeTab === tab.id ? 'nav-tab-active' : 'nav-tab-inactive'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="btn-secondary ml-4"
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div className="container mx-auto px-6 py-8">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 shadow-sm">
          {activeTab === 'beautify' && <BeautifyPanel darkMode={darkMode} />}
          {activeTab === 'tree' && <TreeViewPanel darkMode={darkMode} />}
          {activeTab === 'compare' && <ComparePanel darkMode={darkMode} />}
        </div>
      </div>
    </div>
  )
}

export default App
