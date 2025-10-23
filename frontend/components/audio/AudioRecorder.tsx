'use client';

import { Mic, Square, Pause, Play, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  disabled?: boolean;
}

export default function AudioRecorder({ onRecordingComplete, disabled }: AudioRecorderProps) {
  const {
    isRecording,
    isPaused,
    recordingTime,
    audioBlob,
    audioUrl,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    clearRecording,
  } = useAudioRecorder();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartRecording = async () => {
    try {
      await startRecording();
    } catch (error) {
      alert('Erro ao acessar o microfone. Verifique as permissões.');
    }
  };

  const handleStopRecording = () => {
    stopRecording();
  };

  const handleSaveRecording = () => {
    if (audioBlob) {
      onRecordingComplete(audioBlob);
      clearRecording();
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="text-4xl font-mono font-bold">
            {formatTime(recordingTime)}
          </div>

          <div className="flex items-center space-x-2">
            {isRecording && (
              <div className="flex items-center space-x-2">
                <div className={`h-3 w-3 rounded-full ${isPaused ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'}`} />
                <span className="text-sm font-medium">
                  {isPaused ? 'Pausado' : 'Gravando'}
                </span>
              </div>
            )}
          </div>

          <div className="flex space-x-2">
            {!isRecording && !audioBlob && (
              <Button
                onClick={handleStartRecording}
                disabled={disabled}
                size="lg"
                className="rounded-full"
              >
                <Mic className="mr-2 h-5 w-5" />
                Iniciar Gravação
              </Button>
            )}

            {isRecording && (
              <>
                {!isPaused ? (
                  <Button
                    onClick={pauseRecording}
                    variant="outline"
                    size="lg"
                    className="rounded-full"
                  >
                    <Pause className="mr-2 h-5 w-5" />
                    Pausar
                  </Button>
                ) : (
                  <Button
                    onClick={resumeRecording}
                    variant="outline"
                    size="lg"
                    className="rounded-full"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Continuar
                  </Button>
                )}

                <Button
                  onClick={handleStopRecording}
                  variant="destructive"
                  size="lg"
                  className="rounded-full"
                >
                  <Square className="mr-2 h-5 w-5" />
                  Parar
                </Button>
              </>
            )}
          </div>

          {audioUrl && (
            <div className="w-full space-y-4">
              <audio src={audioUrl} controls className="w-full" />

              <div className="flex space-x-2">
                <Button
                  onClick={handleSaveRecording}
                  className="flex-1"
                  disabled={disabled}
                >
                  Salvar Gravação
                </Button>
                <Button
                  onClick={clearRecording}
                  variant="outline"
                  disabled={disabled}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
