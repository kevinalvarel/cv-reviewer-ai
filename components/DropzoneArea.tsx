'use client';

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper for tailwind class merging
export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

interface DropzoneAreaProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClearFile: () => void;
  isProcessing: boolean;
}

export default function DropzoneArea({ onFileSelect, selectedFile, onClearFile, isProcessing }: DropzoneAreaProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
    disabled: isProcessing,
  });

  return (
    <div className="w-full flex-grow flex flex-col h-full relative">
      {!selectedFile ? (
        <div className="flex flex-col flex-grow h-full min-h-[300px]">
          <div
            {...getRootProps()}
            className={cn(
              "flex-grow flex flex-col items-center justify-center border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all duration-300",
              isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/30 bg-muted/20 hover:border-primary/50 hover:bg-primary/5",
              isDragReject && "border-destructive bg-destructive/5",
              isProcessing && "opacity-50 cursor-not-allowed pointer-events-none"
            )}
          >
            <input {...getInputProps()} />
            <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center shadow-sm mb-6 text-primary transition-transform hover:scale-105 border border-border">
              <UploadCloud className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {isDragActive ? "Drop your resume here..." : "Upload your CV (PDF)"}
            </h3>
            <p className="text-muted-foreground text-sm max-w-[280px] mx-auto">
              Drag & drop your file or click to browse. Maximum file size is 5MB.
            </p>
            {isDragReject && (
              <p className="text-destructive text-sm mt-4 font-medium">Only PDF formats are supported!</p>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col flex-grow h-full min-h-[300px]">
          <div className="flex-grow flex flex-col items-center justify-center border-2 border-dashed border-primary/40 rounded-3xl bg-primary/5 p-8 text-center relative overflow-hidden">
             {!isProcessing && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClearFile();
                  }}
                  className="absolute top-6 right-6 p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                  title="Remove file"
                >
                  <X className="w-5 h-5" />
                </button>
             )}
            <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center shadow-sm mb-6 border border-border">
              <FileText className="w-10 h-10 text-primary" />
            </div>
            <p className="text-lg font-semibold text-foreground max-w-full truncate px-4">{selectedFile.name}</p>
            <p className="text-sm text-muted-foreground mt-2">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            
            {isProcessing && (
              <div className="w-full max-w-[250px] bg-muted h-2 rounded-full mt-8 overflow-hidden relative">
                <div className="bg-primary h-full w-1/2 absolute top-0 left-0 animate-[shimmer_1.5s_infinite]"></div>
                <style>{`
                  @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(200%); }
                  }
                `}</style>
              </div>
            )}
            {!isProcessing && (
              <div className="w-full max-w-[250px] bg-muted h-2 rounded-full mt-8 overflow-hidden">
                <div className="bg-primary h-full w-full"></div>
              </div>
            )}

            <p className={cn(
              "text-xs uppercase tracking-widest font-semibold mt-4",
              isProcessing ? "text-muted-foreground animate-pulse" : "text-primary"
            )}>
              {isProcessing ? "Analyzing Document..." : "Ready for Analysis"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
