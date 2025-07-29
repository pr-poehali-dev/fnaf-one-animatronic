export const createSoundSystem = () => {
  const playSound = (soundType: string) => {
    if (typeof window !== 'undefined') {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Генератор белого шума
        const createNoise = (duration: number, volume: number = 0.1) => {
          const bufferSize = audioContext.sampleRate * duration;
          const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
          const output = buffer.getChannelData(0);
          
          for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
          }
          
          const whiteNoise = audioContext.createBufferSource();
          const gainNode = audioContext.createGain();
          
          whiteNoise.buffer = buffer;
          whiteNoise.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
          
          whiteNoise.start(audioContext.currentTime);
          whiteNoise.stop(audioContext.currentTime + duration);
        };
        
        // Сложный тон с гармониками
        const createComplexTone = (baseFreq: number, duration: number, harmonics: number[] = [1], volume: number = 0.1) => {
          harmonics.forEach((harmonic, index) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(baseFreq * harmonic, audioContext.currentTime);
            oscillator.type = index % 2 === 0 ? 'sawtooth' : 'square';
            
            const harmonicVolume = volume / (harmonic * 2);
            gainNode.gain.setValueAtTime(harmonicVolume, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
          });
        };

        switch (soundType) {
          case 'fredyLaugh':
            // Реалистичный зловещий смех с гармониками
            createComplexTone(80, 1.2, [1, 1.5, 2.1, 3.2], 0.2);
            setTimeout(() => createNoise(0.3, 0.05), 200);
            setTimeout(() => createComplexTone(60, 0.8, [1, 2.5], 0.15), 500);
            setTimeout(() => createComplexTone(120, 0.6, [1, 1.8], 0.12), 800);
            break;
            
          case 'doorSlam':
            // Реалистичный звук металлической двери
            createNoise(0.1, 0.3);
            createComplexTone(40, 0.4, [1, 3, 5, 7], 0.25);
            setTimeout(() => createComplexTone(35, 0.2, [1, 2], 0.1), 100);
            setTimeout(() => createNoise(0.05, 0.1), 150);
            break;
            
          case 'cameraSwitch':
            // Электронный звук с треском
            createComplexTone(1200, 0.05, [1], 0.1);
            setTimeout(() => createNoise(0.02, 0.08), 25);
            setTimeout(() => createComplexTone(800, 0.03, [1], 0.08), 50);
            break;
            
          case 'powerOut':
            // Отключение с реалистичным затуханием
            const powerOsc = audioContext.createOscillator();
            const powerGain = audioContext.createGain();
            const filter = audioContext.createBiquadFilter();
            
            powerOsc.connect(filter);
            filter.connect(powerGain);
            powerGain.connect(audioContext.destination);
            
            powerOsc.frequency.setValueAtTime(300, audioContext.currentTime);
            powerOsc.frequency.exponentialRampToValueAtTime(20, audioContext.currentTime + 3);
            powerOsc.type = 'sawtooth';
            
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(1000, audioContext.currentTime);
            filter.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 3);
            
            powerGain.gain.setValueAtTime(0.2, audioContext.currentTime);
            powerGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 3);
            
            powerOsc.start(audioContext.currentTime);
            powerOsc.stop(audioContext.currentTime + 3);
            
            setTimeout(() => createNoise(0.5, 0.03), 1000);
            break;
            
          case 'fredyAttack':
            // СКРИМЕР - очень громкий и страшный звук
            // Резкий рёв с максимальной громкостью
            createComplexTone(30, 2, [1, 2, 3, 4, 5, 6], 0.8);
            createNoise(2, 0.4);
            
            // Добавляем высокочастотный скрип
            setTimeout(() => createComplexTone(2000, 1.5, [1, 1.5], 0.6), 100);
            setTimeout(() => createComplexTone(50, 1.8, [1, 3, 5], 0.7), 200);
            
            // Глитч-эффекты
            for (let i = 0; i < 10; i++) {
              setTimeout(() => {
                createComplexTone(Math.random() * 500 + 100, 0.1, [1], 0.4);
              }, i * 150);
            }
            break;
            
          case 'footsteps':
            // Реалистичные шаги по металлическому полу
            createNoise(0.1, 0.15);
            createComplexTone(25, 0.3, [1, 4, 7], 0.12);
            setTimeout(() => {
              createNoise(0.08, 0.12);
              createComplexTone(22, 0.25, [1, 3], 0.1);
            }, 400);
            break;
            
          case 'ambientHum':
            // Глубокий мрачный гул вентиляции
            createComplexTone(40, 3, [1, 1.5, 2.2], 0.04);
            setTimeout(() => createNoise(1, 0.01), 500);
            break;
            
          case 'breathing':
            // Тяжелое дыхание
            createNoise(0.8, 0.06);
            createComplexTone(60, 0.8, [1], 0.03);
            break;
            
          case 'staticNoise':
            // Помехи на камерах
            createNoise(0.2, 0.1);
            break;
            
          case 'victory':
            // Победная мелодия
            createComplexTone(440, 0.5, [1, 2], 0.12);
            setTimeout(() => createComplexTone(554, 0.5, [1, 2], 0.12), 250);
            setTimeout(() => createComplexTone(659, 0.8, [1, 2], 0.15), 500);
            break;
            
          case 'gameStart':
            // Напряженное начало
            createComplexTone(100, 2, [1, 2.1, 3.5], 0.08);
            setTimeout(() => createNoise(0.5, 0.02), 500);
            break;
        }
      } catch (e) {
        console.log('Audio not supported');
      }
    }
  };

  return { playSound };
};