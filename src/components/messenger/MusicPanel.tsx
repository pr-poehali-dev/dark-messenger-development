import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

const MusicPanel = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<any>(null);

  const mockTracks = [
    { id: 1, title: 'Bohemian Rhapsody', artist: 'Queen', duration: '5:55', cover: '🎸' },
    { id: 2, title: 'Imagine', artist: 'John Lennon', duration: '3:03', cover: '🎹' },
    { id: 3, title: 'Smells Like Teen Spirit', artist: 'Nirvana', duration: '5:01', cover: '🎤' },
    { id: 4, title: 'Billie Jean', artist: 'Michael Jackson', duration: '4:54', cover: '🕺' },
    { id: 5, title: 'Stairway to Heaven', artist: 'Led Zeppelin', duration: '8:02', cover: '🎸' },
    { id: 6, title: 'Hey Jude', artist: 'The Beatles', duration: '7:11', cover: '🎵' }
  ];

  const myPlaylist = [
    { id: 1, title: 'Bohemian Rhapsody', artist: 'Queen', duration: '5:55', cover: '🎸' },
    { id: 2, title: 'Imagine', artist: 'John Lennon', duration: '3:03', cover: '🎹' }
  ];

  const handlePlayTrack = (track: any) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    toast.success(`Играет: ${track.title}`);
  };

  return (
    <div className="flex-1 flex flex-col bg-background">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Музыка</h2>
            <Button variant="outline" onClick={() => toast.success('Плейлист публичный')}>
              <Icon name="Users" size={18} className="mr-2" />
              Публичный плейлист
            </Button>
          </div>

          <div className="relative">
            <Icon name="Search" size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск музыки"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-lg"
            />
          </div>

          <div>
            <h3 className="font-semibold mb-3">Мой плейлист</h3>
            <Card className="p-2">
              {myPlaylist.map((track) => (
                <div
                  key={track.id}
                  className="flex items-center gap-3 p-3 hover:bg-muted rounded-lg transition-colors cursor-pointer"
                  onClick={() => handlePlayTrack(track)}
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-2xl">
                    {track.cover}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{track.title}</p>
                    <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">{track.duration}</span>
                  <Button variant="ghost" size="icon">
                    <Icon name="Play" size={20} />
                  </Button>
                </div>
              ))}
            </Card>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Рекомендации</h3>
            <div className="grid gap-2">
              {mockTracks.map((track) => (
                <Card key={track.id} className="p-3 hover:border-primary transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-2xl">
                      {track.cover}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{track.title}</p>
                      <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">{track.duration}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handlePlayTrack(track)}
                    >
                      <Icon name="Play" size={20} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toast.success('Добавлено в плейлист')}
                    >
                      <Icon name="Plus" size={20} />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {currentTrack && (
        <Card className="border-t border-border rounded-none bg-card p-4">
          <div className="max-w-4xl mx-auto space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center text-3xl">
                {currentTrack.cover}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{currentTrack.title}</p>
                <p className="text-sm text-muted-foreground truncate">{currentTrack.artist}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Icon name="SkipBack" size={20} />
                </Button>
                <Button
                  size="icon"
                  className="h-12 w-12 rounded-full"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  <Icon name={isPlaying ? 'Pause' : 'Play'} size={24} />
                </Button>
                <Button variant="ghost" size="icon">
                  <Icon name="SkipForward" size={20} />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Icon name="Volume2" size={20} />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">2:34</span>
              <Slider defaultValue={[45]} max={100} step={1} className="flex-1" />
              <span className="text-xs text-muted-foreground">{currentTrack.duration}</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default MusicPanel;
