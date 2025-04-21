// filepath: /Users/daviddossett/projects/spark/app/components/AIAppMock/AIAppMock.tsx
"use client";

import { useState } from "react";
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

export default function AIAppMock() {
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
      <div className={styles.header}>
        <h1>Mock App</h1>
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
