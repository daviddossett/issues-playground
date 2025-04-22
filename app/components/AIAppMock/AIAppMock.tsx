// filepath: /Users/daviddossett/projects/spark/app/components/AIAppMock/AIAppMock.tsx
"use client";

import { useState, useEffect } from "react";
import styles from "./AIAppMock.module.css";

interface Destination {
  id: number;
  name: string;
  image: string;
  description: string;
  activities: string[];
  weather: string;
  budget: string;
}

interface AIAppMockProps {
  isIterating: boolean;
  setIsIterating: (isIterating: boolean) => void;
}

export default function AIAppMock({ isIterating, setIsIterating }: AIAppMockProps) {
  // User preferences state
  const [preferences, setPreferences] = useState({
    climate: "warm",
    budget: "moderate",
    activityLevel: "moderate",
    duration: 7,
  });

  // App state
  const [loading, setLoading] = useState(false);
  const [generatingStep, setGeneratingStep] = useState(0);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [itinerary, setItinerary] = useState<string[]>([]);
  const [showItinerary, setShowItinerary] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Analyzing your preferences...");
  const [isExiting, setIsExiting] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isMessageExiting, setIsMessageExiting] = useState(false);

  const loadingMessages = [
    "Analyzing your preferences...",
    "Adding some AI magic...",
    "Optimizing the interface...",
    "Generating fresh ideas...",
    "Making it more delightful...",
    "Adding that special touch...",
    "Almost there...",
  ];

  const updateMessage = (newMessage: string) => {
    setIsMessageExiting(true);
    setTimeout(() => {
      setLoadingMessage(newMessage);
      setIsMessageExiting(false);
    }, 200);
  };

  // Watch for changes in isIterating prop
  useEffect(() => {
    if (isIterating) {
      setIsExiting(false);
      setShouldRender(true);
      setIsMessageExiting(false);
      let messageIndex = 1;

      const messageInterval = setInterval(() => {
        updateMessage(loadingMessages[messageIndex]);
        messageIndex = (messageIndex + 1) % loadingMessages.length;
      }, 2000);

      return () => {
        clearInterval(messageInterval);
        setIsExiting(true);
        setTimeout(() => {
          setShouldRender(false);
          setLoadingMessage(loadingMessages[0]);
        }, 200);
      };
    }
  }, [isIterating]);

  // Mock data for destinations
  const mockDestinations: Record<string, Destination[]> = {
    warm: [
      {
        id: 1,
        name: "Bali, Indonesia",
        image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
        description: "Experience the perfect blend of beaches, culture, and adventure in this tropical paradise.",
        activities: ["Surfing", "Temple visits", "Rice terrace hikes", "Snorkeling"],
        weather: "Sunny and warm, 80-90°F",
        budget: "$80-150/day",
      },
      {
        id: 2,
        name: "Costa Rica",
        image: "https://images.unsplash.com/photo-1518259102261-b40a9d98c463",
        description: "Discover pristine beaches, rainforests, and abundant wildlife in this eco-friendly destination.",
        activities: ["Zip-lining", "Wildlife watching", "Waterfall hikes", "Surfing"],
        weather: "Tropical, 75-85°F",
        budget: "$70-130/day",
      },
      {
        id: 3,
        name: "Barcelona, Spain",
        image: "https://images.unsplash.com/photo-1583422409516-2895a77efded",
        description: "Immerse yourself in stunning architecture, vibrant culture, and Mediterranean beaches.",
        activities: ["Visiting Sagrada Familia", "Beach relaxation", "Tapas tours", "Gothic Quarter exploration"],
        weather: "Sunny, 70-85°F",
        budget: "$100-200/day",
      },
    ],
    cold: [
      {
        id: 4,
        name: "Reykjavik, Iceland",
        image: "https://images.unsplash.com/photo-1504893524553-b855bce32c67",
        description:
          "Experience otherworldly landscapes, hot springs, and the northern lights in this arctic wonderland.",
        activities: ["Northern Lights tours", "Hot spring bathing", "Glacier hikes", "Whale watching"],
        weather: "Cold, 30-50°F",
        budget: "$150-250/day",
      },
      {
        id: 5,
        name: "Banff, Canada",
        image: "https://images.unsplash.com/photo-1561134643-a2b8acc6be38",
        description:
          "Explore stunning mountain landscapes, pristine lakes, and abundant wildlife in the Canadian Rockies.",
        activities: ["Skiing", "Hiking", "Wildlife photography", "Canoeing on Lake Louise"],
        weather: "Cold alpine, 20-60°F depending on season",
        budget: "$120-220/day",
      },
    ],
  };

  // Generate destinations based on preferences
  const generateDestinations = () => {
    setLoading(true);
    setShowItinerary(false);
    setSelectedDestination(null);
    setItinerary([]);

    // Simulate AI "thinking" with steps
    let step = 0;
    const interval = setInterval(() => {
      setGeneratingStep(step);
      step++;
      if (step > 3) {
        clearInterval(interval);
        setLoading(false);
        setDestinations(mockDestinations[preferences.climate]);
      }
    }, 800);
  };

  // Generate itinerary for selected destination
  const generateItinerary = () => {
    if (!selectedDestination) return;

    setLoading(true);
    setShowItinerary(false);

    // Simulate AI generating an itinerary
    let step = 0;
    const interval = setInterval(() => {
      setGeneratingStep(step);
      step++;
      if (step > 3) {
        clearInterval(interval);
        setLoading(false);

        // Create a mock itinerary based on the destination
        const mockItinerary = [];
        for (let i = 1; i <= preferences.duration; i++) {
          if (i === 1) {
            mockItinerary.push(
              `Day ${i}: Arrive in ${selectedDestination.name}. Check into hotel and explore local area.`
            );
          } else if (i === preferences.duration) {
            mockItinerary.push(`Day ${i}: Final sightseeing and departure.`);
          } else {
            const activity =
              selectedDestination.activities[Math.floor(Math.random() * selectedDestination.activities.length)];
            mockItinerary.push(`Day ${i}: ${activity} and local exploration.`);
          }
        }

        setItinerary(mockItinerary);
        setShowItinerary(true);
      }
    }, 800);
  };

  // Reset everything
  const startOver = () => {
    setPreferences({
      climate: "warm",
      budget: "moderate",
      activityLevel: "moderate",
      duration: 7,
    });
    setDestinations([]);
    setSelectedDestination(null);
    setItinerary([]);
    setShowItinerary(false);
  };

  // Loading/generating animation text
  const getLoadingText = () => {
    switch (generatingStep) {
      case 0:
        return "Analyzing your preferences...";
      case 1:
        return "Searching global destinations...";
      case 2:
        return "Checking travel conditions...";
      case 3:
        return "Finalizing recommendations...";
      default:
        return "Processing...";
    }
  };

  return (
    <div className={styles.appContainer}>
      <svg width="0" height="0" className="hidden">
        {/* Radius */}
        <symbol fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" id="radius_full">
          <path d="M2 16C2 8.26801 8.26801 2 16 2V2V16H2V16Z" fill="#0969DA" fillOpacity="0.2"></path>
          <path d="M16 2V2C8.26801 2 2 8.26801 2 16V16" stroke="#0969DA"></path>
        </symbol>
        <symbol fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" id="radius_large">
          <path d="M2 10C2 5.58172 5.58172 2 10 2H16V16H2V10Z" fill="#0969DA" fillOpacity="0.2"></path>
          <path d="M16 2H10C5.58172 2 2 5.58172 2 10V16" stroke="#0969DA"></path>
        </symbol>
        <symbol fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" id="radius_medium">
          <path d="M2 8C2 4.68629 4.68629 2 8 2H16V16H2V8Z" fill="#0969DA" fillOpacity="0.2"></path>
          <path d="M16 2H8C4.68629 2 2 4.68629 2 8V16" stroke="#0969DA"></path>
        </symbol>
        <symbol fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" id="radius_none">
          <rect x="2" y="2" width="14" height="14" fill="#0969DA" fillOpacity="0.2"></rect>
          <path d="M16 2H2V16" stroke="#0969DA"></path>
        </symbol>
        <symbol fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" id="radius_small">
          <path d="M2 5C2 3.34315 3.34315 2 5 2H16V16H2V5Z" fill="#0969DA" fillOpacity="0.2"></path>
          <path d="M16 2H5C3.34315 2 2 3.34315 2 5V16" stroke="#0969DA"></path>
        </symbol>
        {/* Static versions of variants/single icons*/}
        <symbol id="variants" viewBox="0 0 16 16" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.36451 6.1766L2.5867 6.84284M2.5867 6.84284L0.744528 3.35721C0.668472 3.2133 0.787177 3.04371 0.948427 3.06589L11.4948 4.5172C11.6743 4.5419 11.7309 4.77358 11.583 4.87825L3.07169 10.9021C2.94257 10.9935 2.76351 10.9057 2.75664 10.7477L2.5867 6.84284Z" strokeWidth="1.39869" strokeLinecap="round"/>
          <path d="M9.58118 11.3189H7.19763C7.10197 11.3189 7.01973 11.3867 7.00148 11.4806L6.37542 14.7028C6.34525 14.8581 6.49891 14.9852 6.64578 14.9264L15.1984 11.5054C15.3661 11.4382 15.3657 11.2006 15.1977 11.1341L10.0491 9.095" strokeWidth="1.34874" strokeLinecap="round"/>
        </symbol>
        <symbol id="single" viewBox="0 0 16 16" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M6.69608 8.00002H3.31249M3.31249 8.00002L2.1495 3.34807C2.10343 3.16378 2.28552 3.00484 2.46189 3.07539L14.2396 7.78645C14.4338 7.86416 14.435 8.13875 14.2414 8.21811L2.74372 12.931C2.57276 13.0011 2.3922 12.8537 2.42662 12.6722L3.31249 8.00002Z" strokeWidth="1.5" strokeLinecap="round"/>
        </symbol>
        {/* Sparkle spinner */}
        <symbol id="sparkle-spinner" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="#8E47FE" d="M16 8c-5.39 1.54-6.586 2.83-8 8-1.414-5.17-2.61-6.46-8-8 5.39-1.54 6.586-2.83 8-8 1.414 5.17 2.61 6.46 8 8Z"/>
        </symbol>
      </svg>

      {shouldRender && (
        <div className={`${styles.loadingOverlay} ${isExiting ? styles.exiting : ''}`}>
          <svg className={styles.sparkleSpinner}>
            <use href="#sparkle-spinner" />
          </svg>
          <div className={styles.loadingMessageContainer}>
            <p className={`${styles.loadingMessage} ${isMessageExiting ? styles.exiting : ''}`}>
              {loadingMessage}
            </p>
          </div>
        </div>
      )}
      <div className={styles.header}>
        <h1>Vacation Planner</h1>
        <p>Let AI find your perfect getaway</p>
      </div>

      <div className={styles.mainContent}>
        {/* Preferences Section */}
        <div className={styles.preferencesSection}>
          <h2>Your Travel Preferences</h2>
          <div className={styles.preferencesGrid}>
            <div className={styles.preferenceItem}>
              <label>Climate</label>
              <select
                value={preferences.climate}
                onChange={(e) => setPreferences({ ...preferences, climate: e.target.value })}
              >
                <option value="warm">Warm</option>
                <option value="cold">Cold</option>
              </select>
            </div>

            <div className={styles.preferenceItem}>
              <label>Budget</label>
              <select
                value={preferences.budget}
                onChange={(e) => setPreferences({ ...preferences, budget: e.target.value })}
              >
                <option value="budget">Budget</option>
                <option value="moderate">Moderate</option>
                <option value="luxury">Luxury</option>
              </select>
            </div>

            <div className={styles.preferenceItem}>
              <label>Activity Level</label>
              <select
                value={preferences.activityLevel}
                onChange={(e) => setPreferences({ ...preferences, activityLevel: e.target.value })}
              >
                <option value="relaxed">Relaxed</option>
                <option value="moderate">Moderate</option>
                <option value="active">Active</option>
              </select>
            </div>

            <div className={styles.preferenceItem}>
              <label>Duration (days)</label>
              <input
                type="range"
                min="3"
                max="14"
                value={preferences.duration}
                onChange={(e) => setPreferences({ ...preferences, duration: parseInt(e.target.value) })}
              />
              <span>{preferences.duration} days</span>
            </div>
          </div>

          <button className={styles.generateButton} onClick={generateDestinations}>
            Generate Vacation Ideas
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingAnimation}>
              <div className={styles.loadingCircle}></div>
              <div className={styles.loadingCircle}></div>
              <div className={styles.loadingCircle}></div>
            </div>
            <p>{getLoadingText()}</p>
          </div>
        )}

        {/* Destinations Display */}
        {!loading && destinations.length > 0 && !showItinerary && (
          <div className={styles.destinationsContainer}>
            <h2>Recommended Destinations</h2>
            <p className={styles.aiNote}>Based on your preferences, I recommend these destinations:</p>

            <div className={styles.destinationCards}>
              {destinations.map((destination) => (
                <div
                  key={destination.id}
                  className={`${styles.destinationCard} ${selectedDestination?.id === destination.id ? styles.selectedCard : ""}`}
                  onClick={() => setSelectedDestination(destination)}
                >
                  <div className={styles.destinationImage} style={{ backgroundImage: `url(${destination.image})` }}>
                    {selectedDestination?.id === destination.id && (
                      <div className={styles.selectedOverlay}>Selected</div>
                    )}
                  </div>
                  <div className={styles.destinationInfo}>
                    <h3>{destination.name}</h3>
                    <p>{destination.description}</p>
                    <div className={styles.destinationMeta}>
                      <span>
                        <strong>Weather:</strong> {destination.weather}
                      </span>
                      <span>
                        <strong>Budget:</strong> {destination.budget}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.actionButtons}>
              <button className={styles.secondaryButton} onClick={startOver}>
                Start Over
              </button>
              <button
                className={`${styles.primaryButton} ${!selectedDestination ? styles.disabledButton : ""}`}
                onClick={generateItinerary}
                disabled={!selectedDestination}
              >
                Create Itinerary
              </button>
            </div>
          </div>
        )}

        {/* Itinerary Display */}
        {!loading && showItinerary && selectedDestination && (
          <div className={styles.itineraryContainer}>
            <div className={styles.itineraryHeader}>
              <h2>Your Personalized Itinerary</h2>
              <p>
                A {preferences.duration}-day trip to {selectedDestination.name}
              </p>
            </div>

            <div className={styles.itineraryContent}>
              {itinerary.map((day, index) => (
                <div key={index} className={styles.itineraryDay}>
                  <div className={styles.dayMarker}>{index + 1}</div>
                  <div className={styles.dayContent}>{day}</div>
                </div>
              ))}
            </div>

            <div className={styles.aiSuggestion}>
              <div className={styles.aiIcon}>AI</div>
              <div>
                <p>
                  <strong>Travel Tip:</strong> Based on your {preferences.activityLevel} activity preference, I&apos;ve
                  balanced active days with relaxation time. Consider booking activities in advance for the best
                  experience.
                </p>
              </div>
            </div>

            <div className={styles.actionButtons}>
              <button className={styles.secondaryButton} onClick={() => setShowItinerary(false)}>
                Back to Destinations
              </button>
              <button className={styles.secondaryButton} onClick={startOver}>
                Start Over
              </button>
              <button className={styles.primaryButton}>Save Itinerary</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
