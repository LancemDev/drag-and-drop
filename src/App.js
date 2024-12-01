'use client'

import React, { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import confetti from 'canvas-confetti'
import { Wand2, Palette, Puzzle, Sparkles, Layout, Type, Image, Video, Cloud, Star, Rocket, Globe, Leaf, Trash2, Eye, Code, Save } from 'lucide-react'

// Playful themed elements with enhanced visual styles
const ELEMENT_THEMES = [
  { name: 'Cosmic', colors: 'bg-purple-100 border-purple-300 text-purple-800', icon: Rocket },
  { name: 'Organic', colors: 'bg-green-100 border-green-300 text-green-800', icon: Leaf },
  { name: 'Digital', colors: 'bg-blue-100 border-blue-300 text-blue-800', icon: Globe },
  { name: 'Retro', colors: 'bg-yellow-100 border-yellow-300 text-yellow-800', icon: Star }
]

// Enhanced Draggable Component Library with more interactive elements
const COMPONENTS = [
  { 
    type: 'TextBlock', 
    name: 'Magic Text', 
    icon: Type,
    defaultContent: '✨ Enchanted Words',
    render: (content, theme) => `
      <div class="magical-text ${theme.colors} p-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300">
        <h2 class="text-2xl font-bold mb-2">${content}</h2>
        <p class="text-sm opacity-75">Click to edit this magical text!</p>
      </div>
    `
  },
  { 
    type: 'ImageCanvas', 
    name: 'Dimensional Image', 
    icon: Image,
    defaultContent: 'https://picsum.photos/400/300',
    render: (content, theme) => `
      <div class="image-container ${theme.colors} p-3 rounded-xl shadow-2xl overflow-hidden">
        <img src="${content}" class="w-full h-auto transform transition-all duration-500 hover:scale-110 hover:rotate-3" alt="Dynamic Image"/>
        <div class="mt-2 text-center text-sm font-semibold">Interactive Image</div>
      </div>
    `
  },
  { 
    type: 'InteractiveSection', 
    name: 'Animated Section', 
    icon: Puzzle,
    defaultContent: 'Interactive Magic',
    render: (content, theme) => `
      <section class="interactive-zone ${theme.colors} p-6 rounded-2xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl">
        <h3 class="text-xl font-bold mb-2">${content}</h3>
        <p class="text-sm mb-4">Click the buttons to see the magic!</p>
        <div class="flex justify-center space-x-4">
          <button class="animate-button px-4 py-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition-colors duration-200">Animate</button>
          <button class="color-button px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors duration-200">Change Color</button>
        </div>
      </section>
    `
  },
  { 
    type: 'VideoEmbed', 
    name: 'Cosmic Video', 
    icon: Video,
    defaultContent: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    render: (content, theme) => `
      <div class="video-wrapper ${theme.colors} p-3 rounded-2xl shadow-lg overflow-hidden">
        <iframe src="${content}" class="w-full aspect-video rounded-lg" allowfullscreen></iframe>
        <div class="mt-2 text-center text-sm font-semibold">Embedded Cosmic Video</div>
      </div>
    `
  }
]

const DraggableComponent = ({ component, onDrop }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'component',
    item: { type: component.type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  return (
    <div
      ref={drag}
      className={`flex items-center p-3 bg-white rounded-lg cursor-move shadow-md hover:shadow-lg transition-all duration-200 ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <component.icon className="mr-3 text-indigo-600" />
      <span className="font-medium">{component.name}</span>
    </div>
  )
}

const DroppableCanvas = ({ onDrop, children }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'component',
    drop: (item, monitor) => onDrop(item.type),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }))

  return (
    <div
      ref={drop}
      className={`min-h-[300px] p-4 rounded-lg ${
        isOver ? 'bg-indigo-100 border-2 border-dashed border-indigo-500' : 'bg-gray-100'
      }`}
    >
      {children}
    </div>
  )
}

const InteractivePreview = ({ content, theme, componentType }) => {
  const controls = useAnimation()
  const [bgColor, setBgColor] = useState(theme.colors)

  const handleAnimate = () => {
    controls.start({
      scale: [1, 1.1, 1],
      rotate: [0, 10, -10, 0],
      transition: { duration: 0.5 }
    })
  }

  const handleColorChange = () => {
    const colors = ['bg-purple-100', 'bg-green-100', 'bg-blue-100', 'bg-yellow-100']
    const newColor = colors[Math.floor(Math.random() * colors.length)]
    setBgColor(newColor)
  }

  if (componentType === 'InteractiveSection') {
    return (
      <motion.div 
        animate={controls}
        className={`${bgColor} p-6 rounded-2xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl`}
      >
        <h3 className="text-xl font-bold mb-2">{content}</h3>
        <p className="text-sm mb-4">Click the buttons to see the magic!</p>
        <div className="flex justify-center space-x-4">
          <button 
            onClick={handleAnimate}
            className="px-4 py-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition-colors duration-200"
          >
            Animate
          </button>
          <button 
            onClick={handleColorChange}
            className="px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors duration-200"
          >
            Change Color
          </button>
        </div>
      </motion.div>
    )
  }

  return <div dangerouslySetInnerHTML={{ __html: COMPONENTS.find(c => c.type === componentType).render(content, theme) }} />
}

const WebBuilderPlayground = () => {
  const [elements, setElements] = useState([])
  const [currentTheme, setCurrentTheme] = useState(ELEMENT_THEMES[0])
  const [isAIAssistMode, setIsAIAssistMode] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const confettiCanvasRef = useRef(null)

  const addElement = useCallback((componentType) => {
    const component = COMPONENTS.find(c => c.type === componentType)
    if (component) {
      const newElement = {
        id: `element-${Date.now()}`,
        type: component.type,
        content: component.defaultContent,
        theme: currentTheme
      }
      setElements(prev => [...prev, newElement])
      
      // Trigger confetti effect
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    }
  }, [currentTheme])

  const updateElement = useCallback((id, newContent) => {
    setElements(prev => 
      prev.map(el => el.id === id ? {...el, content: newContent} : el)
    )
  }, [])

  const removeElement = useCallback((id) => {
    setElements(prev => prev.filter(el => el.id !== id))
  }, [])

  const generateHTML = () => {
    return elements.map(el => {
      const component = COMPONENTS.find(c => c.type === el.type)
      return component ? component.render(el.content, el.theme) : ''
    }).join('\n')
  }

  const AIAssistOverlay = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-purple-500 bg-opacity-90 z-50 flex items-center justify-center"
    >
      <motion.div 
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md"
      >
        <Sparkles className="mx-auto text-purple-600 mb-4" size={64} />
        <h2 className="text-3xl font-bold mb-4">AI Web Builder</h2>
        <p className="mb-6 text-gray-600">Our AI is brewing up some magical web designs just for you! Stay tuned for an enchanting experience.</p>
        <button 
          onClick={() => setIsAIAssistMode(false)}
          className="bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition-colors duration-200 transform hover:scale-105"
        >
          Back to Building
        </button>
      </motion.div>
    </motion.div>
  )

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        <AnimatePresence>
          {isAIAssistMode && <AIAssistOverlay />}
        </AnimatePresence>
        
        {/* Enhanced Sidebar: Component Palette */}
        <motion.div 
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          className="w-80 bg-white border-r p-6 overflow-y-auto shadow-lg"
        >
          <div className="flex items-center mb-6">
            <Palette className="mr-3 text-indigo-600" size={24} />
            <h2 className="text-2xl font-bold text-gray-800">Magic Palette</h2>
          </div>
          
          {/* Theme Selector */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3 text-gray-700">Enchanted Themes</h3>
            <div className="flex space-x-3">
              {ELEMENT_THEMES.map((theme) => (
                <motion.button 
                  key={theme.name}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentTheme(theme)}
                  className={`p-3 rounded-lg ${theme.colors} ${currentTheme.name === theme.name ? 'ring-2 ring-offset-2 ring-indigo-500' : ''}`}
                >
                  <theme.icon size={24} />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Draggable Components */}
          <div className="space-y-3">
            {COMPONENTS.map((component) => (
              <DraggableComponent key={component.type} component={component} onDrop={addElement} />
            ))}
          </div>

          {/* AI Assist Button */}
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAIAssistMode(true)}
            className="mt-6 w-full flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200"
          >
            <Wand2 className="mr-2" /> AI Web Wizard
          </motion.button>
        </motion.div>

        {/* Canvas */}
        <div className="flex-grow p-6 overflow-y-auto">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Magical Canvas</h2>
            <div className="space-x-2">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                {previewMode ? <Code size={20} /> : <Eye size={20} />}
              </button>
              <button
                onClick={() => {/* Implement save functionality */}}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                <Save size={20} />
              </button>
            </div>
          </div>
          <DroppableCanvas onDrop={addElement}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {elements.map((el) => (
                <motion.div 
                  key={el.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className={`relative p-3 ${el.theme.colors} rounded-lg shadow-md`}
                >
                  {!previewMode && (
                    <>
                      <input 
                        value={el.content}
                        onChange={(e) => updateElement(el.id, e.target.value)}
                        className="w-full p-2 rounded mb-2 border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <button 
                        onClick={() => removeElement(el.id)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors duration-200"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                  {previewMode && (
                    <InteractivePreview content={el.content} theme={el.theme} componentType={el.type} />
                  )}
                </motion.div>
              ))}
            </div>
          </DroppableCanvas>
        </div>

        {/* Code Output */}
        <motion.div 
          initial={{ x: 300 }}
          animate={{ x: 0 }}
          className="w-96 bg-gray-900 text-green-400 p-6 overflow-y-auto"
        >
          <h3 className="text-xl font-bold mb-4 text-white">Enchanted HTML</h3>
          <pre className="bg-gray-800 p-4 rounded-lg overflow-auto max-h-[calc(100vh-8rem)] text-sm">
            <code>{generateHTML()}</code>
          </pre>
        </motion.div>
      </div>
    </DndProvider>
  )
}

export default WebBuilderPlayground
// </ReactProject>
