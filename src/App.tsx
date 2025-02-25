import React, { useState, useRef } from 'react';
import { Upload, Download, Lock, Image as ImageIcon } from 'lucide-react';
import { encodeMessage, decodeMessage } from './steganography';

function App() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [image, setImage] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProcess = async () => {
    if (!image || !password) {
      setError('Please provide both an image and a password');
      return;
    }

    try {
      if (mode === 'encode') {
        if (!message) {
          setError('Please enter a message to hide');
          return;
        }
        const result = await encodeMessage(image, message, password);
        setResult(result);
        setError(null);
      } else {
        const decoded = await decodeMessage(image, password);
        setMessage(decoded);
        setError(null);
      }
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const downloadImage = () => {
    if (result) {
      const link = document.createElement('a');
      link.download = 'stego-image.png';
      link.href = result;
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-center mb-8">Image Steganography</h1>
          
          <div className="flex justify-center space-x-4 mb-8">
            <button
              className={`px-6 py-2 rounded-lg ${
                mode === 'encode'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => setMode('encode')}
            >
              <Upload className="inline-block mr-2 h-5 w-5" />
              Encode
            </button>
            <button
              className={`px-6 py-2 rounded-lg ${
                mode === 'decode'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => setMode('decode')}
            >
              <Download className="inline-block mr-2 h-5 w-5" />
              Decode
            </button>
          </div>

          <div className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="imageInput"
              />
              <label
                htmlFor="imageInput"
                className="cursor-pointer block"
              >
                {image ? (
                  <img
                    src={image}
                    alt="Selected"
                    className="max-h-64 mx-auto"
                  />
                ) : (
                  <div className="text-gray-500">
                    <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                    <p>Click to upload an image</p>
                  </div>
                )}
              </label>
            </div>

            <div className="space-y-4">
              {mode === 'encode' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message to Hide
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={4}
                    placeholder="Enter your secret message..."
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md pr-10"
                    placeholder="Enter password..."
                  />
                  <Lock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <button
                onClick={handleProcess}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {mode === 'encode' ? 'Hide Message' : 'Reveal Message'}
              </button>
            </div>

            {error && (
              <div className="text-red-600 bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            {result && mode === 'encode' && (
              <div className="text-center">
                <p className="text-green-600 mb-2">Message hidden successfully!</p>
                <button
                  onClick={downloadImage}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="inline-block mr-2 h-5 w-5" />
                  Download Image
                </button>
              </div>
            )}

            {mode === 'decode' && message && !error && (
              <div className="bg-green-50 p-4 rounded-md">
                <h3 className="font-medium text-green-800 mb-2">Decoded Message:</h3>
                <p className="text-green-700">{message}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}

export default App;