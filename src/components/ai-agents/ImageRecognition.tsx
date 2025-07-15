import React, { useState, useRef } from 'react';
import { Upload, Image, Eye, Tag, Loader, AlertCircle, CheckCircle, X } from 'lucide-react';

interface AnalysisResult {
  id: string;
  filename: string;
  fileSize: number;
  uploadTime: Date;
  status: 'analyzing' | 'completed' | 'error';
  results?: {
    objects: Array<{
      name: string;
      confidence: number;
      boundingBox?: {
        x: number;
        y: number;
        width: number;
        height: number;
      };
    }>;
    tags: Array<{
      name: string;
      confidence: number;
    }>;
    text?: Array<{
      text: string;
      confidence: number;
      boundingBox?: {
        x: number;
        y: number;
        width: number;
        height: number;
      };
    }>;
    faces?: Array<{
      age?: number;
      gender?: string;
      emotion?: string;
      confidence: number;
      boundingBox?: {
        x: number;
        y: number;
        width: number;
        height: number;
      };
    }>;
    categories: Array<{
      name: string;
      confidence: number;
    }>;
    colors: Array<{
      color: string;
      percentage: number;
    }>;
    metadata: {
      width: number;
      height: number;
      format: string;
      hasAdultContent: boolean;
      isRacyContent: boolean;
      violenceScore: number;
    };
  };
  error?: string;
  imageUrl?: string;
}

const ImageRecognition: React.FC = () => {
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        processImage(file);
      }
    });
  };

  const processImage = async (file: File) => {
    const analysisId = Date.now().toString();
    const imageUrl = URL.createObjectURL(file);

    const newAnalysis: AnalysisResult = {
      id: analysisId,
      filename: file.name,
      fileSize: file.size,
      uploadTime: new Date(),
      status: 'analyzing',
      imageUrl
    };

    setAnalyses(prev => [newAnalysis, ...prev]);

    try {
      // Simulate API call to image recognition service
      const results = await simulateImageAnalysisAPI(file, imageUrl);
      
      setAnalyses(prev => prev.map(analysis => 
        analysis.id === analysisId 
          ? { ...analysis, status: 'completed', results }
          : analysis
      ));
    } catch (error) {
      setAnalyses(prev => prev.map(analysis => 
        analysis.id === analysisId 
          ? { ...analysis, status: 'error', error: 'Failed to analyze image' }
          : analysis
      ));
    }
  };

  const simulateImageAnalysisAPI = async (file: File, imageUrl: string): Promise<AnalysisResult['results']> => {
    // Simulate API processing time
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

    // Create image element to get dimensions
    const img = new Image();
    img.src = imageUrl;
    await new Promise(resolve => { img.onload = resolve; });

    // Simulate comprehensive image analysis results
    const mockResults = {
      objects: [
        { name: 'person', confidence: 0.95, boundingBox: { x: 100, y: 50, width: 200, height: 300 } },
        { name: 'car', confidence: 0.87, boundingBox: { x: 300, y: 200, width: 150, height: 100 } },
        { name: 'building', confidence: 0.76, boundingBox: { x: 0, y: 0, width: 500, height: 200 } },
        { name: 'tree', confidence: 0.82 },
        { name: 'sky', confidence: 0.91 }
      ],
      tags: [
        { name: 'outdoor', confidence: 0.98 },
        { name: 'urban', confidence: 0.85 },
        { name: 'daytime', confidence: 0.92 },
        { name: 'street', confidence: 0.78 },
        { name: 'architecture', confidence: 0.71 },
        { name: 'transportation', confidence: 0.83 }
      ],
      text: [
        { text: 'STOP', confidence: 0.96, boundingBox: { x: 150, y: 180, width: 50, height: 20 } },
        { text: 'Main St', confidence: 0.89, boundingBox: { x: 200, y: 160, width: 80, height: 15 } }
      ],
      faces: [
        { 
          age: 35, 
          gender: 'male', 
          emotion: 'neutral', 
          confidence: 0.88,
          boundingBox: { x: 120, y: 70, width: 60, height: 80 }
        }
      ],
      categories: [
        { name: 'outdoor_street', confidence: 0.94 },
        { name: 'urban_scene', confidence: 0.87 },
        { name: 'transportation', confidence: 0.79 }
      ],
      colors: [
        { color: '#4A90E2', percentage: 35 }, // Blue (sky)
        { color: '#7ED321', percentage: 25 }, // Green (trees)
        { color: '#9013FE', percentage: 20 }, // Gray (buildings)
        { color: '#F5A623', percentage: 12 }, // Yellow (signs)
        { color: '#D0021B', percentage: 8 }   // Red (car)
      ],
      metadata: {
        width: img.width,
        height: img.height,
        format: file.type,
        hasAdultContent: false,
        isRacyContent: false,
        violenceScore: 0.02
      }
    };

    // Randomize some results for variety
    const randomizeResults = (items: any[], maxItems: number = 5) => {
      return items
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * maxItems) + 1)
        .map(item => ({
          ...item,
          confidence: Math.max(0.5, item.confidence + (Math.random() - 0.5) * 0.3)
        }));
    };

    return {
      objects: randomizeResults(mockResults.objects, 6),
      tags: randomizeResults(mockResults.tags, 8),
      text: Math.random() > 0.5 ? randomizeResults(mockResults.text, 3) : [],
      faces: Math.random() > 0.7 ? randomizeResults(mockResults.faces, 2) : [],
      categories: randomizeResults(mockResults.categories, 4),
      colors: mockResults.colors,
      metadata: mockResults.metadata
    };
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-100';
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const removeAnalysis = (id: string) => {
    setAnalyses(prev => prev.filter(analysis => analysis.id !== id));
    if (selectedAnalysis?.id === id) {
      setSelectedAnalysis(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Eye className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">AI Image Recognition</h2>
        </div>
        <div className="text-sm text-gray-500">
          Powered by Computer Vision API
        </div>
      </div>

      {/* Upload Area */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Images for Analysis</h3>
          <p className="text-gray-600 mb-4">
            Drag and drop images here, or click to select files
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Select Images
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
          <p className="text-xs text-gray-500 mt-2">
            Supports JPG, PNG, GIF, WebP (max 10MB per file)
          </p>
        </div>
      </div>

      {/* Analysis Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Results List */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Results</h3>
          
          {analyses.length === 0 ? (
            <div className="text-center py-8">
              <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No images analyzed yet</p>
              <p className="text-sm text-gray-400">Upload images to see AI analysis results</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {analyses.map((analysis) => (
                <div 
                  key={analysis.id} 
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedAnalysis?.id === analysis.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedAnalysis(analysis)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {analysis.imageUrl && (
                        <img 
                          src={analysis.imageUrl} 
                          alt={analysis.filename}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{analysis.filename}</h4>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(analysis.fileSize)} • {analysis.uploadTime.toLocaleTimeString()}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          {analysis.status === 'analyzing' && (
                            <>
                              <Loader className="h-4 w-4 text-blue-600 animate-spin" />
                              <span className="text-sm text-blue-600">Analyzing...</span>
                            </>
                          )}
                          {analysis.status === 'completed' && (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm text-green-600">Complete</span>
                            </>
                          )}
                          {analysis.status === 'error' && (
                            <>
                              <AlertCircle className="h-4 w-4 text-red-600" />
                              <span className="text-sm text-red-600">Error</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeAnalysis(analysis.id);
                      }}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detailed Results */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Analysis</h3>
          
          {!selectedAnalysis ? (
            <div className="text-center py-8">
              <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Select an image to view detailed analysis</p>
            </div>
          ) : selectedAnalysis.status === 'analyzing' ? (
            <div className="text-center py-8">
              <Loader className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
              <p className="text-blue-600">Analyzing image...</p>
            </div>
          ) : selectedAnalysis.status === 'error' ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <p className="text-red-600">Analysis failed</p>
              <p className="text-sm text-gray-500">{selectedAnalysis.error}</p>
            </div>
          ) : (
            <div className="space-y-6 max-h-96 overflow-y-auto">
              {/* Image Preview */}
              {selectedAnalysis.imageUrl && (
                <div className="text-center">
                  <img 
                    src={selectedAnalysis.imageUrl} 
                    alt={selectedAnalysis.filename}
                    className="max-w-full h-48 object-contain mx-auto rounded"
                  />
                </div>
              )}

              {/* Objects Detected */}
              {selectedAnalysis.results?.objects && selectedAnalysis.results.objects.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Objects Detected</h4>
                  <div className="space-y-2">
                    {selectedAnalysis.results.objects.map((object, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{object.name}</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getConfidenceColor(object.confidence)}`}>
                          {Math.round(object.confidence * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {selectedAnalysis.results?.tags && selectedAnalysis.results.tags.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedAnalysis.results.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getConfidenceColor(tag.confidence)}`}
                      >
                        {tag.name} ({Math.round(tag.confidence * 100)}%)
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Text Recognition */}
              {selectedAnalysis.results?.text && selectedAnalysis.results.text.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Text Detected</h4>
                  <div className="space-y-2">
                    {selectedAnalysis.results.text.map((text, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 font-mono">"{text.text}"</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getConfidenceColor(text.confidence)}`}>
                          {Math.round(text.confidence * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Face Analysis */}
              {selectedAnalysis.results?.faces && selectedAnalysis.results.faces.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Face Analysis</h4>
                  <div className="space-y-2">
                    {selectedAnalysis.results.faces.map((face, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {face.age && <div>Age: ~{face.age}</div>}
                          {face.gender && <div>Gender: {face.gender}</div>}
                          {face.emotion && <div>Emotion: {face.emotion}</div>}
                          <div>Confidence: {Math.round(face.confidence * 100)}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Analysis */}
              {selectedAnalysis.results?.colors && selectedAnalysis.results.colors.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Dominant Colors</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedAnalysis.results.colors.map((color, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div 
                          className="w-6 h-6 rounded border border-gray-300"
                          style={{ backgroundColor: color.color }}
                        ></div>
                        <span className="text-sm text-gray-700">{color.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata */}
              {selectedAnalysis.results?.metadata && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Image Metadata</h4>
                  <div className="bg-gray-50 p-3 rounded text-sm space-y-1">
                    <div>Dimensions: {selectedAnalysis.results.metadata.width} × {selectedAnalysis.results.metadata.height}</div>
                    <div>Format: {selectedAnalysis.results.metadata.format}</div>
                    <div>Adult Content: {selectedAnalysis.results.metadata.hasAdultContent ? 'Yes' : 'No'}</div>
                    <div>Violence Score: {Math.round(selectedAnalysis.results.metadata.violenceScore * 100)}%</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageRecognition;