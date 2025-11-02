import { useEffect, useMemo, useState } from "react";

const UNITS = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Minutes" },
  { key: "seconds", label: "Seconds" },
];

const createZeroTime = () => ({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
});

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState(createZeroTime);
  const [prevTimeLeft, setPrevTimeLeft] = useState(createZeroTime);

  useEffect(() => {
    const countdownDate = new Date("2025-12-01T19:30:00").getTime();

    let intervalId = 0;

    const update = () => {
      const now = Date.now();
      const distance = countdownDate - now;

      if (distance <= 0) {
        setTimeLeft((current) => {
          setPrevTimeLeft(current);
          return createZeroTime();
        });
        if (intervalId) {
          clearInterval(intervalId);
        }
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      const next = { days, hours, minutes, seconds };

      setTimeLeft((current) => {
        setPrevTimeLeft(current);
        return next;
      });
    };

    update();
    intervalId = window.setInterval(update, 1000);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  const formattedValues = useMemo(
    () => ({
      days: String(timeLeft.days),
      hours: String(timeLeft.hours).padStart(2, "0"),
      minutes: String(timeLeft.minutes).padStart(2, "0"),
      seconds: String(timeLeft.seconds).padStart(2, "0"),
    }),
    [timeLeft]
  );

  return (
    <div className="countdown" role="timer" aria-live="polite">
      <h2 className="countdown__title">Days until release:</h2>
      <div className="countdown__grid">
        {UNITS.map(({ key, label }) => {
          const display = formattedValues[key];
          const raw = timeLeft[key];
          const hasChanged = raw !== prevTimeLeft[key];
          const valueClassName = hasChanged
            ? "countdown__value countdown__value--changed"
            : "countdown__value";
          const itemKey = `${key}-${display}`;

          return (
            <div className="countdown__item" key={itemKey}>
              <div className={valueClassName} aria-label={`${raw} ${label}`}>
                <span className="countdown__value-single">{display}</span>
              </div>
              <span className="countdown__label">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Countdown;
