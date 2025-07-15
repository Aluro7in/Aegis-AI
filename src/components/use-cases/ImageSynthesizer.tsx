import React, { useState } from 'react';
import { ArrowLeft, Image, Download, Settings, Wand2, Loader, AlertCircle } from 'lucide-react';
import { ImageGeneration } from '../../types';

interface ImageSynthesizerProps {
  onBack: () => void;
}

const ImageSynthesizer: React.FC<ImageSynthesizerProps> = ({ onBack }) => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('realistic');
  const [resolution, setResolution] = useState('1024x1024');
  const [guidance, setGuidance] = useState(7);
  const [steps, setSteps] = useState(20);
  const [negativePrompt, setNegativePrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generations, setGenerations] = useState<ImageGeneration[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const styles = [
    { id: 'realistic', name: 'Realistic', description: 'Photorealistic images' },
    { id: 'artistic', name: 'Artistic', description: 'Artistic and painterly' },
    { id: 'cartoon', name: 'Cartoon', description: 'Cartoon and animated style' },
    { id: 'abstract', name: 'Abstract', description: 'Abstract and conceptual' },
    { id: 'vintage', name: 'Vintage', description: 'Retro and vintage aesthetic' },
    { id: 'futuristic', name: 'Futuristic', description: 'Sci-fi and futuristic' }
  ];

  const resolutions = [
    { id: '1024x1024', name: '1024x1024', description: 'Square (1:1)' },
    { id: '1024x1792', name: '1024x1792', description: 'Portrait (9:16)' },
    { id: '1792x1024', name: '1792x1024', description: 'Landscape (16:9)' }
  ];

  const sampleImages = [
    'https://images.pexels.com/photos/1266810/pexels-photo-1266810.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1323712/pexels-photo-1323712.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1851415/pexels-photo-1851415.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/2246476/pexels-photo-2246476.jpeg?auto=compress&cs=tinysrgb&w=400'
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    
    const newGeneration: ImageGeneration = {
      id: Date.now().toString(),
      prompt,
      style,
      resolution,
      timestamp: new Date(),
      status: 'generating',
      parameters: {
        guidance,
        steps,
        negativePrompt
      }
    };

    setGenerations([newGeneration, ...generations]);

    // Simulate generation process
    setTimeout(() => {
      const completedGeneration = {
        ...newGeneration,
        status: 'completed' as const,
        imageUrl: sampleImages[Math.floor(Math.random() * sampleImages.length)]
      };
      
      setGenerations(prev => prev.map(gen => 
        gen.id === newGeneration.id ? completedGeneration : gen
      ));
      setIsGenerating(false);
    }, 3000);
  };

  const handleDownload = async (imageUrl: string, filename: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Use Cases</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">AI Image Synthesizer</h1>
          <p className="mt-2 text-gray-600">Advanced image generation powered by AWS Bedrock</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Generation Interface */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Image Generation</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prompt
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the image you want to generate..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Style
                    </label>
                    <select
                      value={style}
                      onChange={(e) => setStyle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {styles.map((styleOption) => (
                        <option key={styleOption.id} value={styleOption.id}>
                          {styleOption.name} - {styleOption.description}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Resolution
                    </label>
                    <select
                      value={resolution}
                      onChange={(e) => setResolution(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {resolutions.map((resOption) => (
                        <option key={resOption.id} value={resOption.id}>
                          {resOption.name} - {resOption.description}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Advanced Settings</span>
                  </button>
                </div>

                {showAdvanced && (
                  <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Guidance Scale: {guidance}
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="20"
                          value={guidance}
                          onChange={(e) => setGuidance(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Steps: {steps}
                        </label>
                        <input
                          type="range"
                          min="10"
                          max="50"
                          value={steps}
                          onChange={(e) => setSteps(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Negative Prompt
                      </label>
                      <textarea
                        value={negativePrompt}
                        onChange={(e) => setNegativePrompt(e.target.value)}
                        placeholder="What to avoid in the image..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={2}
                      />
                    </div>
                  </div>
                )}

                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isGenerating ? (
                    <>
                      <Loader className="h-5 w-5 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-5 w-5" />
                      <span>Generate Image</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* AWS Bedrock Integration Status */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">AWS Bedrock Integration</h3>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Demo Mode - Using sample images</span>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">AWS Bedrock Configuration Required</span>
                </div>
                <p className="text-sm text-yellow-700 mt-2">
                  To use real image generation, configure your AWS Bedrock credentials in the environment variables.
                  This demo uses sample images to showcase the interface.
                </p>
              </div>
            </div>
          </div>

          {/* Generation History */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Generation History</h3>
              <div className="space-y-4">
                {generations.length === 0 ? (
                  <div className="text-center py-8">
                    <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No generations yet</p>
                    <p className="text-sm text-gray-400">Create your first image to see it here</p>
                  </div>
                ) : (
                  generations.map((generation) => (
                    <div key={generation.id} className="border border-gray-200 rounded-lg p-4">
                      {generation.status === 'generating' ? (
                        <div className="flex items-center space-x-3">
                          <Loader className="h-5 w-5 animate-spin text-blue-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Generating...</p>
                            <p className="text-xs text-gray-500">{generation.prompt}</p>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <img
                            src={generation.imageUrl}
                            alt={generation.prompt}
                            className="w-full h-32 object-cover rounded-lg mb-2"
                          />
                          <p className="text-sm font-medium text-gray-900 mb-1">{generation.prompt}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">{generation.style}</span>
                            <button
                              onClick={() => handleDownload(generation.imageUrl!, `generated-${generation.id}.jpg`)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Models Available</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Amazon Titan</p>
                    <p className="text-xs text-gray-500">High-quality generation</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Stability AI</p>
                    <p className="text-xs text-gray-500">Artistic styles</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageSynthesizer;