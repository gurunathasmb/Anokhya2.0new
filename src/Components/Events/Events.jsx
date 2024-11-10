import { useRef, useEffect, useState } from "react";
import "./Events.css";
import event_data from "../../Assets/Data/Events_data.json";

const Events = () => {
  const sliderRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const scrollInterval = useRef(null);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 650);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Start infinite scroll on desktop
  useEffect(() => {
    if (!isMobile && sliderRef.current) {
      startAutoScroll();
    }

    return () => stopAutoScroll();
  }, [isMobile]);

  const startAutoScroll = () => {
    stopAutoScroll();
    scrollInterval.current = setInterval(() => {
      if (sliderRef.current) {
        sliderRef.current.scrollLeft += 1;
        // If scrolled to the end, reset scroll
        if (
          sliderRef.current.scrollLeft >=
          sliderRef.current.scrollWidth - sliderRef.current.clientWidth
        ) {
          sliderRef.current.scrollLeft = 0;
        }
      }
    }, 20); // Adjust speed if needed
  };

  const stopAutoScroll = () => {
    if (scrollInterval.current) clearInterval(scrollInterval.current);
  };

  // Mobile touch handlers
  const handleTouchStart = () => {
    if (!isMobile) return;
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isMobile || !isDragging) return;
    e.preventDefault();
    sliderRef.current.scrollLeft -= e.touches[0].pageX;
  };

  const handleTouchEnd = () => {
    if (!isMobile) return;
    setIsDragging(false);
  };

  return (
    <div className="events" id="Events">
      <div className="events_con">
        <div className="events_head">
          <h2>EVENTS</h2>
          <p>Click on event card to know more !!</p>
        </div>
        <div className="event_con">
          <ul
            className="slider"
            ref={sliderRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {event_data.map((ele, index) => (
              <li
                className="item"
                key={`${ele.event_id}-${index}`}
                style={{ backgroundImage: `url(${ele.img_path})` }}
              >
                <div className="content">
                  <a href={`/events/${ele.event_id}`}>Explore More</a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Events;
