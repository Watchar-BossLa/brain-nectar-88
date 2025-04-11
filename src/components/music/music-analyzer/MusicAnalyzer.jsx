import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { 
  Music, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Info, 
  FileText, 
  BarChart4, 
  Waveform 
} from 'lucide-react';

/**
 * MusicAnalyzer component for analyzing musical compositions and theory
 * @returns {React.ReactElement} MusicAnalyzer component
 */
const MusicAnalyzer = () => {
  // State for selected composition
  const [selectedComposition, setSelectedComposition] = useState(null);
  
  // State for audio playback
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  
  // Audio element reference
  const audioRef = useRef(null);
  
  // Sample composition data
  const compositions = [
    {
      id: 1,
      title: 'Moonlight Sonata',
      composer: 'Ludwig van Beethoven',
      year: 1801,
      period: 'Classical/Early Romantic',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Beethoven_Piano_Sonata_14_title_page.jpg/800px-Beethoven_Piano_Sonata_14_title_page.jpg',
      audio: 'https://upload.wikimedia.org/wikipedia/commons/6/64/Beethoven_Moonlight_1st_movement.ogg',
      description: 'Piano Sonata No. 14 in C-sharp minor, Op. 27, No. 2, popularly known as the "Moonlight Sonata".',
      duration: 318 // 5:18 in seconds
    },
    {
      id: 2,
      title: 'The Four Seasons - Spring',
      composer: 'Antonio Vivaldi',
      year: 1723,
      period: 'Baroque',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Antonio_Vivaldi.jpg/800px-Antonio_Vivaldi.jpg',
      audio: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/01_-_Vivaldi_Spring_mvt_1_Allegro_-_John_Harrison_violin.ogg',
      description: 'The first concerto of "The Four Seasons" (Le quattro stagioni), a set of four violin concertos by Antonio Vivaldi.',
      duration: 199 // 3:19 in seconds
    },
    {
      id: 3,
      title: 'Prelude in C Major',
      composer: 'Johann Sebastian Bach',
      year: 1722,
      period: 'Baroque',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Johann_Sebastian_Bach.jpg/800px-Johann_Sebastian_Bach.jpg',
      audio: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Prelude_No._1_in_C_major%2C_BWV_846.ogg',
      description: 'Prelude No. 1 in C major, BWV 846, from Book I of The Well-Tempered Clavier.',
      duration: 124 // 2:04 in seconds
    }
  ];
  
  // Sample analysis data for the selected composition
  const analysisData = {
    'Moonlight Sonata': {
      form: {
        structure: 'Sonata Form',
        movements: [
          { name: 'Adagio sostenuto', tempo: 'Slow and sustained', key: 'C-sharp minor' },
          { name: 'Allegretto', tempo: 'Moderately fast', key: 'D-flat major' },
          { name: 'Presto agitato', tempo: 'Very fast and agitated', key: 'C-sharp minor' }
        ],
        description: 'The first movement, which is the most famous, is in a modified sonata form. The second movement is a relatively conventional scherzo and trio. The final movement is a fast and turbulent sonata-allegro.'
      },
      harmony: {
        key: 'C-sharp minor',
        progressions: [
          { name: 'i - VI - iv - V', description: 'Minor tonic to submediant to subdominant to dominant' },
          { name: 'i - V7 - i', description: 'Minor tonic to dominant seventh to minor tonic' }
        ],
        features: [
          'Use of arpeggiated triplet figures in the right hand',
          'Sustained pedal tones in the bass',
          'Subtle harmonic shifts that create emotional tension'
        ]
      },
      melody: {
        themes: [
          { name: 'Main Theme', description: 'Simple, haunting melody in the right hand over arpeggiated triplets' },
          { name: 'Second Theme', description: 'More lyrical melody that appears in the relative major key' }
        ],
        characteristics: [
          'Sparse melodic material',
          'Emphasis on harmonic color rather than melodic development',
          'Subtle dynamic contrasts'
        ]
      },
      historical: {
        context: 'Composed during Beethoven\'s early period when he was beginning to confront his increasing deafness. The piece represents a departure from conventional Classical forms and points toward the more emotionally expressive Romantic era.',
        influence: 'The "Moonlight" Sonata has had an enormous influence on piano music and has become one of the most famous piano pieces ever written. Its innovative approach to sonata form and its emotional depth set new standards for piano composition.',
        reception: 'The nickname "Moonlight" was not given by Beethoven but was coined by the German music critic Ludwig Rellstab, who, in 1832, described the first movement as like moonlight shining on Lake Lucerne.'
      }
    },
    'The Four Seasons - Spring': {
      form: {
        structure: 'Concerto',
        movements: [
          { name: 'Allegro', tempo: 'Fast', key: 'E major' },
          { name: 'Largo e pianissimo sempre', tempo: 'Slow and very quiet throughout', key: 'C-sharp minor' },
          { name: 'Allegro pastorale', tempo: 'Fast, in a pastoral style', key: 'E major' }
        ],
        description: 'A baroque concerto in three movements (fast-slow-fast) with a solo violin accompanied by a string orchestra. Each movement depicts aspects of the season of spring.'
      },
      harmony: {
        key: 'E major',
        progressions: [
          { name: 'I - IV - V - I', description: 'Tonic to subdominant to dominant to tonic' },
          { name: 'vi - ii - V - I', description: 'Submediant to supertonic to dominant to tonic' }
        ],
        features: [
          'Clear tonal centers',
          'Functional harmony typical of the Baroque period',
          'Use of sequences and circle of fifths progressions'
        ]
      },
      melody: {
        themes: [
          { name: 'Spring Theme', description: 'Bright, cheerful melody representing birds and springtime' },
          { name: 'Thunderstorm Theme', description: 'Rapid, agitated figures depicting a spring thunderstorm' }
        ],
        characteristics: [
          'Virtuosic solo violin passages',
          'Imitation of natural sounds (birds, thunder, etc.)',
          'Clear thematic development'
        ]
      },
      historical: {
        context: 'Composed during the Baroque period when program music (music that tells a story or depicts scenes) was becoming popular. Vivaldi published the concertos with accompanying sonnets that described the scenes depicted in the music.',
        influence: 'The Four Seasons revolutionized the concerto form and established Vivaldi as a master of program music. The work has influenced countless composers in their approach to depicting nature through music.',
        reception: 'While popular during Vivaldi\'s lifetime, The Four Seasons fell into obscurity after his death, only to be rediscovered in the 20th century. Today, it is one of the most recorded and performed works in the classical repertoire.'
      }
    },
    'Prelude in C Major': {
      form: {
        structure: 'Prelude',
        movements: [
          { name: 'Prelude', tempo: 'Moderate', key: 'C major' }
        ],
        description: 'A single-movement prelude consisting of arpeggiated chords that outline a harmonic progression. It serves as an introduction to the fugue that follows in The Well-Tempered Clavier.'
      },
      harmony: {
        key: 'C major',
        progressions: [
          { name: 'I - IV - V - I', description: 'Tonic to subdominant to dominant to tonic' },
          { name: 'ii - V - I', description: 'Supertonic to dominant to tonic' }
        ],
        features: [
          'Continuous arpeggiated pattern throughout',
          'Clear harmonic progression',
          'Cadential patterns that create a sense of resolution'
        ]
      },
      melody: {
        themes: [
          { name: 'Arpeggiated Figure', description: 'The piece consists primarily of broken chords rather than a distinct melody' }
        ],
        characteristics: [
          'Emphasis on harmonic progression rather than melodic development',
          'Consistent rhythmic pattern',
          'Sense of forward motion through continuous sixteenth notes'
        ]
      },
      historical: {
        context: 'Composed as part of The Well-Tempered Clavier, a collection of preludes and fugues in all 24 major and minor keys. Bach wrote this collection partly to demonstrate the versatility of well-tempered tuning, which allowed music to be played in any key.',
        influence: 'This prelude has had an enormous influence on keyboard music and has been arranged for various instruments. It established a model for preludes that many later composers followed.',
        reception: 'The C Major Prelude is one of Bach\'s most recognized works and has been used in various contexts, including Charles Gounod\'s "Ave Maria," which superimposes a melody over Bach\'s harmonic progression.'
      }
    }
  };
  
  // Select a composition for analysis
  const handleSelectComposition = (composition) => {
    setSelectedComposition(composition);
    setIsPlaying(false);
    setCurrentTime(0);
    
    // Reset audio element
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = composition.audio;
      audioRef.current.volume = volume / 100;
    }
  };
  
  // Handle play/pause
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  // Handle seek
  const handleSeek = (value) => {
    if (audioRef.current) {
      const newTime = (value[0] / 100) * selectedComposition.duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };
  
  // Handle volume change
  const handleVolumeChange = (value) => {
    if (audioRef.current) {
      const newVolume = value[0];
      audioRef.current.volume = newVolume / 100;
      setVolume(newVolume);
      
      if (newVolume === 0) {
        setIsMuted(true);
      } else if (isMuted) {
        setIsMuted(false);
      }
    }
  };
  
  // Handle mute toggle
  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume / 100;
      } else {
        audioRef.current.volume = 0;
      }
      setIsMuted(!isMuted);
    }
  };
  
  // Format time (seconds to MM:SS)
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  // Update current time during playback
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };
  
  // Handle end of audio
  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };
  
  // Render composition selection
  const renderCompositionSelection = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {compositions.map(composition => (
          <Card 
            key={composition.id} 
            className={`cursor-pointer transition-all ${selectedComposition?.id === composition.id ? 'border-primary ring-2 ring-primary/20' : ''}`}
            onClick={() => handleSelectComposition(composition)}
          >
            <div className="aspect-square overflow-hidden">
              <img 
                src={composition.image} 
                alt={composition.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="pt-4">
              <h3 className="font-medium">{composition.title}</h3>
              <p className="text-sm text-muted-foreground">{composition.composer}, {composition.year}</p>
              <Badge variant="outline" className="mt-2">{composition.period}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };
  
  // Render music player
  const renderMusicPlayer = () => {
    if (!selectedComposition) return null;
    
    const progressPercentage = (currentTime / selectedComposition.duration) * 100;
    
    return (
      <div className="space-y-4">
        <audio 
          ref={audioRef}
          src={selectedComposition.audio}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          className="hidden"
        />
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {formatTime(currentTime)}
          </div>
          <div className="flex-1 mx-4">
            <Slider 
              value={[progressPercentage]} 
              min={0} 
              max={100} 
              step={0.1}
              onValueChange={handleSeek}
              className="cursor-pointer"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            {formatTime(selectedComposition.duration)}
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" disabled>
              <SkipBack className="h-5 w-5" />
            </Button>
            <Button variant="default" size="icon" onClick={togglePlayPause}>
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" disabled>
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleMute}>
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
            <div className="w-24">
              <Slider 
                value={[isMuted ? 0 : volume]} 
                min={0} 
                max={100} 
                step={1}
                onValueChange={handleVolumeChange}
                className="cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render music analysis
  const renderMusicAnalysis = () => {
    if (!selectedComposition) {
      return (
        <div className="text-center py-12">
          <Music className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No Composition Selected</h3>
          <p className="text-muted-foreground">
            Select a composition from the gallery to analyze its musical elements.
          </p>
        </div>
      );
    }
    
    // Get analysis data for the selected composition
    const analysis = analysisData[selectedComposition.title];
    
    if (!analysis) {
      return (
        <div className="text-center py-12">
          <Info className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">Analysis Not Available</h3>
          <p className="text-muted-foreground">
            Analysis data for this composition is not available.
          </p>
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <Card>
              <div className="aspect-square overflow-hidden">
                <img 
                  src={selectedComposition.image} 
                  alt={selectedComposition.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="pt-4">
                <h3 className="font-medium">{selectedComposition.title}</h3>
                <p className="text-sm text-muted-foreground">{selectedComposition.composer}, {selectedComposition.year}</p>
                <p className="text-sm mt-2">{selectedComposition.description}</p>
                {renderMusicPlayer()}
              </CardContent>
            </Card>
          </div>
          
          <div className="md:w-2/3">
            <Tabs defaultValue="form">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="form">
                  <FileText className="h-4 w-4 mr-2" />
                  Form
                </TabsTrigger>
                <TabsTrigger value="harmony">
                  <BarChart4 className="h-4 w-4 mr-2" />
                  Harmony
                </TabsTrigger>
                <TabsTrigger value="melody">
                  <Waveform className="h-4 w-4 mr-2" />
                  Melody
                </TabsTrigger>
                <TabsTrigger value="historical">
                  <Info className="h-4 w-4 mr-2" />
                  Historical
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="form">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Form Analysis</CardTitle>
                    <CardDescription>Musical structure and organization</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Structure</h4>
                      <p className="text-sm">{analysis.form.structure}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Movements</h4>
                      <ul className="space-y-2">
                        {analysis.form.movements.map((movement, index) => (
                          <li key={index} className="text-sm">
                            <span className="font-medium">{movement.name}</span>
                            <span className="text-muted-foreground"> - {movement.tempo}, {movement.key}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Description</h4>
                      <p className="text-sm text-muted-foreground">{analysis.form.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="harmony">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Harmonic Analysis</CardTitle>
                    <CardDescription>Chord progressions and tonal structure</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Key</h4>
                      <p className="text-sm">{analysis.harmony.key}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Key Progressions</h4>
                      <ul className="space-y-2">
                        {analysis.harmony.progressions.map((progression, index) => (
                          <li key={index} className="text-sm">
                            <span className="font-medium font-mono">{progression.name}</span>
                            <span className="text-muted-foreground"> - {progression.description}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Harmonic Features</h4>
                      <ul className="space-y-1">
                        {analysis.harmony.features.map((feature, index) => (
                          <li key={index} className="text-sm flex items-start gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5"></div>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="melody">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Melodic Analysis</CardTitle>
                    <CardDescription>Themes and melodic characteristics</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Key Themes</h4>
                      <ul className="space-y-2">
                        {analysis.melody.themes.map((theme, index) => (
                          <li key={index} className="text-sm">
                            <span className="font-medium">{theme.name}</span>
                            <span className="text-muted-foreground"> - {theme.description}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Melodic Characteristics</h4>
                      <ul className="space-y-1">
                        {analysis.melody.characteristics.map((characteristic, index) => (
                          <li key={index} className="text-sm flex items-start gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5"></div>
                            <span>{characteristic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="historical">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Historical Context</CardTitle>
                    <CardDescription>Historical significance and reception</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Context</h4>
                      <p className="text-sm text-muted-foreground">{analysis.historical.context}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Influence</h4>
                      <p className="text-sm text-muted-foreground">{analysis.historical.influence}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Reception</h4>
                      <p className="text-sm text-muted-foreground">{analysis.historical.reception}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium">About {selectedComposition.period} Music</h4>
                {selectedComposition.period === 'Baroque' && (
                  <p className="text-sm text-muted-foreground mt-1">
                    The Baroque period (1600-1750) is characterized by ornate, dramatic music with complex counterpoint and harmonic structures. 
                    Key features include the use of basso continuo, the development of opera, and the rise of instrumental music as an independent art form. 
                    Major composers include Bach, Handel, and Vivaldi.
                  </p>
                )}
                {selectedComposition.period === 'Classical/Early Romantic' && (
                  <p className="text-sm text-muted-foreground mt-1">
                    The Classical period (1750-1820) emphasized clarity, balance, and formal structure, while the Early Romantic period (1800-1850) 
                    began to explore more emotional expression and individual creativity. Beethoven's work spans both periods, 
                    starting with Classical forms but pushing toward the emotional intensity and formal innovations of Romanticism.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Music Analyzer</h3>
          <p className="text-sm text-muted-foreground">
            Analyze musical compositions, theory, and historical context
          </p>
        </div>
        <Button variant="outline" size="sm" disabled={!selectedComposition}>
          Upload Your Own Composition
        </Button>
      </div>
      
      <Tabs defaultValue="gallery">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="gallery">
            <Music className="h-4 w-4 mr-2" />
            Gallery
          </TabsTrigger>
          <TabsTrigger value="analysis" disabled={!selectedComposition}>
            <FileText className="h-4 w-4 mr-2" />
            Analysis
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="gallery">
          {renderCompositionSelection()}
        </TabsContent>
        
        <TabsContent value="analysis">
          {renderMusicAnalysis()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MusicAnalyzer;
