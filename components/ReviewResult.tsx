'use client';

import React from 'react';
import { CVReviewResult } from '../types';
import { LayoutTemplate, TrendingUp, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';
import { cn } from './DropzoneArea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ReviewResultProps {
  result: CVReviewResult;
}

export default function ReviewResult({ result }: ReviewResultProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-700 bg-emerald-100/50 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400";
    if (score >= 60) return "text-amber-700 bg-amber-100/50 border-amber-200 dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-400";
    return "text-rose-700 bg-rose-100/50 border-rose-200 dark:bg-rose-900/30 dark:border-rose-800 dark:text-rose-400";
  };

  const getScoreProgressColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500 dark:bg-emerald-400";
    if (score >= 60) return "bg-amber-500 dark:bg-amber-400";
    return "bg-rose-500 dark:bg-rose-400";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
      
      {/* Top Section: Summary & Score */}
      <div className="lg:col-span-8 flex flex-col">
        <Card className="h-full border-border bg-card shadow-sm rounded-[2rem]">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary">
              Intinya Gini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed text-base">
              {result.overallSummary}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-4 flex flex-col">
        <Card className="h-full bg-primary text-primary-foreground rounded-[2rem] border-none shadow-md overflow-hidden relative flex flex-col justify-center items-center p-8 min-h-[200px]">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-black/10 rounded-full blur-2xl"></div>
          
          <h3 className="text-xs font-bold uppercase tracking-widest text-primary-foreground/70 mb-2 relative z-10">
            Skor Keseluruhan
          </h3>
          <span className="text-7xl font-black relative z-10 tracking-tighter">
            {result.score}
          </span>
          <span className="text-sm font-medium text-primary-foreground/70 mt-2 relative z-10">
            Dari 100
          </span>
        </Card>
      </div>

      {/* Metrics Row */}
      <div className="lg:col-span-4 flex flex-col">
        <MetricCard 
          title="Keramahan ATS" 
          icon={<LayoutTemplate className="w-5 h-5 text-indigo-500" />}
          score={result.atsFriendliness.score}
          feedback={result.atsFriendliness.feedback}
          issues={result.atsFriendliness.issues}
          getScoreColor={getScoreColor}
          getScoreProgressColor={getScoreProgressColor}
        />
      </div>

      <div className="lg:col-span-4 flex flex-col">
        <MetricCard 
          title="Impact & Metrik" 
          icon={<TrendingUp className="w-5 h-5 text-emerald-500" />}
          score={result.impactAndMetrics.score}
          feedback={result.impactAndMetrics.feedback}
          issues={result.impactAndMetrics.improvements}
          getScoreColor={getScoreColor}
          getScoreProgressColor={getScoreProgressColor}
        />
      </div>

      <div className="lg:col-span-4 flex flex-col">
        <MetricCard 
          title="Struktur & Keterbacaan" 
          icon={<CheckCircle2 className="w-5 h-5 text-amber-500" />}
          score={result.structureAndReadability.score}
          feedback={result.structureAndReadability.feedback}
          issues={result.structureAndReadability.improvements}
          getScoreColor={getScoreColor}
          getScoreProgressColor={getScoreProgressColor}
        />
      </div>

    </div>
  );
}

function MetricCard({ title, icon, score, feedback, issues, getScoreColor, getScoreProgressColor }: any) {
  return (
    <Card className="h-full border-border bg-card shadow-sm rounded-[2rem] flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-muted/50 border border-border flex items-center justify-center flex-shrink-0">
              {icon}
            </div>
            <CardTitle className="text-base font-bold text-foreground">
              {title}
            </CardTitle>
          </div>
          <Badge variant="outline" className={cn("px-3 py-1 rounded-full text-sm font-bold border", getScoreColor(score))}>
            {score}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow flex flex-col">
        <div className="w-full bg-secondary rounded-full h-2 mb-6 overflow-hidden">
          <div className={cn("h-full", getScoreProgressColor(score))} style={{ width: `${score}%` }}></div>
        </div>

        <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-grow">
          {feedback}
        </p>

        {issues && issues.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-border">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-destructive flex items-center">
              <AlertCircle className="w-3.5 h-3.5 mr-1.5" />
              Biar Makin Kece
            </h4>
            <ul className="space-y-2">
              {issues.map((issue: string, idx: number) => (
                <li key={idx} className="flex items-start text-sm text-muted-foreground bg-muted/30 p-3 rounded-xl border border-border/50">
                  <ChevronRight className="w-4 h-4 text-muted-foreground/50 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{issue}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
