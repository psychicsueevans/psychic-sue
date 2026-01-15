'use client';

import { useState, useRef } from 'react';
import Icon from '@/components/ui/AppIcon';

const AudioUploadSection = () => {
  const [selectedMember, setSelectedMember] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const members = [
    { id: '1', name: 'Sarah Johnson' },
    { id: '2', name: 'Emma Wilson' },
    { id: '3', name: 'Michael Brown' },
    { id: '4', name: 'Lisa Anderson' },
    { id: '5', name: 'David Thompson' },
  ];

  const recentUploads = [
    { id: '1', title: 'Personal Reading - January 2026', member: 'Sarah Johnson', date: '08/01/2026', duration: '12:45' },
    { id: '2', title: 'Follow-up Guidance', member: 'Emma Wilson', date: '07/01/2026', duration: '8:30' },
    { id: '3', title: 'Deep Dive Session Recording', member: 'Lisa Anderson', date: '05/01/2026', duration: '45:20' },
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        alert('File size must be less than 50MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (!selectedFile || !selectedMember || !title) {
      alert('Please fill in all required fields');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setTimeout(() => {
            setSelectedFile(null);
            setSelectedMember('');
            setTitle('');
            setDescription('');
            setUploadProgress(0);
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          }, 2000);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-muted/30 rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
          <Icon name="CloudArrowUpIcon" size={24} className="text-primary" />
          <span>Upload Audio Recording</span>
        </h3>

        <div className="space-y-4">
          <div>
            <label htmlFor="member-select" className="block text-sm font-medium text-foreground mb-2">
              Select Member <span className="text-error">*</span>
            </label>
            <select
              id="member-select"
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Choose a member...</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="recording-title" className="block text-sm font-medium text-foreground mb-2">
              Recording Title <span className="text-error">*</span>
            </label>
            <input
              type="text"
              id="recording-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Personal Reading - January 2026"
              className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label htmlFor="recording-description" className="block text-sm font-medium text-foreground mb-2">
              Description (Optional)
            </label>
            <textarea
              id="recording-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Add notes about this recording..."
              className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          {!selectedFile ? (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileSelect}
                className="hidden"
                id="audio-file-upload"
              />
              <label
                htmlFor="audio-file-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-all duration-250"
              >
                <Icon name="CloudArrowUpIcon" size={32} className="text-muted-foreground mb-2" />
                <p className="text-sm font-medium text-foreground">Click to upload audio file</p>
                <p className="text-xs text-muted-foreground mt-1">MP3, WAV, M4A (Max 50MB)</p>
              </label>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <Icon name="MusicalNoteIcon" size={24} className="text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </div>
                {!isUploading && (
                  <button
                    onClick={handleRemoveFile}
                    className="flex items-center justify-center w-8 h-8 text-muted-foreground hover:text-error hover:bg-error/10 rounded-lg transition-all duration-250"
                  >
                    <Icon name="XMarkIcon" size={20} />
                  </button>
                )}
              </div>

              {isUploading && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Uploading...</span>
                    <span className="text-sm font-medium text-primary">{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                </div>
              )}

              {!isUploading && uploadProgress === 0 && (
                <button
                  onClick={handleUpload}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-250 active:scale-95"
                >
                  <Icon name="ArrowUpTrayIcon" size={20} />
                  <span>Upload Recording</span>
                </button>
              )}

              {uploadProgress === 100 && (
                <div className="flex items-center justify-center space-x-2 p-3 bg-success/10 text-success rounded-lg">
                  <Icon name="CheckCircleIcon" size={20} />
                  <span className="text-sm font-medium">Recording uploaded successfully!</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Uploads</h3>
        <div className="space-y-3">
          {recentUploads.map((upload) => (
            <div key={upload.id} className="flex items-center justify-between p-4 bg-card rounded-lg border border-border hover:shadow-sm transition-all duration-250">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                  <Icon name="MusicalNoteIcon" size={20} className="text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{upload.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {upload.member} • {upload.date} • {upload.duration}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-all duration-250">
                  <Icon name="PlayIcon" size={18} />
                </button>
                <button className="p-2 text-muted-foreground hover:bg-muted rounded-lg transition-all duration-250">
                  <Icon name="TrashIcon" size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AudioUploadSection;