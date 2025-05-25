import React from 'react';

interface WeatherAnimationProps {
  weatherId: number;
  isDay: boolean;
}

const WeatherAnimation: React.FC<WeatherAnimationProps> = ({ weatherId, isDay }) => {
  // Determine animation based on weather condition code
  // See https://openweathermap.org/weather-conditions for codes
  
  // Thunderstorm (200-299)
  if (weatherId >= 200 && weatherId < 300) {
    return <ThunderstormAnimation />;
  }
  
  // Drizzle (300-399) or Rain (500-599)
  if ((weatherId >= 300 && weatherId < 400) || (weatherId >= 500 && weatherId < 600)) {
    return <RainAnimation heavy={weatherId >= 502 || (weatherId >= 302 && weatherId < 400)} />;
  }
  
  // Snow (600-699)
  if (weatherId >= 600 && weatherId < 700) {
    return <SnowAnimation />;
  }
  
  // Atmosphere conditions (700-799): mist, fog, etc.
  if (weatherId >= 700 && weatherId < 800) {
    return <FogAnimation />;
  }
  
  // Clear sky (800)
  if (weatherId === 800) {
    return isDay ? <SunAnimation /> : <MoonAnimation />;
  }
  
  // Clouds (801-899)
  if (weatherId > 800 && weatherId < 900) {
    return <CloudAnimation />;
  }
  
  // Default fallback (just in case)
  return null;
};

const SunAnimation: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-10 right-10 w-24 h-24 rounded-full bg-yellow-400 animate-pulse opacity-60 shadow-lg shadow-yellow-300"></div>
      <div className="absolute top-10 right-10 w-24 h-24 rounded-full bg-yellow-300 animate-ping opacity-30"></div>
    </div>
  );
};

const MoonAnimation: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-10 right-10 w-16 h-16 rounded-full bg-gray-200 animate-pulse opacity-60 shadow-lg shadow-gray-200/30"></div>
      <div className="stars absolute inset-0"></div>
    </div>
  );
};

const CloudAnimation: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="cloud absolute top-5 left-10 w-20 h-8 bg-white rounded-full opacity-40 animate-float"></div>
      <div className="cloud absolute top-20 right-20 w-32 h-10 bg-white rounded-full opacity-30 animate-float-delay"></div>
      <div className="cloud absolute bottom-10 left-1/4 w-24 h-8 bg-white rounded-full opacity-20 animate-float-slow"></div>
    </div>
  );
};

const RainAnimation: React.FC<{ heavy: boolean }> = ({ heavy }) => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="cloud absolute top-0 left-10 w-full h-10 bg-gray-400 rounded-full opacity-30"></div>
      <div className="rain-container absolute inset-0">
        {Array.from({ length: heavy ? 40 : 20 }).map((_, i) => (
          <div 
            key={i}
            className="rain-drop absolute w-0.5 bg-blue-400 opacity-50 animate-rain"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-${Math.random() * 20}%`,
              height: `${Math.random() * 10 + 15}px`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${Math.random() * 1 + 1}s`
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

const SnowAnimation: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="cloud absolute top-0 left-10 w-full h-10 bg-gray-200 rounded-full opacity-30"></div>
      <div className="snow-container absolute inset-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <div 
            key={i}
            className="snowflake absolute w-1.5 h-1.5 rounded-full bg-white opacity-70 animate-snow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-${Math.random() * 20}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 3 + 3}s`
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

const ThunderstormAnimation: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="cloud absolute top-0 left-0 w-full h-10 bg-gray-700 rounded-full opacity-50"></div>
      <RainAnimation heavy={true} />
      
      <div className="lightning absolute inset-0 opacity-0 bg-yellow-100 animate-lightning"></div>
      <div 
        className="lightning-bolt absolute opacity-0 animate-lightning-bolt" 
        style={{
          top: '20%',
          left: '30%',
          width: '3px',
          height: '100px',
          background: 'linear-gradient(to bottom, transparent, yellow, transparent)',
          transform: 'rotate(20deg)'
        }}
      ></div>
    </div>
  );
};

const FogAnimation: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {Array.from({ length: 5 }).map((_, i) => (
        <div 
          key={i}
          className="fog-layer absolute h-10 w-full bg-gray-300 opacity-20 animate-fog"
          style={{
            top: `${i * 20}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${7 + i}s`
          }}
        ></div>
      ))}
    </div>
  );
};

export default WeatherAnimation;